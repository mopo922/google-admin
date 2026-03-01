import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  IconButton,
  Card,
} from 'react-native-paper';
import { createUser } from '../services/adminService';
import { googleColors } from '../config/theme';

interface CreateUserScreenProps {
  accessToken: string;
  onBack: () => void;
  onUserCreated: () => void;
}

export default function CreateUserScreen({
  accessToken,
  onBack,
  onUserCreated,
}: CreateUserScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateUser = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setIsCreating(true);
      await createUser(accessToken, {
        primaryEmail: email.trim(),
        name: {
          givenName: firstName.trim(),
          familyName: lastName.trim(),
        },
        password: password,
      });
      alert('User created successfully!');
      onUserCreated();
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to create user.';
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
          Create User
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              User Information
            </Text>

            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              disabled={isCreating}
            />

            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              disabled={isCreating}
            />

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={isCreating}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={isCreating}
            />

            <Button
              mode="contained"
              onPress={handleCreateUser}
              disabled={isCreating}
              style={styles.createButton}
              loading={isCreating}
            >
              Create User
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
