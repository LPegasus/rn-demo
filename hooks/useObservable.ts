import { useEffect, useState } from 'react';
import { type Observable } from 'rxjs';

export function useObservable<T>(source$: Observable<T>, defaultValue: T): T {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    const sub = source$.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [source$]);
  return value;
}
