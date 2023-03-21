import {
  NEW_POST_REQUEST,
  NEW_POST_SUCCESS,
  NEW_POST_RESET,
  NEW_POST_FAIL,
  CLEAR_ERRORS,
  POST_FOLLOWING_REQUEST,
  POST_FOLLOWING_SUCCESS,
  POST_FOLLOWING_RESET,
  RESET_FOLLOWING_SUCCESS,
  POST_FOLLOWING_FAIL,
  LIKE_UNLIKE_POST_REQUEST,
  LIKE_UNLIKE_POST_SUCCESS,
  LIKE_UNLIKE_POST_FAIL,
  LIKE_UNLIKE_POST_RESET,
  NEW_COMMENT_REQUEST,
  NEW_COMMENT_SUCCESS,
  NEW_COMMENT_RESET,
  NEW_COMMENT_FAIL,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  DELETE_POST_RESET,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_RESET,
  DELETE_COMMENT_FAIL,
} from "../constants/postConstants";

export const postReducer = (state = { post: {} }, { type, payload }) => {
  switch (type) {
    case NEW_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_POST_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        post: payload.post,
      };
    case NEW_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_POST_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const postOfFollowingReduct = (
  state = { posts: [] },
  { type, payload }
) => {
  switch (type) {
    case POST_FOLLOWING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case RESET_FOLLOWING_SUCCESS:
      return {
        posts: [],
      };
    case POST_FOLLOWING_SUCCESS:
      return {
        loading: false,
        posts: [...state.posts, ...payload.posts],
        totalPosts: payload.totalPosts,
      };
    case POST_FOLLOWING_RESET:
      return {
        ...state,
        posts: [],
        totalPosts: 0,
      };
    case POST_FOLLOWING_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const likePostReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LIKE_UNLIKE_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIKE_UNLIKE_POST_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        message: payload.message,
      };
    case LIKE_UNLIKE_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case LIKE_UNLIKE_POST_RESET:
      return {
        ...state,
        success: false,
        message: null,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const newCommentReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case NEW_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_COMMENT_SUCCESS:
      return {
        loading: false,
        success: payload,
      };
    case NEW_COMMENT_RESET:
      return {
        ...state,
        success: false,
      };
    case NEW_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const deletePostReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case DELETE_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_POST_SUCCESS:
      return {
        loading: false,
        success: payload,
      };
    case DELETE_POST_RESET:
      return {
        ...state,
        success: false,
      };
    case DELETE_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const deleteCommentReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case DELETE_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_COMMENT_SUCCESS:
      return {
        loading: false,
        success: payload,
      };
    case DELETE_COMMENT_RESET:
      return {
        ...state,
        success: false,
      };
    case DELETE_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
