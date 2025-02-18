import { startTransition } from 'react';
import { fetchUsers, User } from '../../shared/api';
import { create } from 'zustand';

type UserState = {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
};

export const useUsersGlobal = create<UserState>()((set) => ({
  usersPromise: fetchUsers(),
  refetchUsers: () => startTransition(() => set({ usersPromise: fetchUsers() })),
}));
