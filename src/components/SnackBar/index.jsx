import { forwardRef, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar({ success, error }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (success || error) {
      setOpen(true);
    }
  }, [success, error]);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={(success && "success") || (error && "error")}
        sx={{ width: "100%" }}
      >
        {(success && success) || (error && error)}
      </Alert>
    </Snackbar>
  );
}
