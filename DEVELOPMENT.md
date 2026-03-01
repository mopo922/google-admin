# Development Guide

## Getting Started

This guide will help you set up your development environment and start working on the Google Workspace Admin app.

## Prerequisites

- Node.js 18+ and npm
- iOS development: Xcode (Mac only) or use Expo Go app
- Android development: Android Studio or use Expo Go app
- Google Workspace super admin account
- Google Cloud Platform project with Admin SDK API enabled

## Development Workflow

### 1. First-Time Setup

```bash
# Clone the repository
git clone https://github.com/mopo922/google-admin.git
cd google-admin

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Google OAuth credentials
```

### 2. Running the App

**Option A: Using Expo Go (Recommended for Quick Testing)**

1. Install Expo Go app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with your phone

**Option B: Using Simulators/Emulators**

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### 3. Project Structure

```
src/
├── config/           # App configuration (theme, Google OAuth settings)
├── screens/          # All screen components
├── services/         # API services (auth, admin API)
├── types/           # TypeScript type definitions
├── components/      # Reusable UI components (future)
├── navigation/      # Navigation configuration (future)
└── utils/           # Utility functions (future)
```

## Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Use React hooks (functional components)
- Follow Material Design guidelines for UI
- Keep components focused and single-purpose

## Testing

### Manual Testing

1. **Authentication Flow**:
   - Sign in with Google
   - Verify token storage
   - Sign out

2. **User Management**:
   - List users
   - Search users
   - View user details
   - Create user
   - Suspend/restore user
   - Delete user

3. **Group Management**:
   - List groups
   - Search groups
   - View group details
   - Create group
   - Add/remove members
   - Delete group

## Common Issues

### Build Errors

```bash
# Clear Metro bundler cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules
npm install

# Clear watchman (Mac only)
watchman watch-del-all
```

### OAuth Issues

- Verify your redirect URIs in Google Cloud Console
- Check that your client IDs match between .env and Google Cloud Console
- Ensure you're using a Google Workspace account, not regular Gmail

### API Permission Errors

- Make sure you're signed in as a super administrator
- Verify all required scopes are included in the OAuth request
- Check that Admin SDK API is enabled in Google Cloud Console

## Adding New Features

1. Create new screen components in `src/screens/`
2. Add necessary API calls to `src/services/adminService.ts`
3. Update types in `src/types/index.ts`
4. Update navigation in `src/screens/MainScreen.tsx`
5. Test thoroughly on both iOS and Android

## Debugging

### React Native Debugger

1. Install React Native Debugger
2. Enable debugging in Expo DevTools
3. Set breakpoints and inspect state

### Console Logging

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
```

### Network Debugging

Use React Native Debugger or browser DevTools to inspect API requests.

## Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Local Builds

See [Expo documentation](https://docs.expo.dev/build/setup/) for local build setup.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Google Workspace Admin SDK](https://developers.google.com/admin-sdk)
- [Material Design Guidelines](https://m3.material.io/)
