// src/context/GlobalContext.jsx

import { createContext, useContext, useReducer } from "react";

const GlobalContext = createContext();

const initialState = {
  jobs: [
    {
      id: 1,
      position: "Frontend Developer",
      company: "Google",
      location: "Mountain View, CA",
      status: "pending",
      appliedDate: "2025-04-05",
    },
    {
      id: 2,
      position: "Backend Developer",
      company: "Amazon",
      location: "Seattle, WA",
      status: "interview",
      appliedDate: "2025-04-02",
    },
    {
      id: 3,
      position: "Full Stack Engineer",
      company: "Netflix",
      location: "Los Gatos, CA",
      status: "rejected",
      appliedDate: "2025-03-28",
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_JOB":
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
      };
    case "DELETE_JOB":
      return {
        ...state,
        jobs: state.jobs.filter((job) => job.id !== action.payload),
      };
    case "UPDATE_STATUS":
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.id
            ? { ...job, status: action.payload.status }
            : job
        ),
      };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addJob = (job) => {
    dispatch({ type: "ADD_JOB", payload: job });
  };

  const deleteJob = (id) => {
    dispatch({ type: "DELETE_JOB", payload: id });
  };

  const updateStatus = (id, status) => {
    dispatch({ type: "UPDATE_STATUS", payload: { id, status } });
  };

  return (
    <GlobalContext.Provider
      value={{ jobs: state.jobs, addJob, deleteJob, updateStatus }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
