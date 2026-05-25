import { useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export function useAsyncData<T>(loader: () => Promise<T>, dependencies: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    setState({
      data: null,
      error: null,
      loading: true,
    });

    loader()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setState({
          data,
          error: null,
          loading: false,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setState({
          data: null,
          error: error instanceof Error ? error.message : 'Не удалось загрузить данные',
          loading: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
}
