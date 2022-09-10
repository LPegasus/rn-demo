import { createContext } from 'react';
import { HostComponent, NativeMethods, NativeScrollEvent, NativeSyntheticEvent, View, type ViewToken } from 'react-native';
import { from, Observable, of, Subject } from 'rxjs';

export function createViewableItemsChangedStream() {
  return new Subject<{
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }>();
}

export const StreamContext = createContext<{
  changed$: Observable<ViewToken>;
  scroll$: Observable<void>;
  activeIdsChange$: Observable<string[]>;
  playingId$: Observable<{ id: string, type: 'end' | 'start' } | null>;
  reportLayout: (ref: View, id: string) => void;
  handleVideoPlayEnd: (id: ItemType['id']) => void;
}>(null as any);

export type UnpackContextValueType<T> = T extends React.Context<infer U> ? U : never;

export type CardPos = {
  x: number;
  y: number;
  height: number;
  width: number;
  id: string;
}

export interface ItemType {
  id: string;
  type: "img" | "video";
  dur: number;
}
