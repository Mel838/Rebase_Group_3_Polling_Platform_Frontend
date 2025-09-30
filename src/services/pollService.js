import api from './api.js';

export const pollService = {
  async createPoll(data) {
    const response = await api.post('/polls', data);
    return response.data;
  },

  async getSessionPolls(sessionId) {
    const response = await api.get(`/polls/session/${sessionId}`);
    return response.data;
  },

  async updatePoll(pollId, data) {
    const response = await api.patch(`/polls/${pollId}`, data);
    return response.data;
  },

  async publishPoll(pollId) {
    const response = await api.patch(`/polls/${pollId}/publish`);
    return response.data;
  },

  async closePoll(pollId) {
    const response = await api.patch(`/polls/${pollId}/close`);
    return response.data;
  },

  async deletePoll(pollId) {
    await api.delete(`/polls/${pollId}`);
  },

  async getPollResults(pollId) {
    const response = await api.get(`/polls/${pollId}/results`);
    return response.data;
  }
};