import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
} from 'react-native-paper';
import { getUser, suspendUser, deleteUser } from '../services/adminService';
import { User } from '../types';
import { googleColors } from '../config/theme';

interface UserDetailsScreenProps {
  userId: string;
  accessToken: string;
  onBack: () => void;
  onUserDeleted: () => void;
}

export default function UserDetailsScreen({
  userId,
  accessToken,
  onBack,
  onUserDeleted,
}: UserDetailsScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getUser(accessToken, userId);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Failed to load user details.');
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendToggle = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const updatedUser = await suspendUser(accessToken, user.id, !user.suspended);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    // Simple confirmation
    const confirmDelete = confirm(
      `Are you sure you want to delete ${user.name.fullName}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setIsUpdating(true);
      await deleteUser(accessToken, user.id);
      alert('User deleted successfully.');
      onUserDeleted();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={googleColors.primary} />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          User Details
        </Text>
        <View style={{ width: 48 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user.name.givenName[0] + user.name.familyName[0]}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.userName}>
              {user.name.fullName}
            </Text>
            <Text variant="bodyLarge" style={styles.userEmail}>
              {user.primaryEmail}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Information
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>First Name:</Text>
              <Text style={styles.detailValue}>{user.name.givenName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Name:</Text>
              <Text style={styles.detailValue}>{user.name.familyName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admin:</Text>
              <Text style={styles.detailValue}>{user.isAdmin ? 'Yes' : 'No'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.detailValue,
                user.suspended && styles.suspendedText
              ]}>
                {user.suspended ? 'Suspended' : 'Active'}
              </Text>
            </View>
            
            {user.orgUnitPath && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Org Unit:</Text>
                <Text style={styles.detailValue}>{user.orgUnitPath}</Text>
              </View>
            )}
            
            {user.creationTime && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>
                  {new Date(user.creationTime).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {user.lastLoginTime && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Login:</Text>
                <Text style={styles.detailValue}>
                  {new Date(user.lastLoginTime).toLocaleDateString()}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleSuspendToggle}
              disabled={isUpdating}
              style={styles.actionButton}
              buttonColor={user.suspended ? googleColors.googleGreen : googleColors.googleYellow}
            >
              {user.suspended ? 'Restore User' : 'Suspend User'}
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleDeleteUser}
              disabled={isUpdating}
              style={styles.actionButton}
              textColor={googleColors.error}
            >
              Delete User
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: googleColors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: googleColors.gray200,
  },
  headerTitle: {
    fontWeight: '500',
    color: googleColors.gray900,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: googleColors.gray50,
  },
  loadingText: {
    marginTop: 16,
    color: googleColors.gray700,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: googleColors.primary,
    marginBottom: 16,
  },
  userName: {
    color: googleColors.gray900,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: googleColors.gray600,
  },
  detailsCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    color: googleColors.gray900,
    fontWeight: '500',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    color: googleColors.gray600,
    fontWeight: '500',
  },
  detailValue: {
    color: googleColors.gray900,
  },
  suspendedText: {
    color: googleColors.error,
  },
  actionsCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  actionButton: {
    marginBottom: 12,
  },
});
