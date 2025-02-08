import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Task } from '../../shared/api';
import { useParams } from 'react-router-dom';

export function TodoListPage() {
  const { userId } = useParams();

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks user {userId}</h1>

      <CreateTaskForm />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">Something went wrong: {JSON.stringify(e)}</div>
        )}>
        <Suspense fallback={<div>Loading....</div>}>
          <TasksList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateTaskForm() {
  return (
    <form>
      <input name="email" type="email" className="border p-2 rounded" />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        type="submit">
        Add
      </button>
    </form>
  );
}

export function TasksList() {
  const tasks = [] as Task[];
  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCart key={task.id} task={task} />
      ))}
    </div>
  );
}

export function TaskCart({ task }: { task: Task }) {
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {task.title}
      <form className="ml-auto">
        <input type="hidden" name="id" value={task.id} />{' '}
        <button className="bg-red-500 hover:bd-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400 cursor-pointer">
          Delete
        </button>
      </form>
    </div>
  );
}
