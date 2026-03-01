# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth 2.0 credentials for the Google Workspace Admin app.

## Prerequisites

- Google Workspace super administrator account
- Access to Google Cloud Platform

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `google-workspace-admin-app`
4. Click "Create"

### 2. Enable Required APIs

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Enable the following APIs:
   - **Admin SDK API** (required for user/group management)
   - **Google People API** (required for user profile info)

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select **Internal** user type (for Google Workspace only)
   - Or **External** if you want to allow any Google account
3. Fill in the application information:
   - **App name**: Google Workspace Admin
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click "Save and Continue"
5. Add scopes:
   - `openid`
   - `profile`
   - `email`
   - `.../auth/admin.directory.user`
   - `.../auth/admin.directory.group`
   - `.../auth/admin.directory.orgunit`
   - `.../auth/admin.directory.domain`
6. Click "Save and Continue"
7. Review and click "Back to Dashboard"

### 4. Create OAuth 2.0 Credentials

#### Web Application Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: `Google Workspace Admin - Web`
5. Authorized redirect URIs:
   ```
   https://auth.expo.io/@YOUR_EXPO_USERNAME/google-admin
   http://localhost:19006
   ```
6. Click "Create"
7. **Save the Client ID** - you'll need this for `.env`

#### iOS Credentials (Optional but Recommended)

1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **iOS**
3. Name: `Google Workspace Admin - iOS`
4. Bundle ID: `com.googleadmin.app`
5. Click "Create"
6. **Save the Client ID**

#### Android Credentials (Optional but Recommended)

1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **Android**
3. Name: `Google Workspace Admin - Android`
4. Package name: `com.googleadmin.app`
5. SHA-1 certificate fingerprint:
   - For development, get it by running:
     ```bash
     # On Mac/Linux
     keytool -keystore ~/.android/debug.keystore -list -v
     
     # Default password is usually "android"
     ```
   - Copy the SHA-1 fingerprint
6. Click "Create"
7. **Save the Client ID**

### 5. Configure Environment Variables

1. In your project directory, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
   ```

### 6. Update Redirect URIs for Production

When deploying to production, you'll need to add additional redirect URIs:

1. Go back to your Web OAuth credentials
2. Edit "Authorized redirect URIs"
3. Add your custom scheme:
   ```
   com.googleadmin.app:/
   ```

### 7. Domain Verification (if using External OAuth)

If you selected "External" for OAuth consent screen:

1. Go to "OAuth consent screen"
2. Add authorized domains
3. Follow Google's domain verification process

## Testing Your Setup

1. Start the app:
   ```bash
   npm start
   ```

2. Click "Sign in with Google"

3. You should see the Google OAuth consent screen

4. After signing in, you should be redirected back to the app

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

- Make sure your redirect URI in Google Cloud Console exactly matches what the app is using
- For Expo projects, the URI format is: `https://auth.expo.io/@YOUR_USERNAME/google-admin`
- Check that there are no trailing slashes

### "Access blocked: This app's request is invalid"

- Verify that all required scopes are added in the OAuth consent screen
- Make sure the Admin SDK API is enabled

### "Error 403: access_denied"

- Ensure you're signing in with a Google Workspace account
- Verify you have super admin privileges
- Check that the app is published (or you're a test user if in testing mode)

### "Error: The app is not configured correctly"

- Verify your client IDs in `.env` are correct
- Make sure there are no extra spaces in the `.env` file
- Restart the Expo development server after changing `.env`

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use different credentials** for development and production
3. **Regularly rotate** your OAuth credentials
4. **Enable 2FA** on your Google Cloud Platform account
5. **Restrict API keys** to specific apps and APIs
6. **Monitor API usage** in Google Cloud Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Admin SDK Authorization Guide](https://developers.google.com/admin-sdk/directory/v1/guides/authorizing)
- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console error logs
3. Check Expo DevTools console for errors
4. Verify all setup steps were completed correctly
