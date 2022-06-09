import { useCallback } from "react";
import { from, Observable, takeUntil } from "rxjs";
import { CancelLike, PostLike } from "../../api";
import { GetEventDetailResponseBody } from "../../api/interface";
import { useEventDetail } from "./useEventDetail";

export function useFavoriteToggle(
  event: GetEventDetailResponseBody['event'] | undefined,
  cancel$: Observable<any>,
  eventDetailQuery: ReturnType<typeof useEventDetail>
) {
  const handleFavoritePress = useCallback(() => {
    if (!event) {
      return;
    }
    from(event.me_likes ? CancelLike(event.id, {}) : PostLike(event.id, {}))
      .pipe(takeUntil(cancel$))
      .subscribe({
        next: (payload) => {
          if (payload.type === "success") {
            eventDetailQuery.update((s) => {
              const nextState = { ...s };
              nextState.event = {
                ...s.event,
                me_likes: !s.event.me_likes,
                likes_count: s.event.likes_count + (!s.event.me_likes ? 1 : -1),
              };
              return nextState;
            });
            eventDetailQuery.refresh();
          }
        },
        error: () => {
          if (process.env.NODE_ENV === 'development') {
            eventDetailQuery.update((s) => {
              const nextState = { ...s };
              nextState.event = {
                ...s.event,
                me_likes: !s.event.me_likes,
                likes_count: s.event.likes_count + (!s.event.me_likes ? 1 : -1),
              };
              return nextState;
            });
          }
        },
      });
  }, [event, eventDetailQuery.update]);

  return handleFavoritePress;
}
