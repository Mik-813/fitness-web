interface AuthResponse {
  user: User
  token: string
}

interface MessageResponse { message: string, }

interface GoogleRedirectResponse {
  url: string
  session_id: string
}

interface GooglePendingResponse {
  message?: string
  token: string
}
