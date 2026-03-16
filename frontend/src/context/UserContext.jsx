import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [userAvailability, setUserAvailability] = useState({});
  const [selectedSessions, setSelectedSessions] = useState([]);

  const updateAvailability = (date, times) => {
    setUserAvailability(prev => ({
      ...prev,
      [date]: times
    }));
  };

  const addSession = (user) => {
    setSelectedSessions(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) return prev;
      return [...prev, user];
    });
  };

  const removeSession = (id) => {
    setSelectedSessions(prev =>
      prev.filter(user => user.id !== id)
    );
  };

  return (
    <UserContext.Provider
      value={{
        userAvailability,
        updateAvailability,
        selectedSessions,
        addSession,
        removeSession
      }}
    >
      {children}
    </UserContext.Provider>
  );
}