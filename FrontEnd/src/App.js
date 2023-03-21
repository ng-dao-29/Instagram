import {Suspense, lazy, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import io from "socket.io-client";
import axios from "./api/axios";

import {loadUser, notificationUser} from "./service/userAction";

import PrivateRoute from "./Router/PrivateRouter";
import ViewChat from "./components/Chats/ViewChat";
import NotFound from "./components/Errors/NotFound";
import Header from "./components/NavBar/Header";
import ForgotPassword from "./components/User/ForgotPassword";
import UpdatePassword from "./components/User/Update/UpdatePassword";

import Profile from "./components/User/Profile";

const SignUp = lazy(() => import("./components/User/SignUp"));
const Login = lazy(() => import("./components/User/Login"));
const Home = lazy(() => import("./components/Home/Home"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const UpdateProfile = lazy(() =>
    import("./components/User/Update/UpdateProfile")
);
const Update = lazy(() => import("./components/User/Update/Update"));
const setHeaderApi = async () => {
    await (axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("token"));
};

function App() {
    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector((state) => state.user);
    const [socket, setSocket] = useState(null);

    let jwt = localStorage.getItem("token");
    if (jwt) {
        setHeaderApi();
    }

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    useEffect(() => {
        setSocket(io("http://localhost:8080"));
    }, []);
    useEffect(() => {
        dispatch(notificationUser());
    }, [dispatch, socket]);
    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />

            {isAuthenticated && <Header socket={socket}/>}
            <Suspense>
                <Routes>
                    <Route path="/register" element={<SignUp/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/password/forgot" element={<ForgotPassword/>}/>
                    <Route path="/password/reset/:token" element={<ResetPassword/>}/>

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home socket={socket}/>
                            </PrivateRoute>
                        }
                    />
                    <Route path="/direct/inbox" element={<ViewChat socket={socket}/>}/>
                    <Route
                        path="/:username"
                        element={
                            <PrivateRoute>
                                <Profile/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/accounts/edit"
                        element={
                            <PrivateRoute>
                                <Update>
                                    <UpdateProfile/>
                                </Update>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/accounts/password/change"
                        element={
                            <PrivateRoute>
                                <Update activeTab={1}>
                                    <UpdatePassword/>
                                </Update>
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
