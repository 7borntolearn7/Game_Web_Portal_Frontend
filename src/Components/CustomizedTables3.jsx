import React, { useState } from "react";
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
import { toast } from "react-toastify";

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

export default function CustomizedTables3({ tableData, operator }) {
  const { opGamesList, deleteOpGame, updateOpGame } = useApihook();
  const [opId, setOpId] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [opGameToDelete, setOpGameToDelete] = useState(null);
  const [editedOpGame, setEditedOpGame] = useState({
    game: "",
    secretKey: "",
    currency: "",
    isActive: false,
    operatorEndpoint: "",
    winPercentage: "",
  });

  const handleDeleteClick = (game, operator) => {
    setOpGameToDelete(game);
    setOpId(operator);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (obj, operator) => {
    setEditedOpGame({
      game: obj.game,
      secretKey: obj.secretKey,
      currency: obj.currency,
      isActive: obj.isActive,
      operatorEndpoint: obj.operatorEndpoint,
      winPercentage: obj.winPercentage,
    });
    setOpId(operator);
    setOpenEditDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const isValidUrl = (url) => {
    console.log("url is:", url);
    const urlRegex =
      /^(https?):\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/i;
    console.log("testing:", urlRegex.test(url));
    return urlRegex.test(url);
  };
  const handleDeleteConfirmation = async () => {
    try {
      // Assuming deleteOpGame now accepts two parameters: opId in params and opGameToDelete in the request body
      await deleteOpGame(opId, opGameToDelete);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  const handleEditConfirmation = async () => {
    try {
      // Assuming updateOpGame now accepts two parameters: opId as a parameter and editedOpGame in the request body
      if (!isValidUrl(editedOpGame.operatorEndpoint)) {
        toast.error("Invalid URL");
        return;
      }
      await updateOpGame(opId, editedOpGame);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating Operator:", error);
    }
  };

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="mt-3">
      <TableContainer component={Paper}>
        <CustomTable>
          <MuiTableHead>
            <MuiTableRow className="bg-[#f9fcfe]">
              <CustomTableCell align="left" className="bg-[#d9edf7]">
                <span className="font-bold text-[#3a87ad]">Game Name</span>
              </CustomTableCell>

              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Secret Key</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Currency</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Status</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">
                  Operator Endpoint
                </span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Win Percentage</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Tools</span>
              </CustomTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {(rowsPerPage > 0
              ? tableData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : tableData
            ).map((obj, index) => (
              <CustomTableRow key={obj.game}>
                <CustomTableCell>{obj.game}</CustomTableCell>
                <CustomTableCell>{obj.secretKey}</CustomTableCell>
                <CustomTableCell>{obj.currency}</CustomTableCell>
                <CustomTableCell>
                  {obj.isActive ? <span>Active</span> : <span>Inactive</span>}
                </CustomTableCell>
                <CustomTableCell>{obj.operatorEndpoint}</CustomTableCell>
                <CustomTableCell>{obj.winPercentage}</CustomTableCell>
                <CustomTableCell>
                  <div className="flex gap-x-3">
                    <img
                      src={image}
                      alt="Edit"
                      className="w-[25px] h-[25px] cursor-pointer"
                      onClick={() => handleEditClick(obj, operator)}
                    />
                    <img
                      src={image2}
                      alt="Delete"
                      className="w-[25px] h-[25px] cursor-pointer"
                      onClick={() => handleDeleteClick(obj.game, operator)}
                    />
                  </div>
                </CustomTableCell>
              </CustomTableRow>
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
            Are you sure you want to delete the Operator Game?
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
            className="font-bold text-[14px] bg-red-500 pl-2 pr-2 pt-1 pb-1 rounded-md text-white"
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
        <DialogTitle id="form-dialog-title">Edit Operator</DialogTitle>
        <DialogContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-x-2">
            <label htmlFor="secretKey" className="w-[300px] font-bold">
              Secret Key/Public Key:
            </label>
            <textarea
              id="secretKey"
              value={editedOpGame.secretKey}
              onChange={(e) =>
                setEditedOpGame({
                  ...editedOpGame,
                  secretKey: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-md "
              rows={4} // Set the number of rows as needed
            />
          </div>
          <div className="flex flex-col gap-x-2">
            <label htmlFor="currency" className="w-[300px] font-bold">
              Currency:
            </label>
            <select
              id="currency"
              value={editedOpGame.currency}
              onChange={(e) =>
                setEditedOpGame({ ...editedOpGame, currency: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="HKD">HKD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="flex flex-col gap-x-2">
            <label htmlFor="gameName" className="w-[300px] font-bold">
              Operator Endpoint:
            </label>
            <input
              type="text"
              id="operatorEndpoint"
              value={editedOpGame.operatorEndpoint}
              onChange={(e) =>
                setEditedOpGame({
                  ...editedOpGame,
                  operatorEndpoint: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-x-2">
            <label htmlFor="gameName" className="w-[300px] font-bold">
              Win Percentage:
            </label>
            <input
              type="text"
              id="winPercentage"
              value={editedOpGame.winPercentage}
              onChange={(e) =>
                setEditedOpGame({
                  ...editedOpGame,
                  winPercentage: e.target.value,
                })
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
              id="isActive"
              checked={editedOpGame.isActive}
              onChange={(e) =>
                setEditedOpGame({
                  ...editedOpGame,
                  isActive: e.target.checked,
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
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
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
