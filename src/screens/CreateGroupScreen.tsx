import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  IconButton,
  Card,
} from 'react-native-paper';
import { createGroup } from '../services/adminService';
import { googleColors } from '../config/theme';

interface CreateGroupScreenProps {
  accessToken: string;
  onBack: () => void;
  onGroupCreated: () => void;
}

export default function CreateGroupScreen({
  accessToken,
  onBack,
  onGroupCreated,
}: CreateGroupScreenProps) {
  const [groupName, setGroupName] = useState('');
  const [groupEmail, setGroupEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !groupEmail.trim()) {
      alert('Please fill in the required fields.');
      return;
    }

    try {
      setIsCreating(true);
      await createGroup(accessToken, {
        email: groupEmail.trim(),
        name: groupName.trim(),
        description: description.trim() || undefined,
      });
      alert('Group created successfully!');
      onGroupCreated();
    } catch (error: any) {
      console.error('Error creating group:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to create group.';
      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Create Group
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Group Information
            </Text>

            <TextInput
              label="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              mode="outlined"
              style={styles.input}
              disabled={isCreating}
            />

            <TextInput
              label="Group Email"
              value={groupEmail}
              onChangeText={setGroupEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={isCreating}
            />

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              disabled={isCreating}
            />

            <Button
              mode="contained"
              onPress={handleCreateGroup}
              disabled={isCreating}
              style={styles.createButton}
              loading={isCreating}
            >
              Create Group
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
  card: {
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    color: googleColors.gray900,
    fontWeight: '500',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  createButton: {
    marginTop: 8,
  },
});
