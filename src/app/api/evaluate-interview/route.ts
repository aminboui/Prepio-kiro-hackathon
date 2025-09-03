import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        console.log('Interview evaluation API called');

        const body = await request.json();
        console.log('Request body keys:', Object.keys(body));

        const {
            sessionData,
            challengeData,
            codeSolution,
            technicalQuestions,
            technicalAnswers,
            behavioralQuestions,
            behavioralAnswers
        } = body;

        // Check if API key exists
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('Google AI API key not found');
            return NextResponse.json(
                { error: 'Google AI API key not configured' },
                { status: 500 }
            );
        }

        console.log('Creating model for evaluation...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Create comprehensive evaluation prompt
        const prompt = `Evaluate this technical interview performance and provide detailed feedback.

INTERVIEW CONTEXT:
- Company Type: ${sessionData.companyType}
- Role: ${sessionData.role}
- Experience Level: ${sessionData.experience}
- Programming Language: ${sessionData.language}

CODING CHALLENGE:
Problem: ${challengeData?.title || 'Coding Problem'}
Description: ${challengeData?.description || 'N/A'}
User's Solution:
\`\`\`${sessionData.language}
${codeSolution}
\`\`\`

TECHNICAL QUESTIONS & ANSWERS:
${technicalQuestions?.questions?.map((q: any, i: number) => `
Q${i + 1}: ${q.question}
Answer: ${technicalAnswers[i] || 'No answer provided'}
`).join('\n') || 'No technical questions'}

BEHAVIORAL QUESTIONS & ANSWERS:
${behavioralQuestions?.questions?.map((q: any, i: number) => `
Q${i + 1}: ${q.question}
Answer: ${behavioralAnswers[i] || 'No answer provided'}
`).join('\n') || 'No behavioral questions'}

Please evaluate and return ONLY valid JSON in this format:
{
  "overallScore": 75,
  "codingScore": 80,
  "technicalScore": 70,
  "behavioralScore": 75,
  "strengths": [
    "Strong problem-solving approach",
    "Clear communication skills",
    "Good understanding of algorithms"
  ],
  "improvements": [
    "Consider edge cases in coding solutions",
    "Provide more specific examples in behavioral answers",
    "Explain time complexity analysis"
  ],
  "feedback": "Overall solid performance with good technical skills. The coding solution demonstrates understanding of the problem, though there's room for optimization. Behavioral answers show good self-awareness but could benefit from more specific examples using the STAR method.",
  "codingFeedback": "The solution works correctly but could be optimized for better time complexity. Consider using a hash map for O(n) solution.",
  "technicalFeedback": "Good understanding of core concepts. Answers show practical knowledge but could dive deeper into system design considerations.",
  "behavioralFeedback": "Responses demonstrate good self-reflection and problem-solving mindset. Use more specific examples and quantify results when possible."
}

Scoring Guidelines:
- 90-100: Exceptional performance, ready for senior roles
- 80-89: Strong performance, good fit for the role
- 70-79: Solid performance with some areas for improvement
- 60-69: Adequate performance, needs development
- Below 60: Significant improvement needed

Consider the experience level when scoring - be more lenient for entry level, more demanding for senior level.`;

        console.log('Generating evaluation with prompt length:', prompt.length);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('AI evaluation response received, length:', text.length);

        // Try to parse as JSON, fallback if parsing fails
        let evaluationReport;
        try {
            evaluationReport = JSON.parse(text);
            console.log('Successfully parsed evaluation JSON');
        } catch (parseError) {
            console.log('JSON parsing failed, using fallback evaluation');

            // Generate strict, accurate scores based on content analysis

            // Coding Score Analysis
            let codingScore = 0;
            if (codeSolution && challengeData?.starterCode) {
                const isUnchanged = codeSolution.trim() === challengeData.starterCode.trim();
                const hasMinimalChanges = codeSolution.length - challengeData.starterCode.length < 10;
                const hasOnlyComments = codeSolution.replace(challengeData.starterCode, '').trim().startsWith('//') ||
                    codeSolution.replace(challengeData.starterCode, '').trim().startsWith('/*');

                if (isUnchanged) {
                    codingScore = 0; // No attempt
                } else if (hasMinimalChanges || hasOnlyComments) {
                    codingScore = 10; // Minimal effort
                } else if (codeSolution.length > challengeData.starterCode.length + 50) {
                    // Check for actual implementation
                    const hasLogic = codeSolution.includes('for') || codeSolution.includes('while') ||
                        codeSolution.includes('if') || codeSolution.includes('return') ||
                        codeSolution.includes('map') || codeSolution.includes('filter');
                    const hasDataStructures = codeSolution.includes('Map') || codeSolution.includes('Set') ||
                        codeSolution.includes('{}') || codeSolution.includes('[]');

                    if (hasLogic && hasDataStructures) {
                        codingScore = 85; // Good implementation
                    } else if (hasLogic) {
                        codingScore = 65; // Basic implementation
                    } else {
                        codingScore = 25; // Poor implementation
                    }
                } else {
                    codingScore = 20; // Insufficient code
                }
            }

            // Technical Score Analysis
            let technicalScore = 0;
            if (technicalAnswers && technicalAnswers.length > 0) {
                let totalQuestions = technicalAnswers.length;
                let qualityScore = 0;

                technicalAnswers.forEach((answer: string) => {
                    if (answer && answer.trim().length > 0) {
                        if (answer.trim().length < 5) {
                            // Single letters or very short answers
                            qualityScore += 5;
                        } else if (answer.trim().length < 20) {
                            // Short but some effort
                            qualityScore += 25;
                        } else if (answer.trim().length < 100) {
                            // Decent length answer
                            qualityScore += 60;
                        } else {
                            // Comprehensive answer
                            qualityScore += 85;
                        }
                    }
                });

                technicalScore = totalQuestions > 0 ? Math.round(qualityScore / totalQuestions) : 0;
            }

            // Behavioral Score Analysis
            let behavioralScore = 0;
            if (behavioralAnswers && behavioralAnswers.length > 0) {
                let totalQuestions = behavioralAnswers.length;
                let qualityScore = 0;

                behavioralAnswers.forEach((answer: string) => {
                    if (answer && answer.trim().length > 0) {
                        if (answer.trim().length < 5) {
                            // Single letters or very short answers
                            qualityScore += 0;
                        } else if (answer.trim().length < 30) {
                            // Too short for behavioral
                            qualityScore += 15;
                        } else if (answer.trim().length < 100) {
                            // Minimal behavioral response
                            qualityScore += 40;
                        } else if (answer.trim().length < 200) {
                            // Good behavioral response
                            qualityScore += 70;
                        } else {
                            // Excellent detailed response
                            qualityScore += 90;
                        }
                    }
                });

                behavioralScore = totalQuestions > 0 ? Math.round(qualityScore / totalQuestions) : 0;
            }

            const overallScore = Math.round((codingScore + technicalScore + behavioralScore) / 3);

            evaluationReport = {
                overallScore,
                codingScore,
                technicalScore,
                behavioralScore,
                strengths: (() => {
                    const strengths = [];
                    if (codingScore >= 70) strengths.push("Provided a working code solution");
                    else if (codingScore >= 30) strengths.push("Made an attempt at the coding challenge");

                    if (technicalScore >= 60) strengths.push("Engaged meaningfully with technical questions");
                    else if (technicalScore >= 20) strengths.push("Participated in technical discussion");

                    if (behavioralScore >= 60) strengths.push("Provided structured behavioral responses");
                    else if (behavioralScore >= 20) strengths.push("Attempted to answer behavioral questions");

                    if (strengths.length === 0) strengths.push("Completed the interview process");
                    return strengths;
                })(),
                improvements: (() => {
                    const improvements = [];
                    if (codingScore < 30) improvements.push("CRITICAL: Write actual code solutions, not just comments or single characters");
                    else if (codingScore < 70) improvements.push("Focus on writing more complete and optimized code solutions");

                    if (technicalScore < 20) improvements.push("CRITICAL: Provide meaningful answers to technical questions, not single letters");
                    else if (technicalScore < 60) improvements.push("Provide more detailed technical explanations with examples");

                    if (behavioralScore < 20) improvements.push("CRITICAL: Answer behavioral questions with complete sentences and examples");
                    else if (behavioralScore < 60) improvements.push("Use the STAR method (Situation, Task, Action, Result) for behavioral responses");

                    improvements.push("Practice explaining your thought process clearly");
                    improvements.push("Prepare specific examples before the interview");
                    return improvements;
                })(),
                feedback: (() => {
                    if (overallScore < 20) {
                        return "This interview performance indicates significant preparation is needed. Most responses were incomplete or consisted of single characters. Focus on practicing coding problems, preparing technical explanations, and developing specific examples for behavioral questions.";
                    } else if (overallScore < 40) {
                        return "The interview performance shows minimal effort across all areas. While you participated, the responses lacked depth and completeness. Invest time in coding practice, technical concept review, and behavioral question preparation.";
                    } else if (overallScore < 60) {
                        return "Your interview performance shows some engagement but needs significant improvement. Focus on providing complete, thoughtful responses rather than brief answers. Practice coding problems daily and prepare specific examples for behavioral questions.";
                    } else if (overallScore < 75) {
                        return "Solid interview performance with room for improvement. Your responses show understanding but could be more detailed and comprehensive. Continue practicing and refining your explanations.";
                    } else {
                        return "Strong interview performance across all areas. Your responses demonstrate good technical knowledge and communication skills. Minor refinements in specific areas could make you even stronger.";
                    }
                })(),
                codingFeedback: (() => {
                    if (codingScore === 0) return "No code solution was provided. You must write actual code to solve the problem.";
                    if (codingScore < 20) return "The code solution was incomplete or consisted mainly of comments/single characters. Focus on implementing actual logic.";
                    if (codingScore < 50) return "The code shows some effort but lacks proper implementation. Practice coding problems and focus on complete solutions.";
                    if (codingScore < 70) return "Decent coding attempt but could be optimized. Consider time complexity and edge cases.";
                    return "Good coding approach with room for optimization and edge case handling.";
                })(),
                technicalFeedback: (() => {
                    if (technicalScore < 10) return "Technical answers were mostly single characters or empty. You need to provide complete, thoughtful explanations.";
                    if (technicalScore < 30) return "Technical responses were too brief and lacked depth. Expand your answers with examples and explanations.";
                    if (technicalScore < 60) return "Technical knowledge is present but explanations need more detail and examples.";
                    return "Solid technical understanding with good explanations.";
                })(),
                behavioralFeedback: (() => {
                    if (behavioralScore < 10) return "Behavioral answers were inadequate (single letters/words). You must provide complete stories using the STAR method.";
                    if (behavioralScore < 30) return "Behavioral responses were too brief. Use the STAR method with specific examples and detailed explanations.";
                    if (behavioralScore < 60) return "Behavioral answers show some effort but need more structure and specific examples using STAR format.";
                    return "Good behavioral responses with relevant examples and proper structure.";
                })()
            };
        }

        return NextResponse.json(evaluationReport);
    } catch (error) {
        console.error('Error evaluating interview:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');

        // Return a basic fallback evaluation
        return NextResponse.json({
            overallScore: 65,
            codingScore: 60,
            technicalScore: 65,
            behavioralScore: 70,
            strengths: [
                "Completed the interview process",
                "Engaged with all questions",
                "Demonstrated willingness to learn"
            ],
            improvements: [
                "Practice coding problems regularly",
                "Prepare more detailed technical explanations",
                "Use specific examples in behavioral questions"
            ],
            feedback: "Thank you for completing the interview simulation. This experience helps identify areas for improvement in your interview skills. Continue practicing and you'll see improvement in your performance.",
            codingFeedback: "Focus on writing complete, working solutions and explaining your approach clearly.",
            technicalFeedback: "Prepare for technical questions by reviewing core concepts and practicing explanations.",
            behavioralFeedback: "Use the STAR method to structure your behavioral responses with specific examples."
        });
    }
}