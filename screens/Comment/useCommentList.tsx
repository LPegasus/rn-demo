import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-native";
import { from } from "rxjs";
import { GetEventCommentsMock } from "../../api";
import { GetEventCommentsResponseBody } from "../../api/interface";

const pageSize = 25;

export function useCommentList(eventId?: number) {
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetEventCommentsResponseBody | null>(null);

  useEffect(() => {
    if (!eventId) {
      return;
    }
    const offset = pageIndex * pageSize;
    const sub = from(GetEventCommentsMock(eventId, { offset })).subscribe({
      next: (payload) => {
        switch (payload.type) {
          case "loading":
            setLoading(true);
            break;
          case "success":
            unstable_batchedUpdates(() => {
              setLoading(false);
              setData(payload.resp);
            });
            break;
        }
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, [pageIndex, eventId]);

  return {
    data,
    loading,
    loadMore: () => {
      if (data?.hasMore) {
        setPageIndex((prev) => prev + 1);
      }
    },
  };
}
