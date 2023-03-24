import { useCallback, useMemo, useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import SimpleMDE, { SimpleMDEReactProps } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import classes from "./PostEdit.module.css";
import axios from "../../axios";
import { BASEURL } from "../../utils/URL";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import { useAppSelector } from "../../hooks/hooks";
import { selectIsAuth } from "../../redux/slices/auth";

interface IData {
  text: string;
  title: string;
  tags: string;
  imageUrl: string;
  comment: string;
}

export const PostEdit = () => {
  const isAuth = useAppSelector(selectIsAuth);

  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<IData>({
    text: "",
    title: "",
    tags: "",
    imageUrl: "",
    comment: "",
  });

  const onChange = useCallback((text: string) => {
    setData((prevstate: any) => ({
      ...prevstate,
      text: text,
    }));
  }, []);

  const onChangeModal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData((prevstate) => ({
      ...prevstate,
      comment: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      const fields: {
        title: string;
        tags: Array<string>;
        text: string;
        imageUrl: string;
        isVerifyEdit: boolean;
        comment: string;
      } = {
        title: data.title,
        tags: data.tags.trim().split(","),
        text: data.text,
        imageUrl: data.imageUrl,
        isVerifyEdit: true,
        comment: data.comment,
      };

      await axios.patch(`/posts/check/edit/${id}`, fields);

      navigate("/");
    } catch (err) {
      console.warn(err);
      alert("Failed to create article");
    }
  };

  const options: SimpleMDEReactProps = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "500px",
      autofocus: true,
      placeholder: "Write text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  useEffect(() => {
    if (id) {
      axios.get(`/posts/check/${id}`).then(({ data }: any) => {
        setData({
          text: data.text,
          title: data.title,
          tags: data.tags,
          imageUrl: data.imageUrl,
          comment: data.comment,
        });
        console.log(data);
      });
    }
  }, []);

  if (!isAuth && !window.localStorage.getItem("token")) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className={classes.textEditor}>
      {data.imageUrl && (
        <>
          <img
            className={classes.image}
            src={`${BASEURL}${data.imageUrl}`}
            alt={`${data.title} image`}
          />
        </>
      )}
      <br />
      <br />
      <input
        className={classes.title}
        placeholder="Title of article..."
        value={data.title}
        onChange={(e) =>
          setData((prevstate: IData) => ({
            ...prevstate,
            title: e.target.value,
          }))
        }
      />
      <div className={classes.tags}>
        <input
          placeholder="Tags"
          value={data.tags}
          onChange={(e) =>
            setData((prevstate: IData) => ({
              ...prevstate,
              tags: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <SimpleMDE
          className={classes.editor}
          value={data.text}
          onChange={onChange}
          options={options}
        />
      </div>
      <div className={classes.buttons}>
        <button
          className={classes.button}
          onClick={onSubmit}
          style={
            data.comment.length === 0
              ? { pointerEvents: "none", opacity: "0.5" }
              : {}
          }
        >
          Edit
        </button>
        <Link to="/">
          <button className={classes.button}>Decline</button>
        </Link>
      </div>
      <ModalWindow onChange={onChangeModal} text={data.comment} />
    </div>
  );
};
