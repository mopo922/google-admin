import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Searchbar,
  FAB,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { listGroups } from '../services/adminService';
import { Group } from '../types';
import { googleColors } from '../config/theme';

interface GroupsScreenProps {
  accessToken: string;
  onGroupPress: (group: Group) => void;
  onCreateGroup: () => void;
}

export default function GroupsScreen({
  accessToken,
  onGroupPress,
  onCreateGroup,
}: GroupsScreenProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadGroups = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const groupList = await listGroups(accessToken);
      setGroups(groupList);
      setFilteredGroups(groupList);
    } catch (error) {
      console.error('Error loading groups:', error);
      alert('Failed to load groups. Please check your permissions.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGroups(groups);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.email.toLowerCase().includes(query) ||
          (group.description && group.description.toLowerCase().includes(query))
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  const onRefresh = useCallback(() => {
    loadGroups(true);
  }, [accessToken]);

  const renderGroupCard = ({ item: group }: { item: Group }) => (
    <Card style={styles.groupCard} onPress={() => onGroupPress(group)}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Icon
          size={48}
          icon="account-group"
          style={styles.avatar}
        />
        <View style={styles.groupInfo}>
          <Text variant="titleMedium" style={styles.groupName}>
            {group.name}
          </Text>
          <Text variant="bodyMedium" style={styles.groupEmail}>
            {group.email}
          </Text>
          {group.description && (
            <Text variant="bodySmall" style={styles.groupDescription}>
              {group.description}
            </Text>
          )}
          {group.directMembersCount !== undefined && (
            <Text variant="bodySmall" style={styles.memberCount}>
              {group.directMembersCount} member{group.directMembersCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <IconButton
          icon="chevron-right"
          size={24}
          iconColor={googleColors.gray500}
        />
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={googleColors.primary} />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search groups"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No groups found
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onCreateGroup}
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
  groupCard: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: googleColors.googleGreen,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 16,
  },
  groupName: {
    color: googleColors.gray900,
    fontWeight: '500',
  },
  groupEmail: {
    color: googleColors.gray600,
    marginTop: 4,
  },
  groupDescription: {
    color: googleColors.gray500,
    marginTop: 4,
  },
  memberCount: {
    color: googleColors.gray600,
    marginTop: 8,
    fontWeight: '500',
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
