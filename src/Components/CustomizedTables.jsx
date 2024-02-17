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
    cursor: pointer;
  }

  .timestamp-tooltip {
    position: absolute;
    top: 300;
    left: 70;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px;
    font-size: 12px;
    border-radius: 4px;
    display: none;
  }

  &:hover .timestamp-tooltip {
    display: block;
  }
`;

const CustomTableCell = styled(MuiTableCell)`
  width: 299.09px;
  height: 39px;
  border-bottom: 1px solid lightblue;
  text-align: left;
  padding: 8px;
  color: #474747;
  border-right: 1px solid lightgray;
`;

const rowsPerPage = 6;

export default function CustomizedTables() {
  const { gameList, deleteGame, updateGame } = useApihook();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [gameIdToDelete, setGameIdToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [editedGame, setEditedGame] = useState({
    gameId: null,
    gameName: "",
    gameUrl: "",
    isActive: false,
    description: "",
  });

  const isValidUrl = (url) => {
    const urlRegex =
      /^(https?):\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/i;
    return urlRegex.test(url);
  };

  const handleDeleteClick = (gameId) => {
    setGameIdToDelete(gameId);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (game) => {
    setEditedGame({
      gameId: game.gameId,
      gameName: game.gameName,
      gameUrl: game.gameUrl,
      isActive: game.isActive,
      description: game.description,
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
      await deleteGame(gameIdToDelete);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleEditConfirmation = async () => {
    try {
      if (!isValidUrl(editedGame.gameUrl)) {
        toast.error("Invalid URL");
        return;
      }
      await updateGame(editedGame);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    if (savedSearch) {
      setSearch(savedSearch);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("search", value);
  };

  useEffect(() => {
    const savedEditedGame = JSON.parse(localStorage.getItem("editedGame"));
    if (savedEditedGame) {
      setEditedGame(savedEditedGame);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("editedGame", JSON.stringify(editedGame));
  }, [editedGame]);

  const filteredGames = gameList.filter((game) => {
    const trimmedSearch = search.trim().toLowerCase();
    return (
      trimmedSearch === "" ||
      game.gameName.toLowerCase().includes(trimmedSearch) ||
      game.gameId.toString().toLowerCase().includes(trimmedSearch)
    );
  });

  return (
    <div className="mt-3 flex flex-col gap-y-2">
      <div className="flex flex-row gap-x-3">
        <label
          htmlFor="searchInput"
          className="text-gray-700 font-bold text-[15px] mt-[-48px]"
        >
          Search:
        </label>

        <input
          type="text"
          placeholder="Search by game name or id"
          value={search}
          onChange={handleSearchChange}
          className="border border-[#b6e5f7] rounded-sm px-3 mr-2 h-[34px] w-[200px] mt-[-55px] focus:outline-none focus:border-blue-300"
        />
      </div>
      <TableContainer component={Paper}>
        <CustomTable>
          <MuiTableHead>
            <MuiTableRow className="bg-[#f9fcfe]">
              <CustomTableCell align="left" className="bg-[#d9edf7]">
                <span className="font-bold text-[#3a87ad]">Game Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Game Name</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Game Url</span>
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
            {filteredGames
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((game, index) => (
                <Tooltip
                  key={`${index}-${game.gameId}`}
                  title={
                    <div>
                      <div>{`Updated By: ${game.updatedBy}`}</div>
                      <div>{`Updated At: ${new Date(
                        game.updatedAt
                      ).toLocaleString()}`}</div>
                    </div>
                  }
                >
                  <CustomTableRow key={index}>
                    <CustomTableCell>{game.gameId}</CustomTableCell>
                    <CustomTableCell>{game.gameName}</CustomTableCell>
                    <CustomTableCell>{game.gameUrl}</CustomTableCell>
                    <CustomTableCell>
                      {game.isActive ? (
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
                          onClick={() => handleEditClick(game)}
                        />
                        <img
                          src={image2}
                          alt="Delete"
                          className="w-[25px] h-[25px] cursor-pointer"
                          onClick={() => handleDeleteClick(game.gameId)}
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
        <DialogTitle id="alert-dialog-title">{"Delete Game"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the game?
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
        <DialogTitle id="form-dialog-title">Edit Game</DialogTitle>
        <DialogContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-x-2">
            <label htmlFor="gameName" className="w-[300px] font-bold">
              Game Name:
            </label>
            <input
              type="text"
              id="gameName"
              value={editedGame.gameName}
              onChange={(e) =>
                setEditedGame({ ...editedGame, gameName: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-x-2">
            <label htmlFor="gameUrl" className="w-[300px] font-bold">
              Game URL:
            </label>
            <input
              type="text"
              id="gameUrl"
              value={editedGame.gameUrl}
              onChange={(e) => {
                const newUrl = e.target.value;
                setEditedGame({ ...editedGame, gameUrl: newUrl });
              }}
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
              checked={editedGame.isActive}
              onChange={(e) =>
                setEditedGame({ ...editedGame, isActive: e.target.checked })
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="font-bold">
              Description:
            </label>
            <textarea
              id="description"
              rows={4}
              value={editedGame.description}
              onChange={(e) =>
                setEditedGame({ ...editedGame, description: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md h-[150px]"
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
        count={filteredGames.length} // Use filteredGames.length instead of gameList.length
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
