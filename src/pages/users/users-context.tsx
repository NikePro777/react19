import { createContext, startTransition, useState } from 'react';
import { fetchUsers, User } from '../../shared/api';

export type UserContextType = {
  users: Promise<User[]>;
  refetchUsers: () => void;
};

export const UsersContext = createContext({} as const);

const defaultUsersPromise = fetchUsers();

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => startTransition(() => setUsersPromise(fetchUsers()));

  return <UsersContext value={{ users: usersPromise, refetchUsers }}>{children}</UsersContext>;
}

export function useUsers() {}
