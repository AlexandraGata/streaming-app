import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
export const MyListContext = createContext();

const myListReducer = (state, action) => {
  switch (action.type) {
    case "":
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    case "REMOVE_FROM_MY_LIST":
      return {
        ...state,
        myList: state.myList.filter((itemId) => itemId !== action.payload),
      };
    case "SET_MY_LIST":
      return {
        ...state,
        myList: action.payload,
      };

    default:
      return state;
  }
};

const addItemToListServer = async (itemId, dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const response = await axios.post(
      "http://localhost:4000/api/user/mylist/add",
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      dispatch({ type: "ADD_TO_MY_LIST", payload: itemId });
    }
  } catch (error) {
    console.error("Could not add item to list", error);
  }
};

const removeItemFromListServer = async (itemId, dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const token = user.token;

    const response = await axios.delete(
      "http://localhost:4000/api/user/mylist/remove",
      {
        data: { itemId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      dispatch({ type: "REMOVE_FROM_MY_LIST", payload: itemId });
    }
  } catch (error) {
    console.error("Could not remove item from list", error);
  }
};

const getUserListFromServer = async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const token = user.token;
    const response = await axios.get("http://localhost:4000/api/user/mylist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      dispatch({ type: "SET_MY_LIST", payload: response.data });
    }
  } catch (error) {
    console.error("Could not get user list", error);
  }
};

const addItem = async (itemId, dispatch) => {
  await addItemToListServer(itemId, dispatch);
  getUserListFromServer(dispatch);
};

const removeItem = async (itemId, dispatch) => {
  await removeItemFromListServer(itemId, dispatch);
  getUserListFromServer(dispatch);
};

export const MyListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(myListReducer, { myList: [] });
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      getUserListFromServer(dispatch, user);
    } else {
      dispatch({ type: "SET_MY_LIST", payload: [] });
    }
  }, [user, dispatch]);

  const getUserListFromServer = async (dispatch, user) => {
    if (!user || !user.token) return;

    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/mylist",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch({ type: "SET_MY_LIST", payload: response.data });
      }
    } catch (error) {
      console.error("Could not get user list", error);
    }
  };

  const value = {
    myList: state.myList,
    addItem: (itemId) => addItem(itemId, dispatch),
    removeItem: (itemId) => removeItem(itemId, dispatch),
    getList: () => getUserListFromServer(dispatch),
  };

  return (
    <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};
