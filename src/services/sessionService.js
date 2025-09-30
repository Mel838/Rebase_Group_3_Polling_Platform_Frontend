import api from './api.js';

export const sessionService = {
  async createSession(data) {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  async getSessions() {
    const response = await api.get('/sessions');
    return response.data;
  },

  async getSession(sessionId) {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  async updateSession(sessionId, data) {
    const response = await api.patch(`/sessions/${sessionId}`, data);
    return response.data;
  },

  async deleteSession(sessionId) {
    await api.delete(`/sessions/${sessionId}`);
  },

  async joinSession(sessionCode) {
    const response = await api.get(`/sessions/join/${sessionCode}`);
    return response.data;
  },

  async getParticipants(sessionId) {
    const response = await api.get(`/participants/session/${sessionId}`);
    return response.data;
  }
};