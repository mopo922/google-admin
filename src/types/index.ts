export interface User {
  id: string;
  primaryEmail: string;
  name: {
    givenName: string;
    familyName: string;
    fullName: string;
  };
  isAdmin?: boolean;
  suspended?: boolean;
  orgUnitPath?: string;
  thumbnailPhotoUrl?: string;
  creationTime?: string;
  lastLoginTime?: string;
}

export interface Group {
  id: string;
  email: string;
  name: string;
  description?: string;
  directMembersCount?: number;
  adminCreated?: boolean;
}

export interface GroupMember {
  id: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'MEMBER';
  type: 'USER' | 'GROUP';
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: {
    email: string;
    name: string;
    picture?: string;
  } | null;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  UserDetails: { userId: string };
  GroupDetails: { groupId: string };
  CreateUser: undefined;
  CreateGroup: undefined;
};
