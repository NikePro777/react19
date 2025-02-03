import { Suspense, use, useState } from 'react';
import { fetchUsers } from '../../shared/api';

type User = {
  id: string;
  email: string;
};

const defaultUsersPromise = fetchUsers();

export function UsersPage() {
  const [userPromise, setUserPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => {
    setUserPromise(fetchUsers());
  };
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>

      <CreateUserForm refetchUsers={refetchUsers} />
      <Suspense fallback={<div>Loading....</div>}>
        <UserList usersPromise={userPromise} />
      </Suspense>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  return (
    <form className="flex gap-2">
      <input type="email" className="border p-2 rounded" />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit">
        Add
      </button>
    </form>
  );
}

export function UserList({ usersPromise }: { usersPromise: Promise<User[]> }) {
  const users = use(usersPromise);
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCart key={user.id} user={user} />
      ))}
    </div>
  );
}

export function UserCart({ user }: { user: User }) {
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <button
        className="bg-red-500 hover:bd-red-700 text-white font-bold py-2 px-4 rounded ml-auto"
        type="button">
        Delete
      </button>
    </div>
  );
}
