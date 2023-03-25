import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text?: string;
};

const ModalWindow = ({ onChange, text }: Props) => {
  const textArea = useRef<HTMLTextAreaElement>(null!);

  useEffect(() => {
    textArea.current.style.height = "0px";
    const scrollHeight = textArea.current.scrollHeight;
    textArea.current.style.height = scrollHeight + "px";
  }, [text]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen((prevstate) => !prevstate);
  };

  return (
    <div style={{ position: "fixed", bottom: "0", right: "50px" }}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style={
          open
            ? {
                right: "0",
                width: "270px",
                background: "#91c5fd",
                color: "white",
              }
            : {
                background: "#91c5fd",
                color: "white",
                textTransform: "lowercase",
              }
        }
      >
        {open ? "Will be send to author" : "Explain problems ..."}
      </Button>
      <div
        style={
          open
            ? {
                opacity: 1,
                pointerEvents: "all",
              }
            : {
                opacity: 0,
                pointerEvents: "none",
                position: "absolute",
                transition: "all 0.9s ease-in",
              }
        }
      >
        <textarea
          ref={textArea}
          onChange={onChange}
          value={text}
          style={{
            minHeight: "200px",
            width: "270px",
            resize: "none",
            fontSize: "1.05rem",
            padding: "10px",
            overflow: "hidden",
            border: "1px solid #E0E0E0",
            background: "white",
            outlineColor: "grey",
          }}
        />
      </div>
    </div>
  );
};
export default ModalWindow;
