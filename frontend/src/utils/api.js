export const fetchApi = async (endpoint, options = {}, isRetry = false) => {
  let token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    let response = await fetch(endpoint, config);
    
    // Handle Token Expiry (401/403)
    const isAuthEndpoint = endpoint.includes('/api/auth/login') || endpoint.includes('/api/auth/register');
    if (!isRetry && !isAuthEndpoint && (response.status === 401 || response.status === 403)) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('token', data.token);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            
            // Retry the original request with the new token
            const newConfig = { ...config };
            newConfig.headers['Authorization'] = `Bearer ${data.token}`;
            response = await fetch(endpoint, newConfig);
          } else {
            // Refresh token is invalid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('authChanged'));
            throw new Error('Session expired. Please log in again.');
          }
        } catch (refreshErr) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('authChanged'));
          throw new Error('Session expired. Please log in again.');
        }
      }
    }

    // For delete or empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: response.ok };
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
