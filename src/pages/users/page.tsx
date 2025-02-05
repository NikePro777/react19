import { Suspense, use, useState, useTransition } from 'react';
import { createUser, deleteUser, fetchUsers } from '../../shared/api';

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
        <UserList usersPromise={userPromise} refetchUsers={refetchUsers} />
      </Suspense>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [email, setEmail] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      await createUser({ email, id: crypto.randomUUID() });
      startTransition(() => {
        refetchUsers();
        setEmail('');
      });
    });
  };
  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
      />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        type="submit"
        disabled={isPending}>
        Add
      </button>
    </form>
  );
}

export function UserList({
  usersPromise,
  refetchUsers,
}: {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(usersPromise);
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCart key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCart({ user, refetchUsers }: { user: User; refetchUsers: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      deleteUser(user.id);
      startTransition(() => {
        refetchUsers();
      });
    });
  };

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <button
        className="bg-red-500 hover:bd-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400 cursor-pointer"
        onClick={handleDelete}
        type="button"
        disabled={isPending}>
        Delete
      </button>
    </div>
  );
}
