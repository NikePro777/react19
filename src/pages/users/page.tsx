import { Suspense, useActionState, useOptimistic, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateUserAction, DeleteUserAction } from './actions';
import { useUsers } from './use-users';
import { Link } from 'react-router-dom';

type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  const { useUsersList, createUserAction, deleteUserAction } = useUsers();
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>

      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">Something went wrong: {JSON.stringify(e)}</div>
        )}>
        <Suspense fallback={<div>Loading....</div>}>
          <UsersList useUsersList={useUsersList} deleteUserAction={deleteUserAction} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({ createUserAction }: { createUserAction: CreateUserAction }) {
  const [state, dispatch] = useActionState(createUserAction, {
    email: '',
  });

  const [optimisticState, setOptimisticState] = useOptimistic(state);
  const form = useRef<HTMLFormElement>(null);
  return (
    <form
      className="flex gap-2"
      ref={form}
      action={(formData: FormData) => {
        setOptimisticState({ email: '' });
        dispatch(formData);
        form?.current?.reset();
      }}>
      <input
        name="email"
        type="text"
        className="border p-2 rounded"
        defaultValue={optimisticState.email}
      />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        type="submit">
        Add
      </button>
      {optimisticState.error && <div className="text-red-500">{optimisticState.error}</div>}
    </form>
  );
}

export function UsersList({
  deleteUserAction,
  useUsersList,
}: {
  deleteUserAction: DeleteUserAction;
  useUsersList: () => User[];
}) {
  const users = useUsersList();
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCart key={user.id} user={user} deleteUserAction={deleteUserAction} />
      ))}
    </div>
  );
}

export function UserCart({
  user,
  deleteUserAction,
}: {
  user: User;
  deleteUserAction: DeleteUserAction;
}) {
  const [state, handleDelete] = useActionState(deleteUserAction, {});
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}
      <form action={handleDelete} className="ml-auto">
        <input type="hidden" name="id" value={user.id} />{' '}
        {/* нам в нашу форму как то id нужно передать.... вот так*/}
        <Link
          to={`/${user.id}/tasks`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400">
          Tasks
        </Link>
        <button className="bg-red-500 hover:bd-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400 cursor-pointer">
          Delete {state.error && <div className="text-red-500">{state.error}</div>}
        </button>
      </form>
    </div>
  );
}
