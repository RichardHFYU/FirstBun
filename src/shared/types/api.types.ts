export interface ApiResponse<T> {
  data?: T
  error?: string
  statusCode: number
}

export interface AgentResponse {
  agent_id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  address?: string
}

export interface EventResponse {
  id: string
  title: string
  date: string
} 