import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { getTokens } from './src/services/authService';
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import { lightTheme } from './src/config/theme';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const tokens = await getTokens();
      if (tokens?.accessToken) {
        setAccessToken(tokens.accessToken);
        setIsAuthenticated(true);
        // Note: In production, you should validate the token and fetch user info
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (token: string, userInfoData: any) => {
    setAccessToken(token);
    setUserInfo(userInfoData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          {isAuthenticated && accessToken ? (
            <MainScreen
              accessToken={accessToken}
              userInfo={userInfo}
              onLogout={handleLogout}
            />
          ) : (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
