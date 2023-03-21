import axios from "../api/axios";

import {
  NEW_POST_REQUEST,
  NEW_POST_SUCCESS,
  NEW_POST_FAIL,
  CLEAR_ERRORS,
  POST_FOLLOWING_REQUEST,
  POST_FOLLOWING_SUCCESS,
  POST_FOLLOWING_FAIL,
  LIKE_UNLIKE_POST_REQUEST,
  LIKE_UNLIKE_POST_SUCCESS,
  LIKE_UNLIKE_POST_FAIL,
  NEW_COMMENT_REQUEST,
  NEW_COMMENT_SUCCESS,
  NEW_COMMENT_FAIL,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
} from "../constants/postConstants";

export const addNewPost = (postData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_POST_REQUEST });
    const { data } = await axios.post("/api/v1/post/new", postData);
    dispatch({
      type: NEW_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_POST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getPostsOfFollowing =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: POST_FOLLOWING_REQUEST });

      setTimeout(async () => {
        const { data } = await axios.get(`/api/v1/posts?page=${page}`);
        dispatch({
          type: POST_FOLLOWING_SUCCESS,
          payload: data,
        });
      }, 300);
    } catch (error) {
      dispatch({
        type: POST_FOLLOWING_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const likePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: LIKE_UNLIKE_POST_REQUEST });
    const { data } = await axios.get(`/api/v1/post/${postId}`);

    dispatch({
      type: LIKE_UNLIKE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIKE_UNLIKE_POST_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Add Comment
export const addComment = (postId, comment) => async (dispatch) => {
  try {
    dispatch({ type: NEW_COMMENT_REQUEST });
    const config = { header: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      `/api/v1/post/comment/${postId}`,
      { comment },
      config
    );
    dispatch({
      type: NEW_COMMENT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_COMMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const removeComment = (postId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COMMENT_REQUEST });
    await axios.delete(`/api/v1/post/comment/${postId}`);
    dispatch({ type: DELETE_COMMENT_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_COMMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};


export const deletePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_POST_REQUEST });
    const { data } = await axios.delete(`/api/v1/post/${postId}`);

    dispatch({
      type: DELETE_POST_SUCCESS,
      payload: {message : data.success, postId},
    });
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
