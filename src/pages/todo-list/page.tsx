import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchTasks, PaginatedResponse, Task } from '../../shared/api';
import { useParams } from 'react-router-dom';
import { createTaskAction, deleteTaskAction } from './actions';
import { useUsersGlobal } from '../../app/entities/user';

export function TodoListPage() {
  const { userId = '' } = useParams();

  const [paginatedTasksPromise, setTaskPromise] = useState(() =>
    fetchTasks({ filters: { userId } }),
  );

  const refetchTasks = () =>
    startTransition(async () => {
      const { page } = await paginatedTasksPromise;
      setTaskPromise(fetchTasks({ filters: { userId }, page }));
    });

  const onPageChange = (newPage: number) => {
    setTaskPromise(fetchTasks({ filters: { userId }, page: newPage }));
  };

  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise],
  );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks:</h1>

      <CreateTaskForm refetchTasks={refetchTasks} userId={userId} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">Something went wrong: {JSON.stringify(e)}</div>
        )}>
        <Suspense fallback={<div>Loading....</div>}>
          <TasksList tasksPromise={tasksPromise} refetchTasks={refetchTasks} />
          <Pagination tasksPaginated={paginatedTasksPromise} onPageChange={onPageChange} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function UserPreview({ userId }: { userId: string }) {
  const { usersPromise } = useUsersGlobal();
  const users = use(usersPromise);
  return <span>{users.find((u) => u.id === userId)?.email}</span>;
}

function Pagination<T>({
  tasksPaginated,
  onPageChange,
}: {
  tasksPaginated: Promise<PaginatedResponse<T>>;
  onPageChange?: (page: number) => void;
}) {
  const [isLoading, startTransition] = useTransition();
  const { last, page, first, next, prev, pages } = use(tasksPaginated);
  const handlePageChange = (page: number) => () => {
    startTransition(() => onPageChange?.(page));
  };

  return (
    <nav className={`${isLoading ? 'opacity-50' : ''} flex items-center justify-between`}>
      <div className="grid grid-cols-4 gap-2">
        <button
          disabled={isLoading}
          onClick={handlePageChange(first)}
          className="px-3 py-2 rounded-1">
          First ({first})
        </button>
        {prev && (
          <button disabled={isLoading} onClick={handlePageChange(prev)} className="px-3 py-2">
            Prev ({prev})
          </button>
        )}
        {next && (
          <button disabled={isLoading} onClick={handlePageChange(next)} className="px-3 py-2">
            Next ({next})
          </button>
        )}
        <button
          disabled={isLoading}
          onClick={handlePageChange(last)}
          className="px-3 py-2 rounded-r">
          Last ({last})
        </button>
      </div>
      <span className="text-sm">
        Page {page} of {pages}
      </span>
    </nav>
  );
}

export function CreateTaskForm({
  refetchTasks,
  userId,
}: {
  refetchTasks: () => void;
  userId: string;
}) {
  const [state, dispatch, isPending] = useActionState(createTaskAction({ refetchTasks, userId }), {
    title: '',
  });
  return (
    <form className="flex gap-2" action={dispatch}>
      <input name="title" type="text" className="border p-2 rounded" />
      <button
        className="bg-blue-500 hover:border-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        type="submit"
        defaultValue={state.title}
        disabled={isPending}>
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </form>
  );
}

export function TasksList({
  tasksPromise,
  refetchTasks,
}: {
  tasksPromise: Promise<Task[]>;
  refetchTasks: () => void;
}) {
  const tasks = use(tasksPromise);
  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCart key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </div>
  );
}

export function TaskCart({ task, refetchTasks }: { task: Task; refetchTasks: () => void }) {
  const [deleteState, handleDelete, isPending] = useActionState(
    deleteTaskAction({ refetchTasks }),
    {},
  );
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {task.title} -
      <Suspense fallback={<div>Loading...</div>}>
        <UserPreview userId={task.userId} />
      </Suspense>
      <form className="ml-auto" action={handleDelete}>
        <button
          disabled={isPending}
          className="bg-red-500 hover:bd-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400 cursor-pointer">
          Delete
          {deleteState.error && <div className="text-red-500">{deleteState.error}</div>}
        </button>
      </form>
    </div>
  );
}
