import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FOLLOW_USER_RESET } from "../../../constants/userConstants";
import { clearErrors, getSuggestedUsers } from "../../../service/userAction";
import SkeletonUserItem from "../../Layouts/SkeletonUserList";
import UserListItem from "./UserListItem";

const Sidebar = () => {
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.user);

    const {error, users, loading} = useSelector((state) => state.allUsers);
    const {
        error: followError,
        success,
        message,
    } = useSelector((state) => state.followUser);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        dispatch(getSuggestedUsers());
    }, [dispatch, error]);

    useEffect(() => {
        if (followError) {
            toast.error(followError);
            dispatch(clearErrors());
        }
        if (success) {
            toast.success(message);

            dispatch({type: FOLLOW_USER_RESET});
        }
    }, [success, followError, dispatch, message]);

    return (
        <div
            className="fixed lg:right-32 xl:right-56 w-3/12 h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 -z-1">
            <div className="ml-10 flex flex-col p-2">
                <div className="flex justify-between items-center">
                    <div className="flex flex-auto space-x-4 items-center">
                        <Link to={`/${user.username}`}>
                            <img
                                draggable="false"
                                className="w-14 h-14 rounded-full object-cover"
                                src={user.profile_picture}
                                alt={user.name}
                            />
                        </Link>
                        <div className="flex flex-col">
                            <Link
                                to={`/${user.username}`}
                                className="text-black text-sm font-semibold"
                            >
                                {user.username}
                            </Link>
                            <span className="text-gray-400 text-sm">{user.name}</span>
                        </div>
                    </div>
                    <span className="text-blue-500 text-xs font-semibold cursor-pointer">
            Switch
          </span>
                </div>

                <div className="flex justify-between items-center mt-5">
                    <p className="font-semibold text-gray-500 text-sm">
                        Suggestions For You
                    </p>
                    <span className="text-black text-xs font-semibold cursor-pointer">
            See All
          </span>
                </div>

                <div className="flex flex-col flex-auto mt-3 space-y-3.5">
                    {loading
                        ? Array(5)
                            .fill("")
                            .map((el, i) => <SkeletonUserItem key={i}/>)
                        : users?.map((user, index) => (
                            <UserListItem {...user} key={index}/>
                        ))}
                </div>

                <div className="flex flex-col mt-8 space-y-6 text-xs text-gray-400">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                            {[
                                "About",
                                "Help",
                                "Press",
                                "API",
                                "Jobs",
                                "Privacy",
                                "Terms",
                                "Locations",
                            ].map((el, i) => (
                                <a href="/#" key={i}>
                                    {el}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center space-x-1.5">
                            {["Top Accounts", "Hashtags", "Language"].map((el, i) => (
                                <a href="/#" key={i}>
                                    {el}
                                </a>
                            ))}
                        </div>
                    </div>
                    <span>&copy; {new Date().getFullYear()} INSTAGRAM FROM META</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
