import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Searchbar,
  FAB,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { listUsers } from '../services/adminService';
import { User } from '../types';
import { googleColors } from '../config/theme';

interface UsersScreenProps {
  accessToken: string;
  onUserPress: (user: User) => void;
  onCreateUser: () => void;
}

export default function UsersScreen({
  accessToken,
  onUserPress,
  onCreateUser,
}: UsersScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const userList = await listUsers(accessToken);
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users. Please check your permissions.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.fullName.toLowerCase().includes(query) ||
          user.primaryEmail.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const onRefresh = useCallback(() => {
    loadUsers(true);
  }, [accessToken]);

  const renderUserCard = ({ item: user }: { item: User }) => (
    <Card style={styles.userCard} onPress={() => onUserPress(user)}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Text
          size={48}
          label={user.name.givenName[0] + user.name.familyName[0]}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text variant="titleMedium" style={styles.userName}>
            {user.name.fullName}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user.primaryEmail}
          </Text>
          <View style={styles.chipContainer}>
            {user.isAdmin && (
              <Chip
                mode="flat"
                style={[styles.chip, styles.adminChip]}
                textStyle={styles.chipText}
              >
                Admin
              </Chip>
            )}
            {user.suspended && (
              <Chip
                mode="flat"
                style={[styles.chip, styles.suspendedChip]}
                textStyle={styles.chipText}
              >
                Suspended
              </Chip>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={googleColors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search users"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No users found
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onCreateUser}
        color="#ffffff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: googleColors.gray50,
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
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: googleColors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: googleColors.gray900,
    fontWeight: '500',
  },
  userEmail: {
    color: googleColors.gray600,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    height: 24,
  },
  chipText: {
    fontSize: 12,
    marginVertical: 0,
  },
  adminChip: {
    backgroundColor: googleColors.googleBlue + '20',
  },
  suspendedChip: {
    backgroundColor: googleColors.error + '20',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: googleColors.gray500,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: googleColors.primary,
  },
});
