import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UsersScreen from './UsersScreen';
import GroupsScreen from './GroupsScreen';
import UserDetailsScreen from './UserDetailsScreen';
import GroupDetailsScreen from './GroupDetailsScreen';
import CreateUserScreen from './CreateUserScreen';
import CreateGroupScreen from './CreateGroupScreen';
import { User, Group } from '../types';
import { googleColors } from '../config/theme';
import { clearTokens } from '../services/authService';

const Tab = createBottomTabNavigator();

interface MainScreenProps {
  accessToken: string;
  userInfo: any;
  onLogout: () => void;
}

type Screen = 
  | { type: 'users' }
  | { type: 'groups' }
  | { type: 'userDetails'; userId: string }
  | { type: 'groupDetails'; groupId: string }
  | { type: 'createUser' }
  | { type: 'createGroup' };

export default function MainScreen({ accessToken, userInfo, onLogout }: MainScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'users' });
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    setMenuVisible(false);
    await clearTokens();
    onLogout();
  };

  const renderHeader = () => {
    let title = 'Google Workspace Admin';
    
    switch (currentScreen.type) {
      case 'users':
        title = 'Users';
        break;
      case 'groups':
        title = 'Groups';
        break;
      case 'userDetails':
        title = 'User Details';
        break;
      case 'groupDetails':
        title = 'Group Details';
        break;
      case 'createUser':
        title = 'Create User';
        break;
      case 'createGroup':
        title = 'Create Group';
        break;
    }

    return (
      <Appbar.Header style={{ backgroundColor: googleColors.primary }}>
        <Appbar.Content title={title} titleStyle={{ color: '#ffffff' }} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color="#ffffff"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            leadingIcon="account"
            onPress={() => {}}
            title={userInfo?.email || 'User'}
            disabled
          />
          <Menu.Item
            leadingIcon="logout"
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>
      </Appbar.Header>
    );
  };

  // Handle navigation based on current screen
  if (currentScreen.type === 'userDetails') {
    return (
      <>
        {renderHeader()}
        <UserDetailsScreen
          userId={currentScreen.userId}
          accessToken={accessToken}
          onBack={() => setCurrentScreen({ type: 'users' })}
          onUserDeleted={() => setCurrentScreen({ type: 'users' })}
        />
      </>
    );
  }

  if (currentScreen.type === 'groupDetails') {
    return (
      <>
        {renderHeader()}
        <GroupDetailsScreen
          groupId={currentScreen.groupId}
          accessToken={accessToken}
          onBack={() => setCurrentScreen({ type: 'groups' })}
          onGroupDeleted={() => setCurrentScreen({ type: 'groups' })}
        />
      </>
    );
  }

  if (currentScreen.type === 'createUser') {
    return (
      <>
        {renderHeader()}
        <CreateUserScreen
          accessToken={accessToken}
          onBack={() => setCurrentScreen({ type: 'users' })}
          onUserCreated={() => setCurrentScreen({ type: 'users' })}
        />
      </>
    );
  }

  if (currentScreen.type === 'createGroup') {
    return (
      <>
        {renderHeader()}
        <CreateGroupScreen
          accessToken={accessToken}
          onBack={() => setCurrentScreen({ type: 'groups' })}
          onGroupCreated={() => setCurrentScreen({ type: 'groups' })}
        />
      </>
    );
  }

  return (
    <>
      {renderHeader()}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: googleColors.primary,
          tabBarInactiveTintColor: googleColors.gray500,
          tabBarStyle: {
            borderTopColor: googleColors.gray200,
          },
        }}
      >
        <Tab.Screen
          name="Users"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-multiple" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <UsersScreen
              accessToken={accessToken}
              onUserPress={(user: User) =>
                setCurrentScreen({ type: 'userDetails', userId: user.id })
              }
              onCreateUser={() => setCurrentScreen({ type: 'createUser' })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Groups"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <GroupsScreen
              accessToken={accessToken}
              onGroupPress={(group: Group) =>
                setCurrentScreen({ type: 'groupDetails', groupId: group.id })
              }
              onCreateGroup={() => setCurrentScreen({ type: 'createGroup' })}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}
