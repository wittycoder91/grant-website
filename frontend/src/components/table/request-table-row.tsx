import { useState, useCallback } from "react";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { Iconify } from "@/components/iconify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { getCurrentUser } from "@/services/authService";
import { Box } from "@mui/material";
import { postComment } from "@/services/grantService";

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: any;
  headList: string[];
  selected: boolean;
  onSelectRow: () => void;
  onAccept: (...value: any) => void;
  onDeny: (...value: any) => void;
};

export function UserTableRow({
  headList,
  row,
  selected,
  onSelectRow,
  onAccept,
  onDeny,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );
  const [state, setState] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const user = getCurrentUser();

  const handleAcceptClick = useCallback(() => {
    setState(true);
    setOpenDialog(true);
  }, []);

  const handleDenyClick = useCallback(() => {
    setState(false);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setState(null);
  };
  const confirmState = (id: string) => {
    if (openDialog) {
      state && onAccept(id);
      !state && onDeny(id);
      setOpenDialog(false);
      setState(null);
    }
  };
  const cancelAction = () => {
    setOpenDialog(false);
    setState(null);
  };

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );
  const submitComment = (id: string) => {
    console.log("submit comment;", id, comment.trim());
    if (comment.trim()) {
      postComment(id, comment);
      setOpenComment(false);
      setComment("");
    }
  };

  const cancelComment = () => {
    setOpenComment(false);
    setComment("");
  };

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const handleCloseCommentDialog = () => {
    setOpenComment(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {headList.map((headItem: any, i) => (
          <TableCell
            key={row.id + row[headItem.id] + i}
            align={
              [
                "reviewer",
                "signed",
                "col_dean",
                "grant_dep",
                "grant_dir",
                "accepted",
              ].includes(headItem.id)
                ? "center"
                : "left"
            }
          >
            <>
              {headItem.id === "announcement" ? (
                row["announcement"].title
              ) : [
                  "reviewer",
                  "signed",
                  "col_dean",
                  "grant_dep",
                  "grant_dir",
                  "accepted",
                ].includes(headItem.id) ? (
                row[headItem.id] == "approved" ? (
                  <Iconify
                    width={22}
                    icon="solar:check-circle-bold"
                    sx={{ color: "success.main" }}
                  />
                ) : row[headItem.id] == "rejected" ? (
                  <Iconify
                    width={22}
                    icon="solar:close-circle-bold-duotone"
                    sx={{ color: "error.main" }}
                  />
                ) : (
                  <> - </>
                )
              ) : headItem.id == "application" ? (
                <Link
                  href={`${import.meta.env.VITE_BASE_URL}/application/${
                    row[headItem.id]
                  }`}
                  target="_blank"
                >
                  View
                </Link>
              ) : (
                row[headItem.id]
              )}
            </>{" "}
          </TableCell>
        ))}

        {user.role !== "user" && (
          <TableCell align="right">
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}

        <Popover
          open={!!openPopover}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuList
            disablePadding
            sx={{
              p: 0.5,
              gap: 0.5,
              width: 140,
              display: "flex",
              flexDirection: "column",
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                [`&.${menuItemClasses.selected}`]: {
                  bgcolor: "action.selected",
                },
              },
            }}
          >
            <MenuItem
              onClick={handleAcceptClick}
              sx={{ color: "success.main" }}
            >
              <Iconify icon="solar:check-circle-broken" />
              Accept
            </MenuItem>

            <MenuItem onClick={handleDenyClick} sx={{ color: "error.main" }}>
              <Iconify icon="solar:forbidden-circle-broken" />
              Deny
            </MenuItem>
            <MenuItem
              onClick={() => setOpenComment((pre) => !pre)}
              sx={{ color: "info.main" }}
            >
              <Iconify icon="solar:paperclip-outline" />
              Comment
            </MenuItem>
          </MenuList>
        </Popover>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle mb={1}>Confirm action</DialogTitle>
          <Typography p={2}>
            Are you sure you want to {state ? "accept" : "deny"} this
            application?
          </Typography>
          <DialogActions>
            <Button onClick={() => confirmState(row.id)} color="primary">
              Yes
            </Button>
            <Button onClick={() => cancelAction()} color="secondary">
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openComment} onClose={handleCloseCommentDialog}>
          <DialogTitle mb={1}>Comment</DialogTitle>
          {user.role == "grant_dir" ? (
            <DialogContent>
              <DialogContentText>{row.comment}</DialogContentText>
            </DialogContent>
          ) : (
            <Box px={3}>
              <TextField
                label="Comment"
                variant="outlined"
                minRows={3}
                fullWidth
                multiline
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></TextField>
              <TextField
                fullWidth
                hidden
                sx={{
                  visibility: "hidden",
                  height: 0,
                  m: 0,
                  p: 0,
                }}
              ></TextField>
            </Box>
          )}
          {user.role === "grant_dir" ? (
            <Button onClick={() => setOpenComment(false)} size="large">
              Close
            </Button>
          ) : (
            <DialogActions>
              <Button onClick={() => submitComment(row.id)} color="primary">
                Submit
              </Button>
              <Button onClick={() => cancelComment()} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </TableRow>
    </>
  );
}