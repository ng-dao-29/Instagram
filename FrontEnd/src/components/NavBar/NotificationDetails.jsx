import { ClickAwayListener, Divider, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "../../api/axios";
import { notificationUser } from "../../service/userAction";
function NotificationDetails({ setNotification, socket }) {
  const { notification } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("getNotification", (data) => {
      dispatch(notificationUser(data));
    });
  }, [dispatch, socket]);

    useEffect(() => {
        dispatch(notificationUser());
    }, [dispatch]);

    const chooseRead = async (id) => {
        await axios.get(`api/v1/notification/setup/${id}`,).catch((error) => {
            console.log(error);
        })
        dispatch(notificationUser(true));
    }

    const displayNotification = ({senderName, type, message, userSend, id, read}) => {
        if (senderName && type) {
            return (
                <span
                    className="p-1"
                    key={senderName}
                >{`${senderName.username} ${type} your post.`}</span>
            );
        } else {
            return (
                <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    {!read ? (
                        <ListItemButton alignItems="flex-start"
                                        style={{backgroundColor: "coral"}}
                                        onClick={() => chooseRead(id)}
                                        key={id}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={userSend.profile_picture}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={userSend.username}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {message}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItemButton>
                    ) : (
                        <ListItemButton alignItems="flex-start"
                                        onClick={() => chooseRead(id)}
                                        key={id}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={userSend.profile_picture}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={userSend.username}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {message}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItemButton>
                    )}
                    <Divider variant="inset" component="li"/>
                </List>
            )
        }
    };
    return (
        <ClickAwayListener onClickAway={() => setNotification(false)}>
            <div className="absolute w-80 bg-white rounded  drop-shadow top-14 right-0 md:right-72 md:top-14 border">
                <div className="absolute right-14 -top-2 rotate-45 h-4 w-4 bg-white rounded-sm border-l border-t"></div>

                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex flex-col w-full h-full overflow-hidden"
                         style={{"minHeight": "300px", "maxHeight": "350px"}}>
                        <ScrollToBottom className="flex flex-col w-full h-full overflow-hidden">
                            {notification.length > 0 ? (
                                notification?.map((n) => displayNotification(n))
                            ) : (
                                <span className="flex justify-center h-full items-center">
                Không có thông báo nào
              </span>
                            )}
                        </ScrollToBottom>
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    );
}
export default NotificationDetails;
