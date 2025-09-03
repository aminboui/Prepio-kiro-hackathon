import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export interface ChallengeRequest {
  language: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  challengeType: 'bug-fix' | 'code-completion';
}

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

export async function POST(request: NextRequest) {
  let language: string = '';
  let skillLevel: string = '';
  let challengeType: string = '';

  try {
    const body: ChallengeRequest = await request.json();
    ({ language, skillLevel, challengeType } = body);

    if (!language || !skillLevel || !challengeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate a ${challengeType} coding challenge for ${skillLevel} level in ${language}.

Requirements:
- For bug-fix: Provide code with 1-2 subtle bugs that need fixing
- For code-completion: Provide incomplete code that needs completion
- Include a clear description of what the code should do
- Make it realistic and practical
- Difficulty appropriate for ${skillLevel} level
- Code should be properly formatted and ready to run

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "description": "What the code should accomplish",
  "code": "The buggy or incomplete code with proper formatting",
  "expectedOutput": "What the correct output should be (if applicable)",
  "hints": ["Hint 1", "Hint 2"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Raw AI response:', text);

    // Clean the response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Extract JSON from response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const challengeData = JSON.parse(jsonMatch[0]);

    // Ensure code field exists and is not empty
    if (!challengeData.code || challengeData.code.trim() === '') {
      throw new Error('Generated challenge has no code');
    }

    const challenge: Challenge = {
      id: Math.random().toString(36).substring(2, 9),
      ...challengeData,
      language,
      skillLevel,
      challengeType,
    };

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error generating challenge:', error);

    // Fallback challenge to ensure the app keeps working
    const fallbackChallenge: Challenge = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'Fix the Array Sum Function',
      description: 'This function should calculate the sum of all numbers in an array, but it has a bug. Find and fix the issue.',
      code: `function sumArray(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

// Test the function
console.log(sumArray([1, 2, 3, 4, 5])); // Should return 15`,
      language,
      skillLevel,
      challengeType,
      expectedOutput: '15',
      hints: [
        'Check the loop condition carefully',
        'What happens when you access an array index that doesn\'t exist?'
      ]
    };

    return NextResponse.json(fallbackChallenge);
  }
}