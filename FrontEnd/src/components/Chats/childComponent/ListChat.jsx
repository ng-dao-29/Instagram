import {ListItem} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import moment from "moment/moment";
import * as React from "react";
import {useEffect, useState} from "react";
import "../../../App.css";
import axios from "../../../api/axios";
import StyledBadgeOffline from "./ activeStatus/statusOffline";
import StyledBadgeOnline from "./ activeStatus/statusOnline";

export default function ListChat(props) {
    let {open, chatNow, socket} = props;
    let [listChat, setListChat] = useState([]);

    useEffect(() => {
        axios
            .get("/api/v1/chat/list")
            .then((response) => {
                let listRoom = response.data.listChat;
                setListChat(listRoom);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [open]);

    useEffect(() => {
        socket?.on("get-active-status", (idUser) => {
            axios
                .get("/api/v1/chat/list")
                .then((response) => {
                    let listRoom = response.data.listChat;
                    setListChat(listRoom);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        });
    }, [socket]);

    return (
        <>
            {listChat.length > 0 && (
                <List
                    sx={{width: "100%", maxWidth: 400, bgcolor: "background.paper"}}
                >
                    {listChat.map((userChat) => (
                        <ListItemButton onClick={() => chatNow(userChat.id)}>
                            {userChat.online === "true" ? (
                                <ListItem key={userChat.id}>
                                    <ListItemAvatar>
                                        <StyledBadgeOnline
                                            overlap="circular"
                                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                            variant="dot"
                                        >
                                            <Avatar alt="avatar" src={userChat.avatar[0]}/>
                                        </StyledBadgeOnline>
                                    </ListItemAvatar>
                                    <ListItemText primary={userChat.roomName}/>
                                </ListItem>
                            ) : (
                                <ListItem key={userChat.id}>
                                    <ListItemAvatar>
                                        <StyledBadgeOffline
                                            overlap="circular"
                                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                            variant="dot"
                                        >
                                            <Avatar alt="avatar" src={userChat.avatar[0]}/>
                                        </StyledBadgeOffline>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={userChat.roomName}
                                        secondary={moment(userChat.last_activity).fromNow()}
                                    />
                                </ListItem>
                            )}
                        </ListItemButton>
                    ))}
                </List>
            )}
        </>
    );
}
