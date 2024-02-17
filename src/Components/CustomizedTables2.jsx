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

export default function CustomizedTables2() {
  const { operatorList, updateOperator, deleteOperator, operator } =
    useApihook();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [operatorIdToDelete, setOperatorIdToDelete] = useState(null);
  const [editedOperator, setEditedOperator] = useState({
    operatorId: "",
    name: "",
    isActive: false,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedSearch = localStorage.getItem("operatorSearch");
    if (savedSearch) {
      setSearch(savedSearch);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("operatorSearch", value);
  };

  useEffect(() => {
    const savedEditedOperator = JSON.parse(
      localStorage.getItem("editedOperator")
    );
    if (savedEditedOperator) {
      setEditedOperator(savedEditedOperator);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("editedOperator", JSON.stringify(editedOperator));
  }, [editedOperator]);

  const handleDeleteClick = (operatorId) => {
    setOperatorIdToDelete(operatorId);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (operator) => {
    setEditedOperator({
      operatorId: operator.operatorId,
      name: operator.name,
      isActive: operator.isActive,
    });
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
      await deleteOperator(operatorIdToDelete);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  const handleEditConfirmation = async () => {
    try {
      await updateOperator(editedOperator);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating Operator:", error);
    }
  };

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredOperators = operatorList.filter((operator) => {
    const trimmedSearch = search.trim().toLowerCase();
    return (
      trimmedSearch.trim().toLowerCase() === "" ||
      operator.name.toLowerCase().includes(trimmedSearch) ||
      operator.operatorId.toString().toLowerCase().includes(trimmedSearch)
    );
  });

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
          placeholder="Search by operator name or id"
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
                <span className="font-bold text-[#3a87ad]">Operator Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Operator Name</span>
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
            {filteredOperators
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((operator, index) => (
                <Tooltip
                  key={`${index}-${operator.operatorId}`}
                  title={
                    <div>
                      <div>{`Updated By: ${operator.updatedBy}`}</div>
                      <div>{`Updated At: ${new Date(
                        operator.updatedAt
                      ).toLocaleString()}`}</div>
                    </div>
                  }
                >
                  <CustomTableRow key={index}>
                    <CustomTableCell>{operator.operatorId}</CustomTableCell>
                    <CustomTableCell>{operator.name}</CustomTableCell>
                    <CustomTableCell>
                      {operator.isActive ? (
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
                          onClick={() => handleEditClick(operator)}
                        />
                        <img
                          src={image2}
                          alt="Delete"
                          className="w-[25px] h-[25px] cursor-pointer"
                          onClick={() => handleDeleteClick(operator.operatorId)}
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
            Are you sure you want to delete the Operator?
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

      {/* Edit Operator Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="form-dialog-title"
        className="flex flex-col gap-y-2 modal-overlay" // Add modal-overlay class
      >
        <DialogTitle id="form-dialog-title">Edit Operator</DialogTitle>
        <DialogContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-x-2">
            <label htmlFor="operatorName" className="w-[300px] font-bold">
              Operator Name:
            </label>
            <input
              type="text"
              id="name"
              value={editedOperator.name}
              onChange={(e) =>
                setEditedOperator({ ...editedOperator, name: e.target.value })
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
              checked={editedOperator.isActive}
              onChange={(e) =>
                setEditedOperator({
                  ...editedOperator,
                  isActive: e.target.checked,
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleCloseEditDialog}
            className="font-bold text-[14px] bg-green-500 p-1 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleEditConfirmation}
            className="font-bold text-[14px] bg-red-500 p-1 rounded-md text-white"
          >
            Edit
          </button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={filteredOperators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
