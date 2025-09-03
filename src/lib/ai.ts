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

export interface FeedbackResponse {
    score: number;
    correctness: number;
    efficiency: number;
    codeQuality: number;
    feedback: string;
    suggestions: string[];
    isCorrect: boolean;
}

export async function generateChallenge(request: ChallengeRequest): Promise<Challenge> {
    try {
        const response = await fetch('/api/generate-challenge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate challenge');
        }

        const challenge = await response.json();
        return challenge;
    } catch (error) {
        console.error('Error generating challenge:', error);
        throw new Error('Failed to generate challenge');
    }
}

export async function evaluateSolution(
    challenge: Challenge,
    userCode: string
): Promise<FeedbackResponse> {
    try {
        // Check if user submitted the exact same code as the original
        const originalCodeNormalized = challenge.code.trim().replace(/\s+/g, ' ');
        const userCodeNormalized = userCode.trim().replace(/\s+/g, ' ');
        const codeIsSame = originalCodeNormalized === userCodeNormalized;

        // If code is identical, return immediate feedback without API call
        if (codeIsSame) {
            return {
                score: 15,
                correctness: 10,
                efficiency: 15,
                codeQuality: 20,
                feedback: `You submitted the original code without any changes. ${challenge.challengeType === 'bug-fix'
                    ? 'You need to identify and fix the bugs in the code.'
                    : 'You need to complete the missing parts of the code.'
                    } Please review the challenge description and make the necessary modifications.`,
                suggestions: [
                    challenge.challengeType === 'bug-fix'
                        ? 'Carefully read through the code to identify the bugs'
                        : 'Look for TODO comments or incomplete sections',
                    'Test your solution with the provided examples',
                    'Consider edge cases and error handling',
                    'Make sure your solution actually addresses the challenge requirements'
                ],
                isCorrect: false
            };
        }

        const response = await fetch('/api/evaluate-solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challenge,
                userCode,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to evaluate solution');
        }

        const feedback = await response.json();

        // Additional client-side validation to ensure scores are reasonable
        if (feedback.efficiency > 85 && !userCode.includes('//') && userCode.length < 100) {
            // If efficiency is very high but code is very simple, adjust it
            feedback.efficiency = Math.max(feedback.efficiency - 20, 40);
            feedback.score = Math.round((feedback.correctness + feedback.efficiency + feedback.codeQuality) / 3);
        }

        return feedback;
    } catch (error) {
        console.error('Error evaluating solution:', error);
        throw new Error('Failed to evaluate solution');
    }
}