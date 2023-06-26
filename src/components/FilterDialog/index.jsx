import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

function FilterDialog(props) {
  const filters = {
    "All": "all",
    "In Progress": "progress",
    "Pending": "pending",
    "Completed": "completed",
    "Due Date": "dueDate",
  };
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "600",
          backgroundColor: "#64CCC5",
          color: "#001C30",
        }}
      >
        Choose Filter
      </DialogTitle>
      <List sx={{ pt: 0, width: "15rem", backgroundColor: "#DAFFFB" }}>
        {Object.keys(filters).map((filter) => (
          <ListItem disableGutters>
            <ListItemButton
              onClick={() => handleListItemClick(filters[filter])}
              key={filter}
            >
              <ListItemText
                primary={filter}
                primaryTypographyProps={{
                  style: {
                    textAlign: "center",
                    color: "#001C30",
                    fontSize: "18px",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default FilterDialog;
