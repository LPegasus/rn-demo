export type Timestamp = string;

//#region Events

/**
 * Get a list of events according to a set of filters
 * 
 * @method GET `/events`
 */
export interface GetEventsListRequestBody {
  /** Retrieve events starting after this time */
  after?: Timestamp;
  /** Retrieve events ending before this time */
  before?: Timestamp;
  /**
   * Comma separated channel IDs. E.g. 3,7,9.If not specified, events from all channels will be returned.
   */
  channels?: string;
  /** Index of the starting record. Default: 0 */
  offset?: number;
  /** Number of entries to fetch. Default: 25 */
  limit?: number;
}

export interface GetEventsListResponseBody {
  events: GetEventDetailResponseBody[];
  hasMore: boolean;
}

export interface GetEventDetailResponseBody {
  event: {
    id: number;
    /** Event name */
    name: string;
    begin_time: Timestamp;
    end_time: Timestamp;
    description: string;
    creator_id: number;
    channel_id: number;
    creator: UserInfo;
    create_time: Timestamp;
    update_time: Timestamp;
    channel: ChannelInfo;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    me_likes: boolean;
    me_going: boolean;
    /** image urls */
    images: string[];
    location: string;
    location_detail: string;
    goings_count: number;
    likes_count: number;
  }
}

export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  password: string;
  email: string;
  salt: string;
  [key: string]: any;
}

/**
 * Get a list of all participants of an event.
 * 
 * @method GET `/events/{event_id}/participants`
 */
export interface GetEventParticipantsResponseBody {
  users: UserInfo[];
}

/**
 * Indicate participation of the current user in an event.
 * 
 * @method POST `/events/{event_id}/d`
 */
export interface PostParticipationRequestBody { }

/**
 * Cancel participation of the current user in an event
 * 
 * @method DELETE `/events/{event_id}/participants`
 */
export interface DeleteParticipationRequestBody { }

/**
 * Get a list of paginated comments of a event.
 * 
 * @method GET `/events/{event_id}/comments`
 */
export interface GetEventCommentsRequestBody {
  /** Index of the starting record. Defaults to 0 */
  offset?: number;
  /** Number of records to fetch. Defaults to 25 */
  limit?: number;
}

/**
 * @method GET `/events/{event_id}/comments`
 */
export interface GetEventCommentsResponseBody {
  comments: Comment[];
  hasMore: boolean;
}

export interface Comment {
  id: number;
  userId: number;
  eventId: number;
  create_time: Timestamp;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  user: UserInfo;
}

/**
 * Post a comment to an event.
 * 
 * @method POST `/events/{event_id}/comments`
 */
export interface PostEventCommentRequestBody {
  comment: string;
}

export interface PostEventCommentResponseBody {
  id: number;
  comment: string;
  create_time: Timestamp;
  author: UserInfo;
}

/**
 * Get a list of paginated users who have liked the event.
 * 
 * @method GET `/events/{event_id}/likes`
 */
export interface GetEventLikesRequestBody {
  offset: number;
  limit: number;
}

export interface GetEventLikesResponseBody {
  users: Array<Omit<UserInfo, 'avatar'>>;
  hasMore: boolean;
}

/**
 * Like an event as the current user.
 * 
 * @method POST `/events/{event_id}/likes`
 */
export interface PostEventLikesRequestBody { }
export interface PostEventLikesResponseBody { }

/**
 * Remove current user's like on an event.
 * 
 * @method POST `/events/{event_id}/likes`
 */
export interface DeleteEventLikesRequestBody { }
export interface DeleteEventLikesResponseBody { }

/**
 * Get a user's details
 * 
 * @method GET `/user`
 */
export interface GetUserRequestBody { }
export interface GetUserResponseBody {
  id: number;
  username: string;
  avatar: string;
  email: string;
  likes_count: number;
  past_count: number;
  goings_count: number;
}

/**
 * Get a paginated list of events that a user liked, planned going, or went.
 * If target user is different from the current authenticated user, 400 bad request will be returned.
 * 
 * @method GET `/user/events`
 */
export interface GetUserEventsRequestBody {
  offset?: number;
  limit?: number;
  type: 'liked' | 'going' | 'past';
}

export interface GetUserEventsResponseBody {
  events: GetEventDetailResponseBody[];
  hasMore: boolean;
}
//#endregion

//#region Channels
/**
 * Get a list of all channels.
 * 
 * @method GET `/channels`
 */
export interface GetChannelsRequestBody { }
export interface GetChannelsResponseBody {
  channels: ChannelInfo[];
}
export interface ChannelInfo {
  id: number;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
//#endregion

//#region User authentication
/**
 * @method POST `/join`
 */
export interface PostJoinRequestBody {
  username: string;
  password: string;
  email: string;
}
export interface PostJoinResponseBody {
  token: string;
  user: UserInfo & { email: string }
}

/**
 * Requesting a temporary authentication token for a given user. The token will then be used for subsequent API calls to identify that user.
 * 
 * @method POST `/auth/token`
 */
export interface PostAuthTokenRequestBody {
  username: string;
  password: string;
}
export interface PostAuthTokenResponseBody {
  /** A temporary authentication token. This token should be attached for user-specific API calls. */
  token: string;
  user: UserInfo & { email: string }
}

/**
 * Delete the temporary authentication token, which effectively log the user out.
 * 
 * @method DELETE `/auth/token`
 */
export interface DeleteAuthToken { }
//#endregion
