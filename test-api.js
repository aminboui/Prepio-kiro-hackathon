// Simple test script to check if our APIs are working
const testGenerateChallenge = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/generate-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'JavaScript',
        skillLevel: 'beginner',
        challengeType: 'bug-fix'
      }),
    });
    
    const data = await response.json();
    console.log('Generate Challenge Response:', response.status, data);
  } catch (error) {
    console.error('Generate Challenge Error:', error);
  }
};

const testEvaluateSolution = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/evaluate-solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        challenge: {
          id: 'test-123',
          title: 'Test Challenge',
          description: 'Test description',
          code: 'console.log("test");',
          language: 'JavaScript',
          skillLevel: 'beginner',
          challengeType: 'bug-fix'
        },
        userCode: 'console.log("fixed");'
      }),
    });
    
    const data = await response.json();
    console.log('Evaluate Solution Response:', response.status, data);
  } catch (error) {
    console.error('Evaluate Solution Error:', error);
  }
};

// Run tests
console.log('Testing APIs...');
testGenerateChallenge();
setTimeout(() => testEvaluateSolution(), 2000);