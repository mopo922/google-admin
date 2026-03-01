import axios from 'axios';
import { GOOGLE_API_BASE_URL } from '../config/google';
import { User, Group, GroupMember } from '../types';

const createApiClient = (accessToken: string) => {
  return axios.create({
    baseURL: GOOGLE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

// User Management
export const listUsers = async (
  accessToken: string,
  domain: string = 'primary',
  maxResults: number = 100
): Promise<User[]> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.get('/users', {
      params: {
        customer: 'my_customer',
        maxResults,
        orderBy: 'email',
      },
    });
    return response.data.users || [];
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};

export const getUser = async (accessToken: string, userKey: string): Promise<User> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.get(`/users/${userKey}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const createUser = async (
  accessToken: string,
  userData: {
    primaryEmail: string;
    name: { givenName: string; familyName: string };
    password: string;
  }
): Promise<User> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (
  accessToken: string,
  userKey: string,
  updates: Partial<User>
): Promise<User> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.put(`/users/${userKey}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (accessToken: string, userKey: string): Promise<void> => {
  try {
    const api = createApiClient(accessToken);
    await api.delete(`/users/${userKey}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const suspendUser = async (
  accessToken: string,
  userKey: string,
  suspended: boolean
): Promise<User> => {
  return updateUser(accessToken, userKey, { suspended });
};

// Group Management
export const listGroups = async (
  accessToken: string,
  maxResults: number = 100
): Promise<Group[]> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.get('/groups', {
      params: {
        customer: 'my_customer',
        maxResults,
        orderBy: 'email',
      },
    });
    return response.data.groups || [];
  } catch (error) {
    console.error('Error listing groups:', error);
    throw error;
  }
};

export const getGroup = async (accessToken: string, groupKey: string): Promise<Group> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.get(`/groups/${groupKey}`);
    return response.data;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

export const createGroup = async (
  accessToken: string,
  groupData: { email: string; name: string; description?: string }
): Promise<Group> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.post('/groups', groupData);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const updateGroup = async (
  accessToken: string,
  groupKey: string,
  updates: Partial<Group>
): Promise<Group> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.put(`/groups/${groupKey}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

export const deleteGroup = async (accessToken: string, groupKey: string): Promise<void> => {
  try {
    const api = createApiClient(accessToken);
    await api.delete(`/groups/${groupKey}`);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// Group Members Management
export const listGroupMembers = async (
  accessToken: string,
  groupKey: string
): Promise<GroupMember[]> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.get(`/groups/${groupKey}/members`);
    return response.data.members || [];
  } catch (error) {
    console.error('Error listing group members:', error);
    throw error;
  }
};

export const addGroupMember = async (
  accessToken: string,
  groupKey: string,
  memberEmail: string,
  role: 'OWNER' | 'MANAGER' | 'MEMBER' = 'MEMBER'
): Promise<GroupMember> => {
  try {
    const api = createApiClient(accessToken);
    const response = await api.post(`/groups/${groupKey}/members`, {
      email: memberEmail,
      role,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
};

export const removeGroupMember = async (
  accessToken: string,
  groupKey: string,
  memberKey: string
): Promise<void> => {
  try {
    const api = createApiClient(accessToken);
    await api.delete(`/groups/${groupKey}/members/${memberKey}`);
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};
