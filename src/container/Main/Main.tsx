import { Route, Routes } from "react-router-dom";
import { PostEdit } from "../../pages/PostEdit/PostEdit";
import Posts from "../../pages/Posts/Posts";

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/edit-post/:id" element={<PostEdit />} />
    </Routes>
  );
};
export default Main;
