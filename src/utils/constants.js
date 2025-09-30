export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export const POLL_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  OPEN_ENDED: 'open_ended',
  RATING: 'rating',
  SLIDER: 'slider'
};

export const POLL_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SESSION: '/session/:sessionId',
  PARTICIPANT_JOIN: '/join',
  PARTICIPANT_SESSION: '/p/:sessionCode'
};