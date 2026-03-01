import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
  List,
  FAB,
  TextInput,
  Portal,
  Dialog,
} from 'react-native-paper';
import {
  getGroup,
  deleteGroup,
  listGroupMembers,
  addGroupMember,
  removeGroupMember,
} from '../services/adminService';
import { Group, GroupMember } from '../types';
import { googleColors } from '../config/theme';

interface GroupDetailsScreenProps {
  groupId: string;
  accessToken: string;
  onBack: () => void;
  onGroupDeleted: () => void;
}

export default function GroupDetailsScreen({
  groupId,
  accessToken,
  onBack,
  onGroupDeleted,
}: GroupDetailsScreenProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setIsLoading(true);
      const [groupData, membersList] = await Promise.all([
        getGroup(accessToken, groupId),
        listGroupMembers(accessToken, groupId),
      ]);
      setGroup(groupData);
      setMembers(membersList);
    } catch (error) {
      console.error('Error loading group:', error);
      alert('Failed to load group details.');
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;
    
    const confirmDelete = confirm(
      `Are you sure you want to delete ${group.name}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setIsUpdating(true);
      await deleteGroup(accessToken, group.id);
      alert('Group deleted successfully.');
      onGroupDeleted();
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group.');
      setIsUpdating(false);
    }
  };

  const handleAddMember = async () => {
    if (!group || !newMemberEmail.trim()) return;
    
    try {
      setIsUpdating(true);
      await addGroupMember(accessToken, group.id, newMemberEmail.trim());
      setNewMemberEmail('');
      setShowAddMemberDialog(false);
      // Reload members
      const membersList = await listGroupMembers(accessToken, group.id);
      setMembers(membersList);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please check the email address.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!group) return;
    
    const confirmRemove = confirm(
      `Remove ${memberEmail} from ${group.name}?`
    );
    
    if (!confirmRemove) return;
    
    try {
      setIsUpdating(true);
      await removeGroupMember(accessToken, group.id, memberId);
      // Reload members
      const membersList = await listGroupMembers(accessToken, group.id);
      setMembers(membersList);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderMember = ({ item: member }: { item: GroupMember }) => (
    <List.Item
      title={member.email}
      description={`Role: ${member.role}`}
      left={(props) => (
        <Avatar.Icon
          {...props}
          size={40}
          icon={member.type === 'USER' ? 'account' : 'account-group'}
          style={styles.memberAvatar}
        />
      )}
      right={(props) => (
        <IconButton
          {...props}
          icon="delete"
          iconColor={googleColors.error}
          onPress={() => handleRemoveMember(member.id, member.email)}
          disabled={isUpdating}
        />
      )}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={googleColors.primary} />
        <Text style={styles.loadingText}>Loading group details...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Group Details
        </Text>
        <View style={{ width: 48 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon
              size={80}
              icon="account-group"
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.groupName}>
              {group.name}
            </Text>
            <Text variant="bodyLarge" style={styles.groupEmail}>
              {group.email}
            </Text>
            {group.description && (
              <Text variant="bodyMedium" style={styles.groupDescription}>
                {group.description}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.membersCard}>
          <Card.Content>
            <View style={styles.membersHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Members ({members.length})
              </Text>
              <IconButton
                icon="plus"
                iconColor={googleColors.primary}
                onPress={() => setShowAddMemberDialog(true)}
              />
            </View>
            <Divider style={styles.divider} />
            
            {members.length === 0 ? (
              <Text style={styles.emptyText}>No members in this group</Text>
            ) : (
              <FlatList
                data={members}
                renderItem={renderMember}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Button
              mode="outlined"
              onPress={handleDeleteGroup}
              disabled={isUpdating}
              style={styles.actionButton}
              textColor={googleColors.error}
            >
              Delete Group
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={showAddMemberDialog}
          onDismiss={() => setShowAddMemberDialog(false)}
        >
          <Dialog.Title>Add Member</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Email Address"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isUpdating}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddMemberDialog(false)}>Cancel</Button>
            <Button
              onPress={handleAddMember}
              disabled={isUpdating || !newMemberEmail.trim()}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    backgroundColor: googleColors.googleGreen,
    marginBottom: 16,
  },
  groupName: {
    color: googleColors.gray900,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupEmail: {
    color: googleColors.gray600,
    marginBottom: 8,
  },
  groupDescription: {
    color: googleColors.gray500,
    textAlign: 'center',
    marginTop: 8,
  },
  membersCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: googleColors.gray900,
    fontWeight: '500',
  },
  divider: {
    marginBottom: 8,
  },
  emptyText: {
    color: googleColors.gray500,
    textAlign: 'center',
    paddingVertical: 16,
  },
  memberAvatar: {
    backgroundColor: googleColors.primary,
  },
  actionsCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  actionButton: {
    marginBottom: 12,
  },
});
