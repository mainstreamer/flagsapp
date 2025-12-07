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
      // Verify origin
      if (event.origin !== api.url) {
        return;
      }

      if (event.data.type === 'oauth_success') {
        // Store tokens
        localStorage.setItem('accessToken', event.data.access_token);
        localStorage.setItem('refreshToken', event.data.refresh_token);
        
        // Set axios default header
        axios.defaults.headers.common = {
          'Authorization': `Bearer ${event.data.access_token}`
        };

        setIsLoading(false);
        if (popup) popup.close();
        
        // Clean up
        window.removeEventListener('message', handleMessage);
        
        // Redirect to flags page
        history.push('/flagsapi');
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