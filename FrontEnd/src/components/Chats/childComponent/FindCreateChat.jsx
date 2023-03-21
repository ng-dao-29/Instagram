import { AccountCircle } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useEffect, useState } from "react";
import "../../../App.css";
import axios from "../../../api/axios";

export default function AddChat(props) {
  const [checked, setChecked] = useState([]);
  const { onClose, open, chatNow } = props;
  const [listUsers, setListUser] = useState([]);
  const radioGroupRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (term) => {
    const { data } = await axios.get(`/api/v1/users?keyword=${term}`);
    setListUser(data.users);
  };

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      fetchUsers(searchTerm);
    }
    return () => {
      setListUser([]);
    };
  }, [searchTerm]);

  const handleToggle = (user) => () => {
    const currentIndex = checked.indexOf(user);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    if (checked.length > 0) {
      axios
        .post("/api/v1/chat/new", {
          userIdChat: checked,
        })
        .then((res) => {
          let idChat = res.data.dataChat.id;
          chatNow(idChat);
          onClose();
        });
    }
  };

  useEffect(() => {
    if (!open) {
      setChecked([]);
      setListUser([]);
    }
  }, [open]);

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: 400, maxHeight: 500 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
    >
      <DialogTitle style={{ height: 50 }}>
        <button autoFocus onClick={handleCancel} style={{ float: "left" }}>
          <svg
            className="_ab6-"
            color="#262626"
            fill="#262626"
            height="18"
            role="img"
            viewBox="0 0 24 24"
            width="18"
          >
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></polyline>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            ></line>
          </svg>
        </button>
        <div className="add-chat-title">
          <p>tin nhắn mới</p>
        </div>
        <button onClick={handleOk} style={{ float: "right", color: "#27c4f5" }}>
          tiếp
        </button>
      </DialogTitle>
      <div style={{ height: 50 }}>
        <div style={{ float: "left" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <AccountCircle
              sx={{ color: "action.active", mr: 1, my: 0.5 }}
              style={{ margin: 5 }}
            />
            <TextField
              onChange={(e) => setSearchTerm(e.target.value)}
              id="input-with-sx"
              label="tìm kiếm"
              variant="standard"
              style={{ width: 350 }}
            />
          </Box>
        </div>
      </div>
      <DialogContent dividers style={{ height: 400 }}>
        <List
          dense
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {listUsers.map((user, index) => {
            const labelId = `checkbox-list-secondary-label-${user.id}`;
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(user.id)}
                    checked={checked.indexOf(user.id) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${user.name}`}
                      src={`${user.profile_picture}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={` ${user.username}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
