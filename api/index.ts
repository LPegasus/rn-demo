import { FetchError } from "./FetchError";
import { DeleteAuthToken, DeleteEventLikesRequestBody, DeleteParticipationRequestBody, GetChannelsRequestBody, GetChannelsResponseBody, GetEventCommentsRequestBody, GetEventCommentsResponseBody, GetEventDetailResponseBody, GetEventLikesRequestBody, GetEventLikesResponseBody, GetEventParticipantsResponseBody, GetEventsListRequestBody, GetEventsListResponseBody, GetUserEventsRequestBody, GetUserEventsResponseBody, GetUserRequestBody, GetUserResponseBody, PostAuthTokenRequestBody, PostAuthTokenResponseBody, PostEventCommentRequestBody, PostEventCommentResponseBody, PostEventLikesRequestBody, PostEventLikesResponseBody, PostJoinRequestBody, PostJoinResponseBody, PostParticipationRequestBody } from "./interface";

const urlPrefix = 'http://seller.et.api.test.shopee.io/active/api/v1';
const tokenKey = 'X-BLACKCAT-TOKEN';

const loading = { type: 'loading' } as const;
function createSuccessResp<T>(resp: T): { type: 'success', resp: T } {
  return { type: 'success', resp }
}

let _token = '';

async function xFetch<T = unknown>(path: string, method: 'GET' | 'POST' | 'DELETE' = 'GET', body?: any) {
  let url = `${urlPrefix}${path}`;
  const reqInit: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      [tokenKey]: _token,
    },
  }

  if (body) {
    if (method === 'GET') {
      const search = new URLSearchParams();
      Object.keys(body).forEach(k => {
        const v = body[k];
        search.append(k, String(v));
      });
      url += '?' + search.toString();
    } else {
      reqInit.body = JSON.stringify(body);
    }
  }

  const resp = await fetch(url, reqInit);
  const status = resp.status;
  const json = await resp.json();

  if (status === 200) {
    return json as T;
  } else {
    const err = new FetchError(status, json.error || '');
    throw err;
  }
}

export async function* GetChannels(body: GetChannelsRequestBody) {
  yield loading;
  const resp = await xFetch<GetChannelsResponseBody>(`/channels`, 'GET', body);
  yield createSuccessResp(resp);
}

export async function* GetEventDetail(event_id: number | string) {
  yield loading;
  const resp = await xFetch<GetEventDetailResponseBody>('/events/' + event_id);
  yield createSuccessResp(resp);
}

export async function* GetEventComments(eventId: number, body: GetEventCommentsRequestBody) {
  yield loading;
  const resp = await xFetch<GetEventCommentsResponseBody>(`/events/${eventId}/comments`);
  yield createSuccessResp(resp);
}

export async function* GetEventsList(body: GetEventsListRequestBody) {
  yield loading;
  const resp = await xFetch<GetEventsListResponseBody>('/events', 'GET', body);
  yield createSuccessResp(resp);
}

export async function* GetEventParticipants(event_id: number) {
  yield loading;
  const resp = await xFetch<GetEventParticipantsResponseBody>(`/events/${event_id}/participants`);
  yield createSuccessResp(resp);
}

export async function* GetUser(body: GetUserRequestBody) {
  yield loading;
  const resp = await xFetch<GetUserResponseBody>(`/user`, 'GET', body);
  yield createSuccessResp(resp);
}

export async function* GetUserEvents(body: GetUserEventsRequestBody) {
  yield loading;
  const resp = await xFetch<GetUserEventsResponseBody>(`/user`, 'GET', body);
  yield createSuccessResp(resp);
}

export async function* GetEventLikes(event_id: number, body: GetEventLikesRequestBody) {
  yield loading;
  const resp = await xFetch<GetEventLikesResponseBody>(`/events/${event_id}/likes`, 'GET', body);
  yield createSuccessResp(resp);
}

export async function* Join(body: PostJoinRequestBody) {
  yield loading;
  const resp = await xFetch<PostJoinResponseBody>(`/join`, 'POST', body);
  yield createSuccessResp(resp);
}

