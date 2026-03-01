export const GOOGLE_CONFIG = {
  // These should be replaced with actual values from Google Cloud Console
  // For development, developers need to create their own OAuth 2.0 credentials
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  SCOPES: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/admin.directory.orgunit',
    'https://www.googleapis.com/auth/admin.directory.domain',
  ],
};

export const GOOGLE_API_BASE_URL = 'https://admin.googleapis.com/admin/directory/v1';
