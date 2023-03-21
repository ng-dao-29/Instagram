import {ListItem} from "@mui/material";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import {useState} from "react";
import "../../App.css";
import ChatBody from "./childComponent/ChatBody";
import AddChat from "./childComponent/FindCreateChat";
import ListChat from "./childComponent/ListChat";

export default function ViewChat({socket}) {
    const [presentRoom, setPresentRoom] = useState(null)
    const [open, setOpen] = React.useState(false);

    const handleClickListItem = () => {
        setOpen(true);
    };

    const updatePresentRoom = (idChat) => {
        setPresentRoom(idChat)
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <div className="viewChat">
                    <div className="listChat">
                        <div className="listChat-header">
                            <div className="chat-title"><b>chat trực tuyến</b></div>
                            <div className="add-chat">
                                <ListItem
                                    button
                                    onClick={handleClickListItem}
                                >
                                    <svg color="#262626"
                                         fill="#262626"
                                         height="24"
                                         role="img"
                                         viewBox="0 0 24 24"
                                         width="24">
                                        <path
                                            d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"></path>
                                        <path
                                            d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"></path>
                                        <line fill="none"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              x1="16.848"
                                              x2="20.076"
                                              y1="3.924"
                                              y2="7.153"></line>
                                    </svg>
                                </ListItem>
                                <AddChat
                                    open={open}
                                    onClose={handleClose}
                                    chatNow={updatePresentRoom}
                                />
                            </div>
                        </div>
                        <div className="listChat-body">
                            <ListChat
                                socket={socket}
                                open={open}
                                chatNow={updatePresentRoom}
                            />
                        </div>
                    </div>
                    <div className="chat">
                        <ChatBody
                            socket={socket}
                            onClose={handleClickListItem}
                            chatId={presentRoom}
                        />
                    </div>
                </div>
            </Container>
            <CssBaseline/>
        </React.Fragment>
    )
}