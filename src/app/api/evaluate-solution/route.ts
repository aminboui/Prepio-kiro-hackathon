import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export interface Challenge {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  skillLevel: string;
  challengeType: string;
  expectedOutput?: string;
  hints?: string[];
}

export interface FeedbackResponse {
  score: number;
  correctness: number;
  efficiency: number;
  codeQuality: number;
  feedback: string;
  suggestions: string[];
  isCorrect: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challenge, userCode }: { challenge: Challenge; userCode: string } = body;

    if (!challenge || !userCode) {
      return NextResponse.json(
        { error: 'Missing challenge or user code' },
        { status: 400 }
      );
    }

    // Use the fast and reliable Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Check if user submitted identical code
    const originalNormalized = challenge.code.trim().replace(/\s+/g, ' ');
    const userNormalized = userCode.trim().replace(/\s+/g, ' ');
    const isIdentical = originalNormalized === userNormalized;

    // Create comprehensive evaluation prompt
    const prompt = `You are an expert code reviewer. Evaluate this ${challenge.language} coding solution.

CHALLENGE: ${challenge.title}
TYPE: ${challenge.challengeType}
DESCRIPTION: ${challenge.description}
EXPECTED OUTPUT: ${challenge.expectedOutput || 'Not specified'}

ORIGINAL CODE:
${challenge.code}

USER'S SOLUTION:
${userCode}

EVALUATION CRITERIA:
1. CORRECTNESS (0-100): Does the solution work correctly and solve the problem?
2. EFFICIENCY (0-100): Is the algorithm efficient in time/space complexity?
3. CODE QUALITY (0-100): Is the code clean, readable, and well-structured?

SCORING GUIDELINES:
- If code is identical to original: Give very low scores (10-25)
- For bug-fix challenges: User must actually fix the bugs
- For completion challenges: User must complete missing parts
- Be realistic with efficiency scores (90+ only for optimal solutions)
- Consider ${challenge.skillLevel} skill level in evaluation

${isIdentical ? '⚠️ WARNING: User submitted identical code - this should receive low scores!' : ''}

Respond with ONLY this JSON format (no markdown, no extra text):
{
  "correctness": 85,
  "efficiency": 78,
  "codeQuality": 82,
  "feedback": "Clear, specific feedback about the solution quality and what was done well or needs improvement",
  "suggestions": ["Specific actionable suggestion 1", "Specific actionable suggestion 2", "Specific actionable suggestion 3"],
  "isCorrect": true
}`;

    // Generate evaluation
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse AI response
    let cleanResponse = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanResponse.includes('```')) {
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }

    // Extract JSON object
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    let evaluationData;
    try {
      evaluationData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error('Invalid JSON in AI response');
    }

    // Validate required fields
    if (typeof evaluationData.correctness !== 'number' ||
      typeof evaluationData.efficiency !== 'number' ||
      typeof evaluationData.codeQuality !== 'number') {
      throw new Error('Missing required numeric scores in AI response');
    }

    // Calculate overall score
    const overallScore = Math.round(
      (evaluationData.correctness + evaluationData.efficiency + evaluationData.codeQuality) / 3
    );

    // Apply additional validation for identical code
    if (isIdentical) {
      evaluationData.correctness = Math.min(evaluationData.correctness, 20);
      evaluationData.efficiency = Math.min(evaluationData.efficiency, 15);
      evaluationData.codeQuality = Math.min(evaluationData.codeQuality, 25);
      evaluationData.isCorrect = false;
      evaluationData.feedback = "You submitted the original code without any changes. " +
        (challenge.challengeType === 'bug-fix'
          ? "Please identify and fix the bugs in the code."
          : "Please complete the missing parts of the code.");
    }

    // Recalculate score if adjustments were made
    const finalScore = isIdentical ? Math.round(
      (evaluationData.correctness + evaluationData.efficiency + evaluationData.codeQuality) / 3
    ) : overallScore;

    const feedback: FeedbackResponse = {
      score: finalScore,
      correctness: evaluationData.correctness,
      efficiency: evaluationData.efficiency,
      codeQuality: evaluationData.codeQuality,
      feedback: evaluationData.feedback || 'Solution evaluated successfully.',
      suggestions: Array.isArray(evaluationData.suggestions) ? evaluationData.suggestions : [
        'Review your solution for potential improvements',
        'Consider edge cases and error handling',
        'Look for optimization opportunities'
      ],
      isCorrect: evaluationData.isCorrect !== false && finalScore >= 70
    };

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Error in evaluate-solution API:', error);

    // Provide intelligent fallback based on code comparison
    const body = await request.json().catch(() => ({}));
    const { challenge, userCode } = body;

    let fallbackScore = 75;
    let fallbackCorrectness = 80;
    let fallbackFeedback = 'Your solution has been submitted successfully. AI evaluation is temporarily unavailable.';

    // If we can compare codes, provide better fallback
    if (challenge && userCode) {
      const isIdentical = challenge.code.trim().replace(/\s+/g, ' ') === userCode.trim().replace(/\s+/g, ' ');
      if (isIdentical) {
        fallbackScore = 15;
        fallbackCorrectness = 10;
        fallbackFeedback = 'You submitted the original code without changes. Please modify the code to solve the challenge.';
      }
    }

    const fallbackResponse: FeedbackResponse = {
      score: fallbackScore,
      correctness: fallbackCorrectness,
      efficiency: 70,
      codeQuality: 75,
      feedback: fallbackFeedback,
      suggestions: [
        'Review your code for potential bugs or improvements',
        'Test your solution with different inputs',
        'Consider code readability and best practices'
      ],
      isCorrect: fallbackScore >= 70
    };

    return NextResponse.json(fallbackResponse);
  }
}