import { startTransition, Suspense, use, useActionState, useState, useTransition } from 'react';
import { createUser, deleteUser, fetchUsers } from '../../shared/api';
import { ErrorBoundary } from 'react-error-boundary';
import { createUserAction } from './actions';

type User = {
  id: string;
  email: string;
};

const defaultUsersPromise = fetchUsers();

export function UsersPage() {
  const [userPromise, setUserPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => startTransition(() => setUserPromise(fetchUsers()));
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>

      <CreateUserForm refetchUsers={refetchUsers} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">Somethink went wrong: {JSON.stringify(e)}</div>
        )}>
        <Suspense fallback={<div>Loading....</div>}>
          <UserList usersPromise={userPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [state, dispatch, isPending] = useActionState(createUserAction({ refetchUsers }), {});

  return (
    <form className="flex gap-2" action={dispatch}>
      <input
        type="email"
        className="border p-2 rounded"
        // value={email}
        // onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
      />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        type="submit"
        disabled={isPending}>
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
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

      refetchUsers();
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