export async function* AuthToken(body: PostAuthTokenRequestBody) {
  yield loading;
  const resp = await xFetch<PostAuthTokenResponseBody>(`/auth/token`, 'POST', body);
  if (resp.token) {
    _token = resp.token;
  }
  yield createSuccessResp(resp);
}

export async function* PostEventParticipate(event_id: number, body: PostParticipationRequestBody) {
  yield loading;
  const resp = await xFetch<void>(`/events/${event_id}/d`, 'POST', body);
  yield createSuccessResp(resp);
}

export async function* PostComment(event_id: number, body: PostEventCommentRequestBody) {
  yield loading;
  const resp = await xFetch<PostEventCommentResponseBody>(`/events/${event_id}/comments`, 'POST', body);
  yield createSuccessResp(resp);
}

export async function* PostLike(event_id: number, body: PostEventLikesRequestBody) {
  yield loading;
  const resp = await xFetch<PostEventLikesResponseBody>(`/events/${event_id}/likes`, 'POST', body);
  yield createSuccessResp(resp);
}

export async function* Logout(body: DeleteAuthToken) {
  yield loading;
  const resp = await xFetch(`/auth/token`, 'DELETE', body);
  yield createSuccessResp(resp);
}


export async function* CancelEventParticipant(event_id: number, body: DeleteParticipationRequestBody) {
  yield loading;
  const resp = await xFetch(`/events/${event_id}/participants`, 'DELETE', body);
  yield createSuccessResp(resp);
}

export async function* CancelLike(event_id: number, body: DeleteEventLikesRequestBody) {
  yield loading;
  const resp = await xFetch(`/events/${event_id}/likes`, 'DELETE', body);
  yield createSuccessResp(resp);
}

function sleep(t = 500) {
  return new Promise(r => setTimeout(r, t));
}

