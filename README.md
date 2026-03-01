# Google Workspace Admin App

A React Native mobile application for managing Google Workspace admin tasks, built with Expo. This app allows Google Workspace administrators to manage users and groups on both iOS and Android devices with a UI that matches Google's Material Design.

## Features

- **Authentication**: Sign in with Google OAuth 2.0
- **User Management**:
  - List all users in your organization
  - View detailed user information
  - Create new users
  - Suspend/restore users
  - Delete users
  - Search and filter users
- **Group Management**:
  - List all groups
  - View group details and members
  - Create new groups
  - Add/remove group members
  - Delete groups
  - Search and filter groups
- **Material Design UI**: Matches Google Workspace web interface and Google mobile apps
- **Cross-Platform**: Works on both iOS and Android

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Google Cloud Platform account
- Google Workspace admin account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mopo922/google-admin.git
cd google-admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google Cloud Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Admin SDK API
   - Google+ API (for user info)
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Create credentials for:
     - Web application
     - iOS (optional)
     - Android (optional)
5. Add authorized redirect URIs:
   - For development: `https://auth.expo.io/@your-expo-username/google-admin`
   - Custom scheme: `com.googleadmin.app:/`

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Google OAuth credentials:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
   ```

### 5. Run the Application

#### Development Mode

```bash
# Start the Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

#### Production Build

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Project Structure

```
google-admin/
├── src/
│   ├── components/       # Reusable UI components
│   ├── config/          # Configuration files (theme, Google config)
│   ├── navigation/      # Navigation setup
│   ├── screens/         # Application screens
│   │   ├── LoginScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── UsersScreen.tsx
│   │   ├── GroupsScreen.tsx
│   │   ├── UserDetailsScreen.tsx
│   │   ├── GroupDetailsScreen.tsx
│   │   ├── CreateUserScreen.tsx
│   │   └── CreateGroupScreen.tsx
│   ├── services/        # API services
│   │   ├── authService.ts
│   │   └── adminService.ts
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── assets/             # Images, fonts, etc.
├── App.tsx            # Main application component
└── app.json           # Expo configuration
```

## API Permissions

This app requires the following Google Workspace API scopes:

- `https://www.googleapis.com/auth/admin.directory.user` - User management
- `https://www.googleapis.com/auth/admin.directory.group` - Group management
- `https://www.googleapis.com/auth/admin.directory.orgunit` - Organizational units
- `https://www.googleapis.com/auth/admin.directory.domain` - Domain management

**Note**: You must be a Google Workspace super administrator to use this app.

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components
- **Expo Auth Session**: OAuth 2.0 authentication
- **Axios**: HTTP client for API requests
- **AsyncStorage**: Local data persistence

## Security Considerations

- OAuth tokens are stored securely using AsyncStorage
- All API requests use HTTPS
- Tokens are never logged or exposed
- Use `.env` files (not committed to git) for sensitive configuration

## Troubleshooting

### Authentication Issues

- Verify your OAuth credentials are correct in `.env`
- Ensure redirect URIs are properly configured in Google Cloud Console
- Check that your Google Workspace account has admin privileges

### API Errors

- Verify the Admin SDK API is enabled in Google Cloud Console
- Check that your OAuth token has the required scopes
- Ensure you're using a Google Workspace account (not a regular Gmail account)

### Build Issues

- Clear Metro bundler cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Material Design guidelines
- Google Workspace Admin SDK documentation
- Expo and React Native communities
