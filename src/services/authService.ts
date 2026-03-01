import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_CONFIG } from '../config/google';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@google_admin_auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  idToken?: string;
}

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
    iosClientId: GOOGLE_CONFIG.IOS_CLIENT_ID,
    androidClientId: GOOGLE_CONFIG.ANDROID_CLIENT_ID,
    scopes: GOOGLE_CONFIG.SCOPES,
    redirectUri: makeRedirectUri({
      scheme: 'com.googleadmin.app',
    }),
  });

  return { request, response, promptAsync };
};

export const saveTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
};

export const getTokens = async (): Promise<AuthTokens | null> => {
  try {
    const tokens = await AsyncStorage.getItem(STORAGE_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