export async function* GetEventCommentsMock(...args: Parameters<typeof GetEventComments>) {
  yield loading;
  await sleep();
  const resp: GetEventCommentsResponseBody = {
    "hasMore": false,
    "comments": [
      {
        "id": 1,
        "userId": 15,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.256Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.256Z",
        "updatedAt": "2022-06-03T20:39:12.256Z",
        "user": {
          "id": 15,
          "username": "user_12",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_12@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-13.png",
          "createdAt": "2022-06-03T20:39:12.054Z",
          "updatedAt": "2022-06-03T20:39:12.054Z"
        }
      },
      {
        "id": 2,
        "userId": 37,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.256Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 37,
          "username": "user_34",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_34@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-15.png",
          "createdAt": "2022-06-03T20:39:12.056Z",
          "updatedAt": "2022-06-03T20:39:12.056Z"
        }
      },
      {
        "id": 3,
        "userId": 15,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 15,
          "username": "user_12",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_12@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-13.png",
          "createdAt": "2022-06-03T20:39:12.054Z",
          "updatedAt": "2022-06-03T20:39:12.054Z"
        }
      },
      {
        "id": 4,
        "userId": 13,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 13,
          "username": "user_10",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_10@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-11.png",
          "createdAt": "2022-06-03T20:39:12.054Z",
          "updatedAt": "2022-06-03T20:39:12.054Z"
        }
      },
      {
        "id": 5,
        "userId": 45,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 45,
          "username": "user_42",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_42@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-3.png",
          "createdAt": "2022-06-03T20:39:12.057Z",
          "updatedAt": "2022-06-03T20:39:12.057Z"
        }
      },
      {
        "id": 6,
        "userId": 5,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 5,
          "username": "user_2",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_2@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-3.png",
          "createdAt": "2022-06-03T20:39:12.052Z",
          "updatedAt": "2022-06-03T20:39:12.052Z"
        }
      },
      {
        "id": 7,
        "userId": 41,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 41,
          "username": "user_38",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_38@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
          "createdAt": "2022-06-03T20:39:12.057Z",
          "updatedAt": "2022-06-03T20:39:12.057Z"
        }
      },
      {
        "id": 8,
        "userId": 21,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 21,
          "username": "user_18",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_18@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
          "createdAt": "2022-06-03T20:39:12.055Z",
          "updatedAt": "2022-06-03T20:39:12.055Z"
        }
      },
      {
        "id": 9,
        "userId": 3,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 3,
          "username": "user_0",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_0@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-1.png",
          "createdAt": "2022-06-03T20:39:12.052Z",
          "updatedAt": "2022-06-03T20:39:12.052Z"
        }
      },
      {
        "id": 10,
        "userId": 1,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 1,
          "username": "Jinyang.Li",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "test@gmail.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
          "createdAt": "2022-06-03T20:39:12.052Z",
          "updatedAt": "2022-06-03T20:39:12.052Z"
        }
      },
      {
        "id": 11,
        "userId": 33,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 33,
          "username": "user_30",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_30@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-11.png",
          "createdAt": "2022-06-03T20:39:12.056Z",
          "updatedAt": "2022-06-03T20:39:12.056Z"
        }
      },
      {
        "id": 12,
        "userId": 11,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 11,
          "username": "user_8",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_8@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-9.png",
          "createdAt": "2022-06-03T20:39:12.053Z",
          "updatedAt": "2022-06-03T20:39:12.053Z"
        }
      },
      {
        "id": 13,
        "userId": 37,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 37,
          "username": "user_34",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_34@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-15.png",
          "createdAt": "2022-06-03T20:39:12.056Z",
          "updatedAt": "2022-06-03T20:39:12.056Z"
        }
      },
      {
        "id": 14,
        "userId": 17,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 17,
          "username": "user_14",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_14@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-15.png",
          "createdAt": "2022-06-03T20:39:12.054Z",
          "updatedAt": "2022-06-03T20:39:12.054Z"
        }
      },
      {
        "id": 15,
        "userId": 5,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.257Z",
        "updatedAt": "2022-06-03T20:39:12.257Z",
        "user": {
          "id": 5,
          "username": "user_2",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_2@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-3.png",
          "createdAt": "2022-06-03T20:39:12.052Z",
          "updatedAt": "2022-06-03T20:39:12.052Z"
        }
      },
      {
        "id": 16,
        "userId": 1,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.257Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.258Z",
        "updatedAt": "2022-06-03T20:39:12.258Z",
        "user": {
          "id": 1,
          "username": "Jinyang.Li",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "test@gmail.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
          "createdAt": "2022-06-03T20:39:12.052Z",
          "updatedAt": "2022-06-03T20:39:12.052Z"
        }
      },
      {
        "id": 17,
        "userId": 49,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.258Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.258Z",
        "updatedAt": "2022-06-03T20:39:12.258Z",
        "user": {
          "id": 49,
          "username": "user_46",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_46@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-7.png",
          "createdAt": "2022-06-03T20:39:12.058Z",
          "updatedAt": "2022-06-03T20:39:12.058Z"
        }
      },
      {
        "id": 18,
        "userId": 11,
        "eventId": 1,
        "create_time": "2022-06-03T20:39:12.258Z",
        "comment": "Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don't block me out, thanks...",
        "createdAt": "2022-06-03T20:39:12.258Z",
        "updatedAt": "2022-06-03T20:39:12.258Z",
        "user": {
          "id": 11,
          "username": "user_8",
          "password": "df10ef8509dc176d733d59549e7dbfaf",
          "email": "user_8@example.com",
          "salt": "abc",
          "avatar": "https://coding.net/static/fruit_avatar/Fruit-9.png",
          "createdAt": "2022-06-03T20:39:12.053Z",
          "updatedAt": "2022-06-03T20:39:12.053Z"
        }
      }
    ]
  }
  yield createSuccessResp(resp);
}

