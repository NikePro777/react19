type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>

      <CreateUserForm />

      <UserList
        users={[
          { id: '1', email: 'sdfdsf@dsf' },
          { id: '2', email: '123sf@dsf' },
        ]}
      />
    </main>
  );
}

export function CreateUserForm() {
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

export function UserList({ users }: { users: User[] }) {
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
