// Test script for interview API
const testData = {
  companyType: 'faang',
  role: 'frontend',
  experience: 'mid',
  language: 'javascript',
  stage: 'coding'
};

fetch('http://localhost:3000/api/generate-interview-challenge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });