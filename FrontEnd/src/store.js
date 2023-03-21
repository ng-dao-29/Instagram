import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {
    userReducer,
    allUsersReducer,
    followUserReducer,
    userDetailsReducer,
    profileReducer,
    forgotPasswordReducer,
    notificationReducer,
} from "./reducers/userReducer";
import {
    postReducer,
    postOfFollowingReduct,
    likePostReducer,
    newCommentReducer,
    deletePostReducer,
    deleteCommentReducer,
} from "./reducers/postReducer";

const reducer = combineReducers({
    user: userReducer,
    newPost: postReducer,
    forgotPassword: forgotPasswordReducer,
    userDetails: userDetailsReducer,
    allUsers: allUsersReducer,
    profile: profileReducer,
    followUser: followUserReducer,
    postOfFollowing: postOfFollowingReduct,
    likePost: likePostReducer,
    newComment: newCommentReducer,
    deletePost: deletePostReducer,
    deleteComment: deleteCommentReducer,
    notification: notificationReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