export async function* GetEventDetailMock(...args: Parameters<typeof GetEventDetail>) {
  yield loading;
  await sleep();
  const resp: GetEventDetailResponseBody = {
    "event": {
      "id": 1,
      "name": "Activity Title Name Make it Longer May Longer than One Line",
      "creator_id": 17,
      "channel_id": 5,
      "begin_time": "2022-06-03T20:39:12.058Z",
      "end_time": "2022-06-04T20:39:12.058Z",
      "create_time": "2022-06-03T20:39:12.058Z",
      "update_time": "2022-06-03T20:39:12.058Z",
      "location": "Marina Bay Sands",
      "location_detail": "10 Bayfront Ave, S018956",
      "description": "[No longer than 300 chars] Vivamus sagittis, diam in lobortis, sapien arcu mattis erat, vel aliquet sem urna et risus. Ut feugiat sapien mi potenti. Maecenas et enim odio. Nullam massa metus, varius quis vehicula sed, pharetra mollis erat. In quis viverra velit. Vivamus placerat, est nec hendrerit varius, enim dui hendrerit magna, ut pulvinar nibh lorem vel lacus. Mauris a orci iaculis, hendrerit eros sed, gravida leo. In dictum mauris vel augue varius there is south north asim.",
      "createdAt": "2022-06-03T20:39:12.059Z",
      "updatedAt": "2022-06-03T20:39:12.059Z",
      "channel": {
        "id": 5,
        "name": "Travel",
        "createdAt": "2022-06-03T20:39:12.051Z",
        "updatedAt": "2022-06-03T20:39:12.051Z"
      },
      "creator": {
        "id": 17,
        "username": "user_14",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_14@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-15.png",
        "createdAt": "2022-06-03T20:39:12.054Z",
        "updatedAt": "2022-06-03T20:39:12.054Z"
      },
      "images": [
        "https://tse2-mm.cn.bing.net/th?id=OIP.w8XC0KPitDfMEeSv9P3GxgHaEt&w=248&h=160&c=7&o=5&dpr=2&pid=1.7",
        "https://tse2-mm.cn.bing.net/th?id=OIP.B7gjATIkLyifGdknxysjVwHaFj&w=222&h=167&c=7&o=5&dpr=2&pid=1.7",
        "https://tse2-mm.cn.bing.net/th?id=OIP.NI9vpiDmGzrQLPKq23e2_wHaFj&w=234&h=173&c=7&o=5&dpr=2&pid=1.7",
        "https://tse2-mm.cn.bing.net/th?id=OIP.rzUYVz0YoOqkmoehDQcKRgHaEo&w=295&h=181&c=7&o=5&dpr=2&pid=1.7",
        "https://tse2-mm.cn.bing.net/th?id=OIP.wTqIPNLDZ96_gPsHc-pplQHaFI&w=228&h=160&c=7&o=5&dpr=2&pid=1.7"
      ],
      "likes_count": 11,
      "goings_count": 11,
      "me_likes": false,
      "me_going": false
    }
  }
  yield createSuccessResp(resp);
}

