import { createContext, useContext, useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import axios from "axios";
import { toast } from "react-toastify";

const Context = createContext();

const baseUrl = process.env.REACT_APP_BASE_URL;
const loginUrl = `${baseUrl}/login`;
const addGameUrl = `${baseUrl}/games/createGame`;
const getGamesUrl = `${baseUrl}/games/getGames`;
const createUserUrl = `${baseUrl}/createUser`;
const changePasswordUrl = `${baseUrl}/changePassword`;
const getOperatorsUrl = `${baseUrl}/operator/getOperators`;
const addOperatorUrl = `${baseUrl}/operator/createOperator`;
const getOpGamesUrl = `${baseUrl}/OpGames/getOpGames`;
const addOpGameUrl = `${baseUrl}/OpGames/createOpGames`;
const getUsersUrl = `${baseUrl}/getUsers`;

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [addedUser, setAddedUser] = useState([]);
  const [userList, setUserList] = useState([]);
  const [game, setGame] = useState([]);
  const [operator, setOperator] = useState([]);
  const [gameList, setGameList] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteGameId, setDeleteGameId] = useState(null);
  const [deletOperatorId, setDeleteOperatorId] = useState(null);
  const [operatorList, setOperatorList] = useState([]);
  const [opGames, setOpGames] = useState([]);
  const [opGamesList, setOpGamesList] = useState([]);
  const [deletedOpGameId, setDeletedOpGameId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const setAuthToken = (token) => {
    localStorage.setItem("token", token);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData);
    }
  }, []);
  const login = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(loginUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "RS_OK") {
        if (response.data.isEnabled !== true) {
          console.log("It is not true");
        }
        console.log("Is it false");
        setAuthToken(response.data.token);

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(response.data));
      }
      setLoading(false);
      setUser(response.data);
      console.log("User is:", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return { status: "RS_ERROR", message: "An error occurred during login" };
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser({});
    window.location.href = "/";
  };
  const addOperator = async (data) => {
    try {
      const response = await axios.post(addOperatorUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOperatorList((prevOperatorList) => [
        ...prevOperatorList,
        response.data,
      ]);

      setOperator(response.data);
    } catch (error) {
      console.log("Detailed Error Response:", error.response);
      throw error;
    }
  };

  const addOpGame = async (data) => {
    try {
      const response = await axios.post(addOpGameUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOpGamesList((prevOpGamesList) => [...prevOpGamesList, response.data]);

      setOpGames(response.data);
    } catch (error) {
      console.log("Detailed Error Response:", error.response);
      throw error;
    }
  };

  const createGame = async (data) => {
    try {
      const response = await axios.post(addGameUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setGame(response.data);

      setGameList((prevGameList) => [...prevGameList, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (data) => {
    try {
      const response = await axios.post(createUserUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setAddedUser(response.data);
      setUserList((prevUserList) => [...prevUserList, response.data]);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getGamesUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!isEqual(gameList, response.data.message)) {
        setGameList((prevGameList) => response.data.message);
      }
    } catch (error) {
      console.log(error);
      setGameList([]);
    } finally {
      setLoading(false);
    }
  };
  const getAllusers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getUsersUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!isEqual(userList, response.data.message)) {
        setUserList((prevUserList) => response.data.message);
      }
    } catch (error) {
      console.log(error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };
  const getAllOperators = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getOperatorsUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!isEqual(operatorList, response.data.message)) {
        setOperatorList(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setOperatorList([]);
    } finally {
      setLoading(false);
    }
  };
  const getAllOpGames = async (operatorId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${getOpGamesUrl}/${operatorId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("Am I comming here1");

      if (!isEqual(opGamesList, response.data.message)) {
        setOpGamesList(response?.data?.message);
        const gameDetailsArray = response?.data?.message[0]?.gameDetails;
        console.log("Am I comming here2");

        if (Array.isArray(gameDetailsArray)) {
          console.log("I am returning an array");
          return gameDetailsArray;
        } else {
          console.error(
            "Invalid or unexpected response format:",
            response.data
          );
          return [];
        }
      }
    } catch (error) {
      console.error("Error fetching operator games:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const deleteGame = async (gameId) => {
    try {
      const deleteGameUrl = `${baseUrl}/games/deletegame/${gameId}`;
      await axios.delete(deleteGameUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setGameList((prevGameList) =>
        prevGameList.filter((game) => game.gameId !== gameId)
      );

      toast.success("Game deleted Successfully");
      setDeleteGameId(null);
    } catch (error) {
      toast.error("Error Occurred While Deleting the game");
    }
  };

  const deleteOperator = async (operatorId) => {
    try {
      const operatorDeleteUrl = `${baseUrl}/operator/deleteOperator/${operatorId}`;
      await axios.delete(operatorDeleteUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOperatorList((prevOperatorList) =>
        prevOperatorList.filter(
          (operator) => operator.operatorId !== operatorId
        )
      );

      toast.success("Operator deleted Successfully");
      setDeleteOperatorId(null);
    } catch (error) {
      toast.error("Error Occurred While Deleting the Operator");
    }
  };
  const deleteUser = async (userId) => {
    try {
      const userDeleteUrl = `${baseUrl}/deleteUser/${userId}`;
      await axios.delete(userDeleteUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setUserList((prevUserList) =>
        prevUserList.filter((user) => user._id !== userId)
      );

      toast.success("User deleted Successfully");
      setDeleteUserId(null);
    } catch (error) {
      toast.error("Error Occurred While Deleting the User");
    }
  };

  const deleteOpGame = async (operatorId, opGameToDelete) => {
    const payload = {
      game: opGameToDelete,
    };
    try {
      const opGameDeleteUrl = `${baseUrl}/OpGames/deleteOpGame/${operatorId}`;
      await axios.put(opGameDeleteUrl, payload, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      setOpGamesList((prevOpGamesList) =>
        prevOpGamesList.filter(
          (opGame) => opGame.opGameId !== opGameToDelete.opGameId
        )
      );

      toast.success("Operator Game deleted Successfully");
      setDeletedOpGameId(null);
    } catch (error) {
      toast.error("Error Occurred While Deleting the Operator Game");
    }
  };

  const updateGame = async (game) => {
    try {
      const updateGameUrl = `${baseUrl}/games/updateGame/${game.gameId}`;
      const response = await axios.put(updateGameUrl, game, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setGameList((prevGameList) =>
        prevGameList.map((item) =>
          item.gameId === game.gameId ? response.data : item
        )
      );

      console.log("Updated game data:", response.data);
      setGame(response.data);
      toast.success("Game Updated Successfully");
    } catch (error) {
      console.error("Error occurred while updating the game:", error);
      toast.error("Error occurred while updating the game");
    }
  };
  const updateUser = async (user, uId) => {
    const updateUserUrl = `${baseUrl}/updateUser/${uId}`;
    const response = await axios.put(updateUserUrl, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    setUserList((prevUserList) =>
      prevUserList.map((item) => (item._id === user._id ? response.data : item))
    );
    console.log("Updated User data:", response.data);
    setUser(response.data);
    toast.success("User Updated Successfully");
  };
  const updateOpGame = async (opId, opGameToUpdate) => {
    try {
      const updateOpGameUrl = `${baseUrl}/OpGames/updateOpGame/${opId}`;
      const response = await axios.put(updateOpGameUrl, opGameToUpdate, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOpGamesList((prevOpGamesList) =>
        prevOpGamesList.map((item) =>
          item.opGameId === opGameToUpdate.opGameId ? response.data : item
        )
      );

      console.log("Updated Operator Game data:", response.data);
      setOpGames(response.data);
      toast.success("Operator Game Updated Successfully");
    } catch (error) {
      console.error("Error occurred while updating the operator game:", error);
      toast.error("Error occurred while updating the operator game");
    }
  };
  const updateOperator = async (operator) => {
    try {
      const updateOperatorUrl = `${baseUrl}/operator/updateOperator/${operator.operatorId}`;
      const response = await axios.put(updateOperatorUrl, operator, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOperatorList((prevOperatorList) =>
        prevOperatorList.map((item) =>
          item.operatorId === operator.operatorId ? response.data : item
        )
      );

      console.log("Updated Operator data:", response.data);
      setOperator(response.data);
      toast.success("Operator Updated Successfully");
    } catch (error) {
      console.error("Error occurred while updating the operator:", error);
      toast.error("Error occurred while updating the operator");
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await axios.put(changePasswordUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const getTransactions = async (gameCode, fromDate, toDate) => {
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/getTransactions?game_code=${gameCode}&fromDate=${fromDate}&toDate=${toDate}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (response.data.status === "RS_OK") {
        setTransactions(response.data.message);
        console.log("Transactions are:", transactions);
      } else {
        console.error("Error fetching transactions:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const getFailedTransactions = async (gameCode, fromDate, toDate) => {
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/getFailedTransactions?game_code=${gameCode}&fromDate=${fromDate}&toDate=${toDate}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (response.data.status === "RS_OK") {
        setFailedTransactions(response.data.message);
        console.log("Failed Transactions are:", failedTransactions);
      } else {
        console.error(
          "Error fetching Failed transactions:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching Failed transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const getTransactionLogs = async (gameCode, fromDate, toDate) => {
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/getTransactionLogs?game_code=${gameCode}&fromDate=${fromDate}&toDate=${toDate}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (response.data.status === "RS_OK") {
        setTransactionLogs(response.data.message);
        console.log("logs are:", transactionLogs);
      } else {
        console.error("Error fetching Logs:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Context.Provider
      value={{
        loading,
        user,
        login,
        createGame,
        game,
        getAllGames,
        gameList,
        deleteGame,
        setDeleteGameId,
        updateGame,
        createUser,
        changePassword,
        getAllOperators,
        operatorList,
        setOperatorList,
        addOperator,
        updateOperator,
        deleteOperator,
        operator,
        setDeleteOperatorId,
        getAllOpGames,
        opGamesList,
        setOpGamesList,
        opGames,
        setOpGames,
        addOpGame,
        deleteOpGame,
        updateOpGame,
        getAllusers,
        deleteUser,
        updateUser,
        userList,
        setDeleteUserId,
        logout,
        getTransactions,
        getFailedTransactions,
        transactions,
        failedTransactions,
        getTransactionLogs,
        transactionLogs,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// custom hook
const useApihook = () => {
  return useContext(Context);
};

export { useApihook, ContextProvider };
