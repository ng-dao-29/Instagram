import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  LIKE_UNLIKE_POST_RESET,
  NEW_COMMENT_RESET,
} from "../../constants/postConstants";
import { clearErrors, getPostsOfFollowing } from "../../service/postAction";
import UsersDialog from "../Layouts/UsersDialog";
import PostItem from "./PostItem";
import StoriesContainer from "./StoriesContainer";

import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonPost from "../Layouts/SkeletonPost";
import SpinLoader from "../Layouts/SpinLoader";

const PostsContainer = ({socket}) => {
  const dispatch = useDispatch();

  const [usersList, setUsersList] = useState([]);
  const [usersDialog, setUsersDialog] = useState(false);
  const [page, setPage] = useState(2);

  const { loading, error, posts, totalPosts } = useSelector(
    (state) => state.postOfFollowing
  );
  const {
    error: likeError,
    message,
    success,
  } = useSelector((state) => state.likePost);
  const { error: commentError, success: commentSuccess } = useSelector(
    (state) => state.newComment
  );

  const handleClose = () => setUsersDialog(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getPostsOfFollowing());
  }, [dispatch, error]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success(message);
      dispatch({ type: LIKE_UNLIKE_POST_RESET });
    }
    if (commentError) {
      toast.error(commentError);
      dispatch(clearErrors());
    }
    if (commentSuccess) {
      toast.success("Comment Added");
      dispatch({ type: NEW_COMMENT_RESET });
    }
  }, [dispatch, success, likeError, message, commentError, commentSuccess]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    dispatch(getPostsOfFollowing(page));
  };

  return (
    <>
      <div className="flex flex-col w-full lg:w-2/3 sm:mt-6 sm:px-8 mb-8">
        <StoriesContainer />
        {loading &&
          Array(5)
            .fill("")
            .map((el, i) => <SkeletonPost key={i} />)}
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={posts.length !== totalPosts}
          loader={<SpinLoader />}
        >
          <div className="w-full h-full mt-1 sm:mt-6 flex flex-col space-y-4">
            {posts?.map((post, index) => (
              
              <PostItem
                key={index}
                {...post}
                socket={socket}
                setUsersDialog={setUsersDialog}
                setUsersList={setUsersList}
              />
            ))}
          </div>
        </InfiniteScroll>

        <UsersDialog
          title="Likes"
          open={usersDialog}
          onClose={handleClose}
          usersList={usersList}
        />
      </div>
    </>
  );
};

export default PostsContainer;
