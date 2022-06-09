import { FeedItemStructure } from '../screens/Feeds/FeedCard';

export function createFeedItemPagination(firstId: number = 1): FeedItemStructure[] {
  const defaultValue = {
    id: firstId,
    username: "LPegasus",
    title: "Activity Title Name Make it Longer May Longer than One Line",
    timeRange: "14 May 2016 12:22 - 14 May 2016 18:00",
    content:
      "[No longer than 300 chars] Vivamus sagittis, diam in lobortis, sapien arcu mattis erat, vel aliquet sem urna et risus. Ut feugiat sapien mi pointelkvsdf slnvinsdjf lemonun lkvnidl. [No longer than 300 chars] Vivamus sagittis, diam in lobortis, sapien arcu mattis erat, vel aliquet sem urna et risus. Ut feugiat sapien mi pointelkvsdf slnvinsdjf lemonun lkvnidl.",
    liking: true,
    going: true,
    goingCount: 1,
    likingCount: 2,
    channelName:
      "Channel gq Channel NameChannel Name Channel NameChannel Name Channel Name",
    avatarUrl:
      "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&w=80&h=80&q=80",
  }

  return Array.from({ length: 10 }).map((_, index) => {
    return {
      ...defaultValue,
      id: index + firstId,
      channelName: `Channel No.${index + firstId}`
    }
  });
}
