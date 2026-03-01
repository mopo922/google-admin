import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { useGoogleAuth, saveTokens, getUserInfo } from '../services/authService';
import { googleColors } from '../config/theme';

interface LoginScreenProps {
  onLoginSuccess: (accessToken: string, userInfo: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { request, response, promptAsync } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleLoginSuccess(authentication.accessToken);
      }
    }
  }, [response]);

  const handleLoginSuccess = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const userInfo = await getUserInfo(accessToken);
      await saveTokens({ accessToken });
      onLoginSuccess(accessToken, userInfo);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={googleColors.primary} />
        <Text style={styles.loadingText}>Signing in...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineMedium" style={styles.title}>
          Google Workspace Admin
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Manage users, groups, and more
        </Text>

        <Button
          mode="contained"
          onPress={handleSignIn}
          disabled={!request || isLoading}
          style={styles.signInButton}
          contentStyle={styles.signInButtonContent}
          labelStyle={styles.signInButtonLabel}
        >
          Sign in with Google
        </Button>

        <Text variant="bodySmall" style={styles.disclaimer}>
          This app requires Google Workspace admin privileges
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: googleColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    color: googleColors.gray900,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: googleColors.gray600,
    marginBottom: 48,
    textAlign: 'center',
  },
  signInButton: {
    width: '100%',
    marginBottom: 16,
  },
  signInButtonContent: {
    height: 48,
  },
  signInButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  disclaimer: {
    color: googleColors.gray500,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginTop: 16,
    color: googleColors.gray700,
  },
});
