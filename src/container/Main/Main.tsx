import { Route, Routes } from "react-router-dom";
import Auth from "../../pages/Auth/Auth";
import { PostEdit } from "../../pages/PostEdit/PostEdit";
import Posts from "../../pages/Posts/Posts";

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/edit-post/:id" element={<PostEdit />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};
export default Main;
