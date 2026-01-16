import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../config/Axios';
import api from '../config/Api';

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const login = () => {
    setIsLoading(true);

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open popup to backend login endpoint
    // Backend handles OAuth flow and token exchange securely
    const popup = window.open(
      `${api.url}/login`,
      'OAuth Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event) => {
      // Only handle oauth_success messages
      if (!event.data || event.data.type !== 'oauth_success') {
        return;
      }

      console.log('OAuth success received from backend');

      const { access_token, refresh_token, expires_in } = event.data;

      // Store tokens
      localStorage.setItem('accessToken', access_token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      // Store expiration time if provided
      if (expires_in) {
        const expiresAt = Date.now() + (expires_in);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      }

      // Set axios default header
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${access_token}`
      };

      console.log('Token stored, redirecting to game...');

      setIsLoading(false);
      if (popup) popup.close();

      // Clean up
      window.removeEventListener('message', handleMessage);

      // Redirect to flags page
      history.push('/flagsapi');
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  };

  return { login, isLoading };
};