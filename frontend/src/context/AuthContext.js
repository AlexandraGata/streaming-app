import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "SUBSCRIBE":
      return {
        ...state,
        user: {
          ...state.user,
          subscriptionStatus: "active",
          subscriptionId: action.payload,
        },
      };
    case "UNSUBSCRIBE":
      return {
        ...state,
        user: {
          ...state.user,
          subscriptionStatus: "cancelled",
          subscriptionId: null,
        },
      };
    case "SET_SUBSCRIPTION_STATUS":
      return {
        ...state,
        user: {
          ...state.user,
          subscriptionStatus: action.payload.status,
          subscriptionId: action.payload.subscriptionId,
        },
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  const subscribe = async (subscriptionId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const token = user.token;

      const response = await axios.post(
        "http://localhost:4000/api/user/subscribe",
        { subscriptionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({ type: "SUBSCRIBE", payload: subscriptionId });
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const unsubscribe = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        throw new Error("Authentication token is missing");
      }

      const subscriptionStatusResponse = await axios.get(
        "http://localhost:4000/api/user/subscription-status",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const subscriptionId = subscriptionStatusResponse.data.subscriptionId;

      if (!subscriptionId) {
        throw new Error("Subscription ID is missing");
      }

      await axios.post(
        "http://localhost:4000/api/user/cancel-subscription",
        { subscriptionId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      dispatch({ type: "UNSUBSCRIBE" });
    } catch (error) {
      console.error("Unsubscription error:", error);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const token = user.token;

      const response = await axios.get(
        "http://localhost:4000/api/user/subscription-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { subscriptionStatus, subscriptionId } = response.data;

      dispatch({
        type: "SET_SUBSCRIPTION_STATUS",
        payload: {
          status: subscriptionStatus,
          subscriptionId: subscriptionId,
        },
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        subscribe,
        unsubscribe,
        checkSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
