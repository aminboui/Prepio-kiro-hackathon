import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    console.log('Interview challenge API called');

    const body = await request.json();
    console.log('Request body:', body);

    const { companyType, role, experience, language, stage } = body;

    if (!companyType || !role || !experience || !language || !stage) {
      console.log('Missing parameters:', { companyType, role, experience, language, stage });
      return NextResponse.json(
        { error: 'Missing required parameters', received: { companyType, role, experience, language, stage } },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Google AI API key not found');
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Creating model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';

    if (stage === 'coding') {
      prompt = `You are an expert technical interviewer. Create a unique coding interview problem for a ${experience} level ${role} position at a ${companyType} company using ${language}.

IMPORTANT: Return ONLY a valid JSON object with no additional text, markdown, or explanations.

Generate a problem that is:
- Appropriate for ${experience} level (${experience === 'entry' ? 'easier, fundamental concepts' : experience === 'senior' ? 'complex, system design aspects' : 'moderate difficulty'})
- Suitable for ${companyType} company style (${companyType === 'faang' ? 'algorithmic, optimization focused' : companyType === 'startup' ? 'practical, product-focused' : 'business logic, real-world scenarios'})
- Different from common problems like Two Sum, Reverse String, etc.

JSON format:
{
  "title": "Unique Problem Title",
  "description": "Clear problem description with constraints and requirements",
  "examples": ["Input: example1\\nOutput: result1", "Input: example2\\nOutput: result2"],
  "starterCode": "${getStarterCode(language).replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
  "testCases": [
    {"input": "specific test input", "expected": "expected output"},
    {"input": "edge case input", "expected": "edge case output"},
    {"input": "complex case input", "expected": "complex output"}
  ],
  "hints": ["First helpful hint", "Second hint about approach", "Third hint about optimization"],
  "difficulty": "${experience === 'entry' ? 'Easy' : experience === 'senior' ? 'Hard' : 'Medium'}",
  "timeLimit": "45 minutes",
  "topics": ["Relevant Topic 1", "Relevant Topic 2"]
}`;
    } else if (stage === 'technical') {
      prompt = `You are conducting a technical interview for a ${experience} level ${role} at a ${companyType} company. Create 5 diverse technical questions.

IMPORTANT: Return ONLY a valid JSON object with no additional text.

Focus on:
- ${language} specific concepts and best practices
- ${role} relevant technologies and patterns
- ${experience} appropriate depth (${experience === 'entry' ? 'fundamentals and basic concepts' : experience === 'senior' ? 'architecture, leadership, complex systems' : 'intermediate concepts and practical experience'})
- ${companyType} company expectations

JSON format:
{
  "questions": [
    {
      "question": "Specific technical question about ${language} or ${role} concepts",
      "type": "language-specific",
      "expectedAnswer": "Key points the candidate should mention",
      "followUp": "Follow-up question to go deeper"
    },
    {
      "question": "Question about system design or architecture",
      "type": "system-design", 
      "expectedAnswer": "Expected architectural considerations",
      "followUp": "How would you scale this?"
    },
    {
      "question": "Practical coding or debugging scenario",
      "type": "practical",
      "expectedAnswer": "Problem-solving approach expected",
      "followUp": "What tools would you use?"
    },
    {
      "question": "Question about best practices or code quality",
      "type": "best-practices",
      "expectedAnswer": "Industry standards and practices",
      "followUp": "How do you ensure code quality?"
    },
    {
      "question": "Experience-based question about challenges",
      "type": "experience",
      "expectedAnswer": "Real-world problem solving",
      "followUp": "What did you learn from that?"
    }
  ]
}`;
    } else if (stage === 'behavioral') {
      prompt = `You are conducting a behavioral interview for a ${experience} level ${role} at a ${companyType} company. Create 4 behavioral questions using the STAR method.

IMPORTANT: Return ONLY a valid JSON object with no additional text.

Tailor questions for:
- ${experience} level expectations (${experience === 'entry' ? 'learning, growth, basic teamwork' : experience === 'senior' ? 'leadership, mentoring, strategic thinking' : 'collaboration, problem-solving, initiative'})
- ${role} specific scenarios
- ${companyType} company culture (${companyType === 'faang' ? 'innovation, scale, leadership principles' : companyType === 'startup' ? 'adaptability, ownership, fast-paced environment' : 'collaboration, process, reliability'})

JSON format:
{
  "questions": [
    {
      "question": "Tell me about a time when you had to [specific scenario relevant to ${role} and ${experience} level]",
      "category": "teamwork",
      "lookingFor": ["Specific skill 1", "Specific skill 2", "Specific skill 3"],
      "followUp": "What would you do differently next time?"
    },
    {
      "question": "Describe a situation where you [problem-solving scenario for ${role}]",
      "category": "problem-solving", 
      "lookingFor": ["Analytical thinking", "Creativity", "Persistence"],
      "followUp": "How did you measure success?"
    },
    {
      "question": "${experience === 'entry' ? 'Tell me about a time you took initiative to learn something new' : experience === 'senior' ? 'Describe how you mentored or led a team through a challenge' : 'Tell me about a time you had to influence others without authority'}",
      "category": "leadership",
      "lookingFor": ["${experience === 'entry' ? 'Learning agility' : experience === 'senior' ? 'Leadership' : 'Influence'}", "Initiative", "Growth mindset"],
      "followUp": "What was the long-term impact?"
    },
    {
      "question": "Why are you interested in working at a ${companyType} company, and how do you see yourself contributing to a ${role} role?",
      "category": "culture-fit",
      "lookingFor": ["Company research", "Role understanding", "Cultural alignment"],
      "followUp": "What excites you most about this opportunity?"
    }
  ]
}`;
    }

    console.log('Generating content with prompt length:', prompt.length);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log('AI response received, length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));

    // Clean and parse JSON response
    let parsedResponse;
    try {
      // Clean the response text - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      parsedResponse = JSON.parse(cleanText);
      console.log('Successfully parsed JSON response');
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback. Error:', parseError);
      console.log('Raw text:', text.substring(0, 500));
      console.log('Cleaned text attempt:', text.trim().substring(0, 200));
      // If JSON parsing fails, return a structured fallback with variety
      if (stage === 'coding') {
        const fallbackProblems = [
          {
            title: "Valid Parentheses",
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets in the correct order.",
            examples: ["Input: s = \"()\"\nOutput: true", "Input: s = \"()[]{}\"\nOutput: true", "Input: s = \"(]\"\nOutput: false"],
            topics: ["Stack", "String"]
          },
          {
            title: "Merge Two Sorted Lists",
            description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.",
            examples: ["Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]"],
            topics: ["Linked List", "Recursion"]
          },
          {
            title: "Maximum Subarray",
            description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
            examples: ["Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6"],
            topics: ["Array", "Dynamic Programming"]
          }
        ];

        const randomProblem = fallbackProblems[Math.floor(Math.random() * fallbackProblems.length)];
        parsedResponse = {
          ...randomProblem,
          starterCode: getStarterCode(language),
          testCases: [
            { input: "Test case 1", expected: "Expected output 1" },
            { input: "Test case 2", expected: "Expected output 2" },
            { input: "Edge case", expected: "Edge case output" }
          ],
          hints: ["Consider the data structure needed", "Think about edge cases", "What's the optimal time complexity?"],
          difficulty: experience === 'entry' ? 'Easy' : experience === 'senior' ? 'Hard' : 'Medium',
          timeLimit: "45 minutes"
        };
      } else if (stage === 'technical') {
        const technicalQuestions = [
          [
            {
              question: "What's the time complexity of your solution and how could you optimize it?",
              type: "coding-followup",
              expectedAnswer: "Analyze time/space complexity and optimization strategies",
              followUp: "What trade-offs would you consider?"
            },
            {
              question: `Explain the memory management in ${language}. How does it handle garbage collection?`,
              type: "language-specific",
              expectedAnswer: "Language-specific memory management concepts",
              followUp: "How would this affect performance in production?"
            },
            {
              question: "Design a system to handle 1 million concurrent users. What are your key considerations?",
              type: "system-design",
              expectedAnswer: "Load balancing, caching, database scaling, microservices",
              followUp: "How would you monitor and debug this system?"
            }
          ],
          [
            {
              question: `What are the main differences between ${language} and other languages you've used?`,
              type: "language-specific",
              expectedAnswer: "Comparative analysis of language features",
              followUp: "When would you choose one over the other?"
            },
            {
              question: "How would you debug a performance issue in a web application?",
              type: "practical",
              expectedAnswer: "Profiling, monitoring, bottleneck identification",
              followUp: "What tools would you use?"
            },
            {
              question: "Explain the concept of database indexing and when you'd use different types.",
              type: "system-design",
              expectedAnswer: "B-tree, hash, composite indexes and use cases",
              followUp: "What are the trade-offs of over-indexing?"
            }
          ]
        ];

        const randomQuestions = technicalQuestions[Math.floor(Math.random() * technicalQuestions.length)];
        parsedResponse = { questions: randomQuestions };
      } else if (stage === 'behavioral') {
        parsedResponse = {
          questions: [
            {
              question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
              category: "teamwork",
              lookingFor: ["Communication skills", "Conflict resolution", "Empathy"],
              followUp: "What would you do differently next time?"
            },
            {
              question: "Describe a challenging technical problem you solved. Walk me through your approach.",
              category: "problem-solving",
              lookingFor: ["Analytical thinking", "Persistence", "Learning ability"],
              followUp: "How did you validate your solution?"
            },
            {
              question: experience === 'entry' ? "Tell me about a time when you took initiative to learn something new." : "Describe a situation where you had to lead a project or mentor someone.",
              category: "leadership",
              lookingFor: experience === 'entry' ? ["Learning agility", "Proactivity", "Growth mindset"] : ["Leadership", "Mentoring", "Strategic thinking"],
              followUp: "What was the outcome?"
            },
            {
              question: `Why do you want to work at a ${companyType} company? What attracts you to this type of environment?`,
              category: "culture-fit",
              lookingFor: ["Company research", "Cultural alignment", "Motivation"],
              followUp: "How do you see yourself contributing to our team?"
            }
          ]
        };
      } else {
        parsedResponse = { error: "Failed to generate content", rawText: text.substring(0, 200) };
      }
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error generating interview challenge:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        error: 'Failed to generate interview challenge',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getStarterCode(language: string): string {
  const templates: Record<string, string> = {
    javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
    
}`,
    python: `def two_sum(nums, target):
    # Your code here
    pass`,
    java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`,
    csharp: `public int[] TwoSum(int[] nums, int target) {
    // Your code here
    
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}`,
    go: `func twoSum(nums []int, target int) []int {
    // Your code here
    
}`,
    rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Your code here
        
    }
}`,
    php: `function twoSum($nums, $target) {
    // Your code here
    
}`,
    ruby: `def two_sum(nums, target)
    # Your code here
    
end`
  };

  return templates[language] || templates.javascript;
}