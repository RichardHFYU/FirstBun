export const API_ROUTES = {
  AGENTS: '/api/v1/agents',
  EVENTS: '/api/v1/events'
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const 