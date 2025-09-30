import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useSocket } from '../hooks/useSocket';
import { SessionContext } from '../contexts/SessionContext';
import { sessionService } from '../services/sessionService.js';
import { pollService } from '../services/pollService.js';
import { POLL_STATUS, POLL_TYPES } from '../utils/constants.js';
import { formatPercentage } from '../utils/formatters.js';

const SessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    currentSession,
    polls,
    participants,
    updateSession,
    updatePolls,
    addPoll,
    updatePoll,
    addParticipant
  } = useContext(SessionContext);

  const [loading, setLoading] = useState(true);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    pollType: POLL_TYPES.SINGLE_CHOICE,
    options: ['', '']
  });

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.emit('host:join', { sessionId });

  //   socket.on('participant:joined', (participant) => {
  //     addParticipant(participant);
  //   });

  //   socket.on('response:submitted', ({ response, pollId }) => {
  //     updatePoll(pollId, {
  //       responses: [...(polls.find(p => p.id === pollId)?.responses || []), response]
  //     });
  //   });

  //   socket.on('participants:list', (participantsList) => {
  //     updateSession({ ...currentSession, participants: participantsList });
  //   });

  //   return () => {
  //     socket.off('participant:joined');
  //     socket.off('response:submitted');
  //     socket.off('participants:list');
  //   };
  // }, [socket, sessionId]);

  const loadSessionData = async () => {
    try {
      const [sessionData, pollsData, participantsData] = await Promise.all([
        sessionService.getSession(sessionId),
        pollService.getSessionPolls(sessionId),
        sessionService.getParticipants(sessionId)
      ]);

      updateSession(sessionData);
      updatePolls(pollsData);
      updateSession({ ...sessionData, participants: participantsData });
    } catch (error) {
      console.error('Failed to load session:', error);
      alert('Failed to load session');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const pollData = {
        sessionId,
        title: newPoll.title,
        pollType: newPoll.pollType,
        options: newPoll.options
          .filter(opt => opt.trim())
          .map((text, idx) => ({ id: `opt${idx + 1}`, text })),
        status: POLL_STATUS.DRAFT
      };

      const createdPoll = await pollService.createPoll(pollData);
      addPoll(createdPoll);
      setShowCreateModal(false);
      setNewPoll({ title: '', pollType: POLL_TYPES.SINGLE_CHOICE, options: ['', ''] });
    } catch (error) {
      alert('Failed to create poll');
    }
  };

  const handlePublishPoll = async (pollId) => {
    try {
      await pollService.publishPoll(pollId);
      updatePoll(pollId, { status: POLL_STATUS.PUBLISHED });
      socket.emit('poll:publish', { pollId, sessionId });
    } catch (error) {
      alert('Failed to publish poll');
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      await pollService.closePoll(pollId);
      updatePoll(pollId, { status: POLL_STATUS.CLOSED });
      socket.emit('poll:close', { pollId, sessionId });
    } catch (error) {
      alert('Failed to close poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Delete this poll?')) return;
    try {
      await pollService.deletePoll(pollId);
      updatePolls(polls.filter(p => p.id !== pollId));
    } catch (error) {
      alert('Failed to delete poll');
    }
  };

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updateOption = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  const removeOption = (index) => {
    if (newPoll.options.length <= 2) return;
    setNewPoll({ ...newPoll, options: newPoll.options.filter((_, i) => i !== index) });
  };

  const selectedPoll = polls.find(p => p.id === selectedPollId);

  if (loading) {
    return <div style={styles.loading}>Loading session...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>{currentSession?.title}</h1>
          <div style={styles.sessionInfo}>
            <span style={styles.badge}>Code: {currentSession?.session_code}</span>
            <span style={styles.badge}>Participants: {participants.length}</span>
          </div>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
          + New Poll
        </button>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <h2 style={styles.panelTitle}>Polls</h2>
          {polls.length === 0 ? (
            <p style={styles.emptyText}>No polls yet. Create one to get started!</p>
          ) : (
            polls.map(poll => (
              <div
                key={poll.id}
                style={{
                  ...styles.pollItem,
                  ...(selectedPollId === poll.id ? styles.pollItemActive : {})
                }}
                onClick={() => setSelectedPollId(poll.id)}
              >
                <div style={styles.pollItemHeader}>
                  <h3 style={styles.pollItemTitle}>{poll.title}</h3>
                  <span style={getStatusStyle(poll.status)}>{poll.status}</span>
                </div>
                <div style={styles.pollItemActions}>
                  {poll.status === POLL_STATUS.DRAFT && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePublishPoll(poll.id); }}
                        style={styles.publishBtn}
                      >
                        Publish
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePoll(poll.id); }}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {poll.status === POLL_STATUS.PUBLISHED && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClosePoll(poll.id); }}
                      style={styles.closeBtn}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.centerPanel}>
          {selectedPoll ? (
            <PollResults poll={selectedPoll} />
          ) : (
            <div style={styles.emptyResults}>
              <p>Select a poll to view results</p>
            </div>
          )}
        </div>

        <div style={styles.rightPanel}>
          <h2 style={styles.panelTitle}>Participants ({participants.length})</h2>
          <div style={styles.participantList}>
            {participants.map(participant => (
              <div key={participant.id} style={styles.participantItem}>
                <div style={styles.participantAvatar}>
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={styles.participantName}>{participant.name}</div>
                  <div style={styles.participantEmail}>{participant.email}</div>
                </div>
              </div>
            ))}
            {participants.length === 0 && (
              <p style={styles.emptyText}>No participants yet</p>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Create New Poll</h2>
            <form onSubmit={handleCreatePoll}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Poll Title</label>
                <input
                  type="text"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                  style={styles.input}
                  placeholder="What's your question?"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Poll Type</label>
                <select
                  value={newPoll.pollType}
                  onChange={(e) => setNewPoll({ ...newPoll, pollType: e.target.value })}
                  style={styles.select}
                >
                  <option value={POLL_TYPES.SINGLE_CHOICE}>Single Choice</option>
                  <option value={POLL_TYPES.MULTIPLE_CHOICE}>Multiple Choice</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Options</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} style={styles.optionRow}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      style={styles.optionInput}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        style={styles.removeOptionBtn}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addOption} style={styles.addOptionBtn}>
                  + Add Option
                </button>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PollResults = ({ poll }) => {
  const totalResponses = poll.responses?.length || 0;
  const optionCounts = {};

  poll.options?.forEach(opt => {
    optionCounts[opt.id] = 0;
  });

  poll.responses?.forEach(response => {
    if (response.answer?.option_ids) {
      response.answer.option_ids.forEach(optId => {
        optionCounts[optId] = (optionCounts[optId] || 0) + 1;
      });
    }
  });

  return (
    <div style={styles.resultsContainer}>
      <h2 style={styles.resultsTitle}>{poll.title}</h2>
      <p style={styles.resultsSubtitle}>Total Responses: {totalResponses}</p>

      <div style={styles.resultsList}>
        {poll.options?.map(option => {
          const count = optionCounts[option.id] || 0;
          const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

          return (
            <div key={option.id} style={styles.resultItem}>
              <div style={styles.resultHeader}>
                <span style={styles.resultLabel}>{option.text}</span>
                <span style={styles.resultCount}>
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
              <div style={styles.resultBar}>
                <div
                  style={{
                    ...styles.resultBarFill,
                    width: `${percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionPage;