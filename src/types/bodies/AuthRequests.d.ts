interface AuthRequest {
  email: string
  password: string
  recaptcha_token: string
}

interface VerifyRequest { token: string, }

interface SendResetPasswordRequest {
  email: string
  url: string
}

interface ResetPasswordRequest {
  token: string
  password: string
}

interface GoogleRedirectRequest { recaptcha_token: string, }
interface GooglePendingRequest { session_id: string, }

interface SendVerificationRequest { url: string, }
