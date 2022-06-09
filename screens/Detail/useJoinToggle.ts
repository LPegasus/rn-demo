import { useCallback } from "react";
import { from, Observable, takeUntil } from "rxjs";
import { CancelEventParticipant, PostEventParticipate } from "../../api";
import { GetEventDetailResponseBody } from "../../api/interface";
import { useEventDetail } from "./useEventDetail";

export function useJoinToggle(
  event: GetEventDetailResponseBody['event'] | undefined,
  cancel$: Observable<any>,
  eventDetailQuery: ReturnType<typeof useEventDetail>
) {
  const handleFavoritePress = useCallback(() => {
    if (!event) {
      return;
    }
    from(event.me_going ? CancelEventParticipant(event.id, {}) : PostEventParticipate(event.id, {}))
      .pipe(takeUntil(cancel$))
      .subscribe({
        next: (payload) => {
          if (payload.type === "success") {
            eventDetailQuery.update((s) => {
              const nextState = { ...s };
              nextState.event = {
                ...s.event,
                me_going: !s.event.me_going,
                goings_count: s.event.goings_count + (!s.event.me_going ? 1 : -1),
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
                me_going: !s.event.me_going,
                goings_count: s.event.goings_count + (!s.event.me_going ? 1 : -1),
              };
              return nextState;
            });
          }
        },
      });
  }, [event, eventDetailQuery.update]);

  return handleFavoritePress;
}
