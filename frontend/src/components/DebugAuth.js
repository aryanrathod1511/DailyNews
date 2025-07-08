import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { getAuthToken } from '../utils/auth';

const DebugAuth = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const result = await apiService.testAuth();
      setTestResult({ success: true, data: result });
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkToken = () => {
    const storedToken = getAuthToken();
    setTestResult({
      success: true,
      data: {
        contextToken: token,
        storedToken: storedToken,
        tokensMatch: token === storedToken
      }
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Authentication Debug</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Current State:</h4>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.name : 'None'}</p>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={checkToken} style={{ marginRight: '10px' }}>
          Check Token
        </button>
        <button onClick={testAuth} disabled={loading}>
          {loading ? 'Testing...' : 'Test Auth API'}
        </button>
      </div>

      {testResult && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <h4>Test Result:</h4>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugAuth; 