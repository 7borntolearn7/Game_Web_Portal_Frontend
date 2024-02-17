import React, { useState, useEffect } from "react";
import {
  Paper,
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import { useApihook } from "../ContextApi/Context";

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

export default function CustomizedTables7({ transactionLogs }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(
    localStorage.getItem("transactionLogsSearch") || ""
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.trim();
    setSearch(searchTerm);
    setPage(0);
    localStorage.setItem("transactionLogsSearch", searchTerm);
  };

  const filteredTransactions = transactionLogs.filter((obj) => {
    const searchTermLower = search.toLowerCase();
    const transactionFieldsMatch = Object.values(obj.requestObject).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTermLower)
    );

    const statusMatch =
      obj.responceObject &&
      obj.responceObject.status &&
      obj.responceObject.status.toLowerCase().includes(searchTermLower);

    const messageMatch =
      obj.responceObject &&
      obj.responceObject.message &&
      obj.responceObject.message.toLowerCase().includes(searchTermLower);

    return transactionFieldsMatch || statusMatch || messageMatch;
  });

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="mt-3">
      <div className="flex flex-row gap-x-2">
        <div className="text-gray-700 font-bold text-[15px] mt-3">Filter:</div>
        <input
          type="text"
          placeholder="Search Eg:Bet Id,Game Code, Game Id etc.."
          className="border border-[#b6e5f7] rounded-full px-3 mr-2 h-[34px] w-[300px] mt-[6px] focus:outline-none focus:border-blue-300"
          onChange={handleSearchChange}
          value={search}
        />
      </div>
      <TableContainer component={Paper} className="mt-3">
        <CustomTable>
          <MuiTableHead>
            <MuiTableRow className="bg-[#f9fcfe]">
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">User Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Token</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Operator Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Currency</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Request UUID</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Bet Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Bet Time</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Amount</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Round Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Game Id</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Game Code</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">
                  Reference Request UUID
                </span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Status</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Message</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Created At</span>
              </CustomTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {paginatedTransactions.map((obj, index) => (
              <CustomTableRow key={index}>
                <CustomTableCell>{obj.requestObject.userId}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.token}</CustomTableCell>
                <CustomTableCell>
                  {obj.requestObject.operatorId}
                </CustomTableCell>
                <CustomTableCell>{obj.requestObject.currency}</CustomTableCell>
                <CustomTableCell>
                  {obj.requestObject.request_uuid}
                </CustomTableCell>
                <CustomTableCell>{obj.requestObject.bet_id}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.bet_time}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.amount}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.roundId}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.game_id}</CustomTableCell>
                <CustomTableCell>{obj.requestObject.game_code}</CustomTableCell>
                <CustomTableCell>
                  {obj.requestObject.reference_request_uuid}
                </CustomTableCell>
                <CustomTableCell>
                  {obj.responceObject ? obj.responceObject.status : ""}
                </CustomTableCell>
                <CustomTableCell>
                  {obj.responceObject ? obj.responceObject.message : ""}
                </CustomTableCell>
                <CustomTableCell>{obj.createDate}</CustomTableCell>
              </CustomTableRow>
            ))}
          </MuiTableBody>
        </CustomTable>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
