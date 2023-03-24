import { useEffect, useState, MouseEvent } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { fetchPosts, fetchRemovePost } from "../../redux/slices/posts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate, Navigate } from "react-router-dom";
import ModalConfirmWindow from "../../components/ModalConfirmWindow/ModalConfirmWindow";
import axios from "../../axios";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { Button } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "PostID", width: 250 },
  {
    field: "postTitle",
    headerName: "Post title",
    width: 250,
  },
  {
    field: "userId",
    headerName: "UserID",
    width: 200,
  },
  {
    field: "userName",
    headerName: "User",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    type: "date",
    width: 150,
    valueGetter: (params: GridValueGetterParams) => {
      const dateString = params.row.createdAt;
      const date = new Date(dateString);
      return date;
    },
  },
];

interface IPost {
  _id: string;
  comment: string;
  createdAt: string;
  isVerifyEdit: boolean;
  tags: string[];
  text: string;
  title: string;
  updatedAt: string;
  user: { _id: string; fullName: string };
}

const Posts = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [action, setAction] = useState("");

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const isAuth = useAppSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  const postsData = useAppSelector((state) => state.posts);

  const { posts } = postsData;

  const isPostsLoading = posts.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const rows = [...posts.items].map((post: IPost) => {
    const newPost = {
      id: "",
      postTitle: "",
      userId: "",
      userName: "",
      createdAt: 0,
    };

    newPost.id = post._id;
    newPost.postTitle = post.title;
    newPost.userId = post.user._id;
    newPost.userName = post.user.fullName;
    newPost.createdAt = Date.parse(post.createdAt);

    return newPost;
  });

  const iconsStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: "50px",
    justifyContent: "flex-end",
    paddingRight: "20px",
    background: "#E3EEFA",
  };

  const iconStyle = {
    cursor: "pointer",
    fill: "grey",
    "&:hover": {
      fill: "#1976D2",
    },
  };

  const handleSelectionModelChange = (selectedIds: GridRowSelectionModel) => {
    setSelectedRows(selectedIds as string[]);
  };

  const handleDelete = () => {
    setAction("");
    setOpen(false);
    if (selectedRows.length === 1) {
      dispatch(fetchRemovePost(selectedRows[0]));
    } else if (selectedRows.length > 1) {
      selectedRows.forEach((item) => dispatch(fetchRemovePost(item)));
    }
  };

  const handleEdit = () => {
    return navigate(`/edit-post/${selectedRows[0]}`);
  };

  const handleSync = async () => {
    setAction("");
    setOpen(false);
    const fieldsList: {
      title: string;
      imageUrl: string;
      tags: Array<string>;
      text: string;
      userId: string;
    }[] = [];
    selectedRows.forEach((item) => {
      const [post] = posts.items.filter((post: IPost) => post._id === item);
      const { title, imageUrl, tags, text, user } = post;
      const fields = {
        title,
        imageUrl,
        tags,
        text,
        userId: user["_id"],
      };
      fieldsList.push(fields);
      dispatch(fetchRemovePost(item));
    });
    await Promise.all(fieldsList.map((fields) => axios.post("/posts", fields)));
  };

  const handleClick = (action: string) => {
    setAction(action);
    setOpen(true);
  };

  const handleLogOut = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    navigate("/auth");
  };

  if (!isAuth && !window.localStorage.getItem("token")) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" onClick={handleLogOut}>
          Log out
        </Button>
      </div>
      {isPostsLoading ? (
        "Loading..."
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              height: 60,
              display: "flex",
              alignItems: "center",
              borderBottom: "4px solid #E0E0E0",
              position: "relative",
              bottom: "-3px",
              borderTop: "1px solid #E0E0E0",
              borderLeft: "1px solid #E0E0E0",
              borderRight: "1px solid #E0E0E0",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            {selectedRows.length === 0 && (
              <p
                style={{
                  marginLeft: "20px",
                  fontSize: "1.4rem",
                  fontFamily: "Roboto",
                  fontWeight: "600",
                }}
              >
                POSTS
              </p>
            )}
            {selectedRows.length > 0 && (
              <>
                {selectedRows.length > 1 && (
                  <div style={iconsStyle}>
                    <DeleteIcon
                      onClick={() => handleClick("delete")}
                      sx={iconStyle}
                    />
                    <SyncIcon
                      onClick={() => handleClick("synchronize")}
                      sx={iconStyle}
                    />
                  </div>
                )}
                {selectedRows.length === 1 && (
                  <div style={iconsStyle}>
                    <DeleteIcon
                      onClick={() => handleClick("delete")}
                      sx={iconStyle}
                    />
                    <EditIcon onClick={handleEdit} sx={iconStyle} />
                    <SyncIcon
                      onClick={() => handleClick("synchronize")}
                      sx={iconStyle}
                    />
                  </div>
                )}
              </>
            )}
            <ModalConfirmWindow
              open={open}
              setOpen={setOpen}
              verify={selectedRows.length === 1 ? selectedRows[0] : action}
              children={
                selectedRows.length === 1 ? (
                  <div>
                    If you want to {action} post write,{" "}
                    <span style={{ fontWeight: "700" }}>
                      '{selectedRows[0]}'
                    </span>{" "}
                    on field below:
                  </div>
                ) : (
                  <div>
                    Do you want to {action} all selected write,{" "}
                    <span style={{ fontWeight: "700" }}>'{action}'</span> on
                    field below:
                  </div>
                )
              }
              handleSubmit={
                action === "synchronize"
                  ? handleSync
                  : action === "delete"
                  ? handleDelete
                  : () => console.log("empty")
              }
            />
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            onRowSelectionModelChange={handleSelectionModelChange}
            rowSelectionModel={selectedRows}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </>
  );
};

export default Posts;
