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

export default function CustomizedTables6({ failedTransactions }) {
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("tablePage"), 10) || 0
  );
  const [search, setSearch] = useState(
    localStorage.getItem("tableSearch") || ""
  );
  const [isCheckedAll, setIsCheckedAll] = useState(
    localStorage.getItem("isCheckedAll") === "true" || false
  );
  const [checkedItems, setCheckedItems] = useState(
    JSON.parse(localStorage.getItem("checkedItems")) || []
  );
  const [retryEnabled, setRetryEnabled] = useState(
    localStorage.getItem("retryEnabled") === "true" || false
  );

  useEffect(() => {
    // Save state values to local storage when they change
    localStorage.setItem("tablePage", page);
    localStorage.setItem("tableSearch", search);
    localStorage.setItem("isCheckedAll", isCheckedAll);
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
    localStorage.setItem("retryEnabled", retryEnabled);
  }, [page, search, isCheckedAll, checkedItems, retryEnabled]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
    setPage(0); // Reset page to 0 whenever search term changes
  };

  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    if (!isCheckedAll) {
      const newCheckedItems = failedTransactions.map(() => true);
      setCheckedItems(newCheckedItems);
      setRetryEnabled(true);
    } else {
      const newCheckedItems = failedTransactions.map(() => false);
      setCheckedItems(newCheckedItems);
      setRetryEnabled(false);
    }
  };

  const handleSingleCheck = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
    setRetryEnabled(updatedCheckedItems.some((item) => item === true));
  };

  const handleRetry = async () => {
    const itemsToRetry = failedTransactions.filter(
      (_, index) => checkedItems[index]
    );
    for (const item of itemsToRetry) {
      try {
        await retryFailedTransaction(item);
      } catch (error) {
        console.error("Error retrying failed transaction:", error);
      }
    }
  };

  const retryFailedTransaction = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/resendTransaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to retry transaction");
      }
    } catch (error) {
      throw new Error("Failed to retry transaction: " + error.message);
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = failedTransactions.filter((obj) => {
    const searchTermLower = search.toLowerCase();
    const transactionFieldsMatch = Object.values(obj.transaction).some(
      (value) => {
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(searchTermLower)
        ) {
          return true;
        }
        if (
          typeof value === "number" &&
          value.toString().includes(searchTermLower)
        ) {
          return true;
        }
        return false;
      }
    );
    const transactionTypeMatch =
      obj.transactionType &&
      obj.transactionType.toLowerCase().includes(searchTermLower);
    return transactionFieldsMatch || transactionTypeMatch;
  });

  // Paginate filtered transactions
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
        <button
          className="bg-blue-500 w-[100px] h-[34px] text-white mt-[6px] mr-1 rounded-full font-[900] hover:bg-blue-600"
          onClick={handleCheckAll}
        >
          {isCheckedAll ? "Discard All" : "Check All"}
        </button>
        <button
          className="bg-yellow-400 w-[100px] h-[34px] text-white mt-[6px] mr-1 rounded-full font-[900] hover:bg-yellow-500"
          onClick={handleRetry}
          disabled={!retryEnabled}
        >
          Retry
        </button>
      </div>
      <TableContainer component={Paper} className="mt-3">
        <CustomTable>
          <MuiTableHead>
            <MuiTableRow className="bg-[#f9fcfe]">
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Checked</span>
              </CustomTableCell>
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
                <span className="font-bold text-[#3a87ad]">
                  Transaction Type
                </span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Retry Attempts</span>
              </CustomTableCell>
              <CustomTableCell align="left">
                <span className="font-bold text-[#3a87ad]">Created At</span>
              </CustomTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {paginatedTransactions.map((obj, index) => (
              <CustomTableRow key={index}>
                <CustomTableCell>
                  <input
                    type="checkbox"
                    className="ml-6"
                    checked={checkedItems[index] || false}
                    onChange={() => handleSingleCheck(index)}
                  />
                </CustomTableCell>
                <CustomTableCell>{obj.transaction.userId}</CustomTableCell>
                <CustomTableCell>{obj.transaction.token}</CustomTableCell>
                <CustomTableCell>{obj.transaction.operatorId}</CustomTableCell>
                <CustomTableCell>{obj.transaction.currency}</CustomTableCell>
                <CustomTableCell>
                  {obj.transaction.request_uuid}
                </CustomTableCell>
                <CustomTableCell>{obj.transaction.bet_id}</CustomTableCell>
                <CustomTableCell>{obj.transaction.bet_time}</CustomTableCell>
                <CustomTableCell>{obj.transaction.amount}</CustomTableCell>
                <CustomTableCell>{obj.transaction.roundId}</CustomTableCell>
                <CustomTableCell>{obj.transaction.game_id}</CustomTableCell>
                <CustomTableCell>{obj.transaction.game_code}</CustomTableCell>
                <CustomTableCell>
                  {obj.transaction.reference_request_uuid}
                </CustomTableCell>
                <CustomTableCell>{obj.transactionType}</CustomTableCell>
                <CustomTableCell>{obj.retry}</CustomTableCell>
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
