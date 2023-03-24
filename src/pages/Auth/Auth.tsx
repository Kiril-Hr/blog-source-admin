import { MouseEvent, useState, ChangeEvent } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Input,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

interface IData {
  password: string;
  email: string;
}

const Auth = () => {
  const [dataUser, setData] = useState<IData>({
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const isAuth = useAppSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>, field: keyof IData) =>
    setData((prevstate: IData) => ({
      ...prevstate,
      [field]: e.target.value,
    }));

  const handleClickSubmit = async () => {
    try {
      const params = {
        ...dataUser,
        admin: true,
      };

      const data = await dispatch(fetchAuth(params));

      if (!data.payload) {
        return alert("Failed to authorization");
      }

      if ("token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "50px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "1px solid #F0F0F0",
        borderRadius: "8px",
        padding: "30px 15px",
        height: "300px",
      }}
    >
      <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
        <InputLabel htmlFor="filled-adornment-name">Email</InputLabel>
        <Input
          id="filled-adornment-name"
          type="text"
          value={dataUser.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, "email")}
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
        <Input
          id="filled-adornment-password"
          type={showPassword ? "text" : "password"}
          value={dataUser.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e, "password")
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button onClick={handleClickSubmit}>Submit</Button>
    </Box>
  );
};
export default Auth;
