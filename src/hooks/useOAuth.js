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

    const popup = window.open(
      api.url + '/login?popup=1',
      'OAuth Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event) => {
      // Debug logging
      console.log('OAuth message received:', event.origin, event.data);

      // Verify origin
      if (event.origin !== api.url) {
        console.warn('OAuth message from incorrect origin:', event.origin, 'expected:', api.url);
        return;
      }

      if (event.data.type === 'oauth_success') {
        console.log('OAuth success! Storing tokens...');

        // Store tokens
        localStorage.setItem('accessToken', event.data.access_token);
        localStorage.setItem('refreshToken', event.data.refresh_token);

        // Set axios default header
        axios.defaults.headers.common = {
          'Authorization': `Bearer ${event.data.access_token}`
        };

        console.log('Token stored, redirecting to game...');

        setIsLoading(false);
        if (popup) popup.close();

        // Clean up
        window.removeEventListener('message', handleMessage);

        // Redirect to flags page
        history.push('/flagsapi');
      } else {
        console.warn('Unexpected OAuth message type:', event.data.type);
      }
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