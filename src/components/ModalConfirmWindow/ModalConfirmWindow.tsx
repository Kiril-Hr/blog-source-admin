import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

type Props = {
  handleSubmit: () => void;
  setOpen: (value: boolean) => void;
  open: boolean;
  children?: React.ReactNode;
  verify: string;
};

const ModalConfirmWindow = ({
  handleSubmit,
  open,
  setOpen,
  children,
  verify,
}: Props) => {
  const [textAreaText, setTextAreaText] = useState("");

  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaText(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm window</DialogTitle>
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
            variant="standard"
            value={textAreaText}
            onChange={onChangeTextArea}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              setTextAreaText("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              setTextAreaText("");
            }}
            disabled={textAreaText === verify ? false : true}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalConfirmWindow;
