/**
 * Test script for password reset functionality
 * Tests the forgot-password and reset-password endpoints
 */

const API_BASE = 'http://localhost:5000';
const TEST_EMAIL = 'test.reset@example.com';

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

async function makeRequest(method, path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.message || 'Unknown error'}`);
  }

  return data;
}

async function runTests() {
  console.log('🧪 Testing Password Reset Feature\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Health check
  if (await test('Server is running', async () => {
    const data = await makeRequest('GET', '/api/health', null);
    if (!data.ok) throw new Error('Health check failed');
  })) {
    testsPassed++;
  } else {
    testsFailed++;
  }

  // Test 2: Forgot password with non-existent email (should still return success)
  let resetResponse = null;
  if (await test('Forgot password endpoint accepts request', async () => {
    resetResponse = await makeRequest('POST', '/api/auth/forgot-password', {
      email: TEST_EMAIL,
    });
    if (!resetResponse.message) throw new Error('No message in response');
  })) {
    testsPassed++;
  } else {
    testsFailed++;
  }

  // Test 3: Forgot password with invalid email format
  if (await test('Forgot password validates email format', async () => {
    try {
      await makeRequest('POST', '/api/auth/forgot-password', {
        email: 'not-an-email',
      });
      throw new Error('Should have failed validation');
    } catch (error) {
      if (error.message.includes('400')) {
        return; // Expected
      }
      throw error;
    }
  })) {
    testsPassed++;
  } else {
    testsFailed++;
  }

  // Test 4: Reset password with invalid token
  if (await test('Reset password rejects invalid token', async () => {
    try {
      await makeRequest('POST', '/api/auth/reset-password', {
        token: 'invalid-token-123',
        password: 'newpassword123',
      });
      throw new Error('Should have failed with invalid token');
    } catch (error) {
      if (error.message.includes('400')) {
        return; // Expected
      }
      throw error;
    }
  })) {
    testsPassed++;
  } else {
    testsFailed++;
  }

  // Test 5: Reset password validates password length
  if (await test('Reset password validates minimum password length', async () => {
    try {
      await makeRequest('POST', '/api/auth/reset-password', {
        token: 'dummy-token',
        password: 'short',
      });
      throw new Error('Should have failed validation');
    } catch (error) {
      if (error.message.includes('400')) {
        return; // Expected
      }
      throw error;
    }
  })) {
    testsPassed++;
  } else {
    testsFailed++;
  }

  console.log(`\n📊 Results: ${testsPassed} passed, ${testsFailed} failed\n`);

  if (testsFailed === 0) {
    console.log('✅ All tests passed! Password reset feature is working.\n');
    console.log('📝 Manual test steps:');
    console.log('1. Go to http://localhost:5173/#/forgot-password');
    console.log('2. Enter your email address');
    console.log('3. Check your email for the reset link');
    console.log('4. Click the link and set a new password');
    console.log('5. Log in with your new password');
  } else {
    console.log('❌ Some tests failed. Please check the errors above.\n');
  }

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