export async function* GetEventParticipantsMock(...args: Parameters<typeof GetEventParticipants>) {
  yield loading;
  await sleep(300);
  const resp: GetEventParticipantsResponseBody = {
    "users": [
      {
        "id": 1,
        "username": "Jinyang.Li",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "test@gmail.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
        "createdAt": "2022-06-03T20:39:12.052Z",
        "updatedAt": "2022-06-03T20:39:12.052Z",
        "participation": {
          "id": 1,
          "userId": 1,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.254Z",
          "updatedAt": "2022-06-03T20:39:12.254Z"
        }
      },
      {
        "id": 2,
        "username": "rexskz",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "rex@rexskz.info",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-20.png",
        "createdAt": "2022-06-03T20:39:12.052Z",
        "updatedAt": "2022-06-03T20:39:12.052Z",
        "participation": {
          "id": 2,
          "userId": 2,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.254Z",
          "updatedAt": "2022-06-03T20:39:12.254Z"
        }
      },
      {
        "id": 4,
        "username": "user_1",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_1@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-2.png",
        "createdAt": "2022-06-03T20:39:12.052Z",
        "updatedAt": "2022-06-03T20:39:12.052Z",
        "participation": {
          "id": 4,
          "userId": 4,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.255Z",
          "updatedAt": "2022-06-03T20:39:12.255Z"
        }
      },
      {
        "id": 6,
        "username": "user_3",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_3@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-4.png",
        "createdAt": "2022-06-03T20:39:12.053Z",
        "updatedAt": "2022-06-03T20:39:12.053Z",
        "participation": {
          "id": 6,
          "userId": 6,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.255Z",
          "updatedAt": "2022-06-03T20:39:12.255Z"
        }
      },
      {
        "id": 8,
        "username": "user_5",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_5@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-6.png",
        "createdAt": "2022-06-03T20:39:12.053Z",
        "updatedAt": "2022-06-03T20:39:12.053Z",
        "participation": {
          "id": 8,
          "userId": 8,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.255Z",
          "updatedAt": "2022-06-03T20:39:12.255Z"
        }
      },
      {
        "id": 10,
        "username": "user_7",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_7@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-8.png",
        "createdAt": "2022-06-03T20:39:12.053Z",
        "updatedAt": "2022-06-03T20:39:12.053Z",
        "participation": {
          "id": 10,
          "userId": 10,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      },
      {
        "id": 12,
        "username": "user_9",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_9@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-10.png",
        "createdAt": "2022-06-03T20:39:12.053Z",
        "updatedAt": "2022-06-03T20:39:12.053Z",
        "participation": {
          "id": 12,
          "userId": 12,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      },
      {
        "id": 14,
        "username": "user_11",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_11@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-12.png",
        "createdAt": "2022-06-03T20:39:12.054Z",
        "updatedAt": "2022-06-03T20:39:12.054Z",
        "participation": {
          "id": 14,
          "userId": 14,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      },
      {
        "id": 16,
        "username": "user_13",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_13@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-14.png",
        "createdAt": "2022-06-03T20:39:12.054Z",
        "updatedAt": "2022-06-03T20:39:12.054Z",
        "participation": {
          "id": 16,
          "userId": 16,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      },
      {
        "id": 18,
        "username": "user_15",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_15@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-16.png",
        "createdAt": "2022-06-03T20:39:12.054Z",
        "updatedAt": "2022-06-03T20:39:12.054Z",
        "participation": {
          "id": 18,
          "userId": 18,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      },
      {
        "id": 20,
        "username": "user_17",
        "password": "df10ef8509dc176d733d59549e7dbfaf",
        "email": "user_17@example.com",
        "salt": "abc",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-18.png",
        "createdAt": "2022-06-03T20:39:12.054Z",
        "updatedAt": "2022-06-03T20:39:12.054Z",
        "participation": {
          "id": 20,
          "userId": 20,
          "eventId": 1,
          "createdAt": "2022-06-03T20:39:12.256Z",
          "updatedAt": "2022-06-03T20:39:12.256Z"
        }
      }
    ]
  }
  yield createSuccessResp(resp);
}

export async function* GetEventLikesMock(...args: Parameters<typeof GetEventLikes>) {
  yield loading;
  const resp: GetEventLikesResponseBody = {
    "hasMore": true,
    "users": [
      {
        "id": 1,
        "username": "Jinyang.Li",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png"
      },
      {
        "id": 2,
        "username": "rexskz",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-20.png"
      },
      {
        "id": 5,
        "username": "user_2",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-3.png"
      },
      {
        "id": 8,
        "username": "user_5",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-6.png"
      },
      {
        "id": 11,
        "username": "user_8",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-9.png"
      },
      {
        "id": 14,
        "username": "user_11",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-12.png"
      },
      {
        "id": 17,
        "username": "user_14",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-15.png"
      },
      {
        "id": 20,
        "username": "user_17",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-18.png"
      },
      {
        "id": 23,
        "username": "user_20",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-1.png"
      },
      {
        "id": 26,
        "username": "user_23",
        "avatar": "https://coding.net/static/fruit_avatar/Fruit-4.png"
      }
    ]
  };
  yield createSuccessResp(resp);
}
