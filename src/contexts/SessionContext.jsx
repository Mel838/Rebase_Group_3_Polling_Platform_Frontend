import React, { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [polls, setPolls] = useState([]);
  const [participants, setParticipants] = useState([]);

  const updateSession = (session) => {
    setCurrentSession(session);
  };

  const updatePolls = (newPolls) => {
    setPolls(newPolls);
  };

  const addPoll = (poll) => {
    setPolls(prev => [...prev, poll]);
  };

  const updatePoll = (pollId, updates) => {
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, ...updates } : p));
  };

  const removePoll = (pollId) => {
    setPolls(prev => prev.filter(p => p.id !== pollId));
  };

  const updateParticipants = (newParticipants) => {
    setParticipants(newParticipants);
  };

  const addParticipant = (participant) => {
    setParticipants(prev => [...prev, participant]);
  };

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        polls,
        participants,
        updateSession,
        updatePolls,
        addPoll,
        updatePoll,
        removePoll,
        updateParticipants,
        addParticipant
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};