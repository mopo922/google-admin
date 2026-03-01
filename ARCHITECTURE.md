# Architecture Overview

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Mobile App (React Native + Expo)        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 App.tsx (Entry Point)                   │ │
│  │  - Navigation Container                                 │ │
│  │  - Theme Provider                                       │ │
│  │  - Authentication State Management                      │ │
│  └───────────────────┬──────────────────────────────────┬──┘ │
│                      │                                   │    │
│         ┌────────────▼──────────┐       ┌───────────────▼───┐│
│         │   LoginScreen         │       │   MainScreen      ││
│         │  - OAuth Flow         │       │  - Bottom Tabs    ││
│         │  - Sign in with Google│       │  - Header/Menu    ││
│         └───────────────────────┘       └─────────┬─────────┘│
│                                                    │          │
│         ┌──────────────────────────────────────┬──┴──┬───────┤
│         │                                      │     │       │
│  ┌──────▼──────┐                      ┌───────▼──┐  │       │
│  │ UsersScreen │                      │GroupsScr │  │       │
│  │ - List Users│                      │- List Gr │  │       │
│  │ - Search    │                      │- Search  │  │       │
│  └──────┬──────┘                      └─────┬────┘  │       │
│         │                                   │       │       │
│  ┌──────▼────────┐               ┌─────────▼───┐   │       │
│  │UserDetailsScr │               │GroupDetails │   │       │
│  │- View Details │               │- View Detal │   │       │
│  │- Suspend/Delte│               │- Members    │   │       │
│  └───────────────┘               └─────────────┘   │       │
│         │                                   │       │       │
│  ┌──────▼────────┐               ┌─────────▼───┐   │       │
│  │CreateUserScr  │               │CreateGroupS │   │       │
│  │- Form Input   │               │- Form Input │   │       │
│  └───────────────┘               └─────────────┘   │       │
│                                                     │       │
└─────────────────────────────────────────────────────┼───────┘
                                                      │
                  ┌───────────────────────────────────┴────────┐
                  │         Services Layer                      │
                  ├─────────────────┬───────────────────────────┤
                  │                 │                           │
         ┌────────▼──────────┐ ┌───▼────────────────────┐      │
         │  authService.ts   │ │  adminService.ts       │      │
         │  - OAuth Flow     │ │  - User Management API │      │
         │  - Token Storage  │ │  - Group Management API│      │
         │  - User Info      │ │  - Member Management   │      │
         └────────┬──────────┘ └───┬────────────────────┘      │
                  │                │                            │
                  └────────┬───────┘                            │
                           │                                    │
                  ┌────────▼─────────────────────────────────┐ │
                  │       Google APIs                         │ │
                  ├───────────────────────────────────────────┤ │
                  │  - OAuth 2.0 Authorization Server         │ │
                  │  - Admin SDK API                          │ │
                  │  - Directory API (Users, Groups)          │ │
                  └───────────────────────────────────────────┘ │
                                                                 │
```

## Key Features by Screen

### LoginScreen
- Google OAuth 2.0 authentication
- Sign in with Google button
- Loading states
- Error handling

### UsersScreen (Tab 1)
- List all users in organization
- Search/filter users
- Pull to refresh
- Navigate to user details
- Floating action button to create user
- Display user status (admin, suspended)

### GroupsScreen (Tab 2)
- List all groups
- Search/filter groups
- Pull to refresh
- Navigate to group details
- Floating action button to create group
- Display member count

### UserDetailsScreen
- View user information
- Suspend/restore user
- Delete user
- Display admin status
- Show creation and last login dates
- Organization unit information

### GroupDetailsScreen
- View group information
- List group members
- Add members to group
- Remove members from group
- Delete group
- Member role display

### CreateUserScreen
- Form to create new user
- Input validation
- Error handling
- Success feedback

### CreateGroupScreen
- Form to create new group
- Optional description
- Input validation
- Error handling

## Data Flow

1. **Authentication Flow**:
   ```
   User → LoginScreen → authService.useGoogleAuth() 
   → Google OAuth → Access Token → AsyncStorage
   → MainScreen
   ```

2. **User Management Flow**:
   ```
   UsersScreen → adminService.listUsers(token)
   → Google Admin SDK API → User List → UI Display
   ```

3. **Group Management Flow**:
   ```
   GroupsScreen → adminService.listGroups(token)
   → Google Admin SDK API → Group List → UI Display
   ```

## Technology Stack

### Frontend
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development and build platform
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design UI components

### Authentication & Storage
- **expo-auth-session**: OAuth 2.0 flow
- **expo-web-browser**: Browser for OAuth
- **AsyncStorage**: Local token storage

### API Communication
- **Axios**: HTTP client
- **Google Admin SDK**: Workspace administration

### Styling
- **Material Design 3**: Google's design system
- **Custom Theme**: Google colors and styling

## Security Architecture

1. **OAuth 2.0 Flow**:
   - Authorization Code Grant
   - PKCE (Proof Key for Code Exchange)
   - Secure token storage

2. **API Security**:
   - HTTPS only
   - Bearer token authentication
   - Token refresh handling

3. **Data Protection**:
   - No sensitive data in logs
   - Environment variables for credentials
   - Secure local storage

## State Management

- **React Hooks**: useState, useEffect
- **Local State**: Component-level state
- **AsyncStorage**: Persistent auth state
- **Future**: Consider Redux/Context API for complex state

## Platform Support

- ✅ iOS (11.0+)
- ✅ Android (5.0+)
- ✅ Web (limited support)

## API Scopes Required

```typescript
[
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.orgunit',
  'https://www.googleapis.com/auth/admin.directory.domain',
]
```
