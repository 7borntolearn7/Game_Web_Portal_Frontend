import React, { useState, useEffect } from "react";
import {
  Paper,
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useApihook } from "../ContextApi/Context";

const image = require("../icons/edit2.png");
const image2 = require("../icons/delete.png");

const TableContainer = styled(MuiTableContainer)`
  font-size: 15px;
`;

const CustomTable = styled(MuiTable)`
  width: 100%;
  border-collapse: collapse;
`;

const CustomTableRow = styled(MuiTableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }

  &:nth-of-type(even) {
    background-color: white;
  }

  &:hover {
    background-color: #e6ffff;
  }
`;

const CustomTableCell = styled(MuiTableCell)`
  width: 279.09px;
  height: 39px;
  border-bottom: 1px solid lightblue;
  text-align: left;
  padding: 8px;
  color: #474747;
  border-right: 1px solid lightgray;
`;

const rowsPerPage = 6;

export default function CustomizedTables4() {
  const { userList, updateUser, deleteUser, user } = useApihook();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [uId, setuId] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    isEnabled: false,
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    const savedSearch = localStorage.getItem("userSearch");
    if (savedSearch) {
      setSearch(savedSearch);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("userSearch", value);
  };

  const handleDeleteClick = (userID) => {
    setUserIdToDelete(userID);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (user, userId) => {
    setEditedUser({
      username: user.username,
      isEnabled: user.isEnabled,
    });
    setuId(userId);
    setOpenEditDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await deleteUser(userIdToDelete);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  const handleEditConfirmation = async () => {
    try {
      await updateUser(editedUser, uId);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredUsers = userList.filter((user) => {
    const trimmedSearch = search.trim().toLowerCase();
    return (
      trimmedSearch.trim().toLowerCase() === "" ||
      user.username.toLowerCase().includes(trimmedSearch) ||
      user.email.toString().toLowerCase().includes(trimmedSearch)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="mt-3">
      <div className="flex flex-row gap-x-3">
        <label
          htmlFor="searchInput"
          className="text-gray-700 font-bold text-[15px] mt-[-48px]"
        >
          Search:
        </label>

        <input
          type="text"
          placeholder="Search by name or Email Id"
          value={search}
          onChange={handleSearchChange}
          className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[220px] mt-[-55px] focus:outline-none focus:border-blue-300"
        />
      </div>
      <TableContainer component={Paper}>
        <CustomTable>
          <MuiTableHead>
            <MuiTableRow className="bg-[#f9fcfe]">
              <CustomTableCell align="left" className="bg-[#d9edf7]">
                <span className="font-bold text-[#3a87ad]">Email Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Username</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Status</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Tools</span>
              </CustomTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {paginatedUsers.map((user, index) => (
              <Tooltip
                key={`${index}`}
                title={
                  <div>
                    <div>{`Updated By: ${user.updated_by}`}</div>
                    <div>{`Updated At: ${new Date(
                      user.updated_at
                    ).toLocaleString()}`}</div>
                  </div>
                }
              >
                <CustomTableRow key={user.email}>
                  <CustomTableCell>{user.email}</CustomTableCell>
                  <CustomTableCell>{user.username}</CustomTableCell>
                  <CustomTableCell>
                    {user.isEnabled ? (
                      <span>Active</span>
                    ) : (
                      <span>Inactive</span>
                    )}
                  </CustomTableCell>
                  <CustomTableCell>
                    <div className="flex gap-x-3">
                      <img
                        src={image}
                        alt="Edit"
                        className="w-[25px] h-[25px] cursor-pointer"
                        onClick={() => handleEditClick(user, user._id)}
                      />
                      <img
                        src={image2}
                        alt="Delete"
                        className="w-[25px] h-[25px] cursor-pointer"
                        onClick={() => handleDeleteClick(user._id)}
                      />
                    </div>
                  </CustomTableCell>
                </CustomTableRow>
              </Tooltip>
            ))}
          </MuiTableBody>
        </CustomTable>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Operator"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleCloseDeleteDialog}
            className="font-bold text-[14px] bg-green-500 p-1 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirmation}
            autoFocus
            className="font-bold text-[14px] bg-red-500 p-1 rounded-md text-white"
          >
            Yes
          </button>
        </DialogActions>
      </Dialog>

      {/* Edit Game Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="form-dialog-title"
        className="flex flex-col gap-y-2 modal-overlay" // Add modal-overlay class
      >
        <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        <DialogContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-x-2">
            <label htmlFor="gameName" className="w-[300px] font-bold">
              Username:
            </label>
            <input
              type="text"
              id="name"
              value={editedUser.username}
              onChange={(e) =>
                setEditedUser({ ...editedUser, username: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-row gap-x-2">
            <label htmlFor="isActive" className="font-bold">
              Active:
            </label>
            <input
              type="checkbox"
              id="isEnabled"
              checked={editedUser.isEnabled}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser,
                  isEnabled: e.target.checked,
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions className="flex gap-x-1">
          <button
            onClick={handleCloseEditDialog}
            className="font-bold text-[14px] bg-red-500 p-1 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleEditConfirmation}
            className="font-bold text-[14px] bg-green-500 p-1 rounded-md text-white"
          >
            Edit
          </button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
