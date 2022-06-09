import { useCallback, useEffect, useState } from "react";
import { from } from "rxjs";

export function useFetchData<G extends (...args: any[]) => AsyncGenerator<any>>(fn: G, params: Parameters<G>) {
  const [state, setState] = useState<{
    err?: any, loading: boolean; resp: null | PickResultOfFetch<G>
  }>({ loading: false, resp: null });
  const [refreshToken, triggerRefresh] = useState(0);

  useEffect(() => {
    const sub = from(fn(...params)).subscribe({
      next: (payload) => {
        switch (payload.type) {
          case "loading":
            setState(s => ({
              ...s,
              loading: true,
            }));
            break;
          case "success":
            setState({
              loading: false,
              resp: (payload as any).resp,
            })
            break;
        }
      },
      error: (err) => {
        setState(s => ({
          ...s,
          loading: false,
          err,
        }));
      }
    });

    return () => sub.unsubscribe();
  }, [JSON.stringify(params), refreshToken]);

  const update: (updater: (s: PickResultOfFetch<G>) => PickResultOfFetch<G>) => void = useCallback((fn) => {
    return setState(s => ({ ...s, resp: fn(s.resp!) }))
  }, [state.resp])

  const refresh: () => void = useCallback(() => {
    triggerRefresh(s => s + 1)
  }, []);

  const s = { ...state, update, refresh };

  return s;
}

type PickResultOfFetch<G extends (...args: any[]) => AsyncGenerator<any>> =
  G extends (...args: infer _) => AsyncGenerator<infer R>
  ? R extends { type: 'success', resp: infer U } ? U : never
  : never;
