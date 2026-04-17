/* eslint-disable @stylistic/key-spacing */
import { useDateFormat } from '@vueuse/core'
import { createEdbRequest, createRequest as createRequest, DELETE, GET, POST, PUT } from '$src/api/api'

export const endpoints = {
  getExercises: (date?: Date) => {
    const formatted = useDateFormat(date, 'YYYY-MM-DD').value
    const query = formatted ? `?record_date=${formatted}` : ''
    return createRequest<Exercise[], ApiError>(
      GET,
      `/api/exercises${query}`,
    )
  },
  getDates: (params?: DateFilters) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return createRequest<Record<string, string[]>, ApiError>(
      GET,
      `/api/dates${query}`,
    )
  },
  getConsumables: (date?: Date) => {
    const formatted = useDateFormat(date, 'YYYY-MM-DD').value
    const query = formatted ? `?record_date=${formatted}` : ''
    return createRequest<Consumable[], ApiError>(
      GET,
      `/api/consumables${query}`,
    )
  },
  authRegister              : (body: RegisterRequest) => createRequest<AuthResponse, ApiError, RegisterRequest>(POST, '/api/auth/register', body),
  authLogin                 : (body: LoginRequest) => createRequest<AuthResponse, ApiError, LoginRequest>(POST, '/api/auth/login', body),
  authVerify                : (body: VerifyRequest) => createRequest<MessageResponse, ApiError, VerifyRequest>(POST, '/api/auth/verify', body),
  authEmailSendResetPassword: (body: SendResetPasswordRequest) => createRequest<MessageResponse, ApiError, SendResetPasswordRequest>(POST, '/api/auth/email/send-reset-password', body),
  authResetPassword         : (body: ResetPasswordRequest) => createRequest<MessageResponse, ApiError, ResetPasswordRequest>(POST, '/api/auth/reset-password', body),
  authGoogleRedirect        : (body: GoogleRedirectRequest) => createRequest<UrlResponse, ApiError, GoogleRedirectRequest>(POST, '/api/auth/google/redirect', body),
  getAuthGoogleCallback     : (queryParams: string) => createRequest<AuthResponse, ApiError>(GET, `/api/auth/google/callback${queryParams}`),
  authEmailSendVerification : (body: SendVerificationRequest) => createRequest<MessageResponse, ApiError, SendVerificationRequest>(POST, '/api/auth/email/send-verification', body),
  authLogout                : () => createRequest<MessageResponse, ApiError>(POST, '/api/auth/logout'),
  getUser                   : () => createRequest<User, ApiError>(GET, '/api/user'),
  getWeightedProducts       : () => createRequest<WeightedProduct[], ApiError>(GET, '/api/weighted-products'),
  getWeightedProduct        : (id: number) => createRequest<WeightedProduct, ApiError>(GET, `/api/weighted-products/${id}`),
  removeWeightedProduct     : (id: number) => createRequest<undefined, ApiError>(DELETE, `/api/weighted-products/${id}`),
  createConsumable          : (body: StoreConsumableRequest) => createRequest<Consumable, ApiError, StoreConsumableRequest>(POST, '/api/consumables', body),
  getConsumable             : (id: number) => createRequest<Consumable, ApiError>(GET, `/api/consumables/${id}`),
  updateConsumable          : (id: number, body: UpdateConsumableRequest) => createRequest<Consumable, ApiError<ConsumableError>, UpdateConsumableRequest>(PUT, `/api/consumables/${id}`, body),
  removeConsumable          : (id: number) => createRequest<undefined, ApiError>(DELETE, `/api/consumables/${id}`),
  createExercise            : (body: StoreExerciseRequest) => createRequest<Exercise, ApiError, StoreExerciseRequest>(POST, '/api/exercises', body),
  getExercise               : (id: number) => createRequest<Exercise, ApiError>(GET, `/api/exercises/${id}`),
  updateExercise            : (id: number, body: Exercise) => createRequest<Exercise, ApiError, Exercise>(PUT, `/api/exercises/${id}`, body),
  removeExercise            : (id: number) => createRequest<undefined, ApiError>(DELETE, `/api/exercises/${id}`),
  removeDates               : (body: DateFilters) => createRequest<undefined, ApiError, DateFilters>(DELETE, '/api/dates', body),
  getAdminStats             : () => createRequest<MessageResponse, ApiError>(GET, '/api/admin/stats'),
  getSettings               : () => createRequest<Settings, ApiError>(GET, '/api/settings'),
  updateSettings            : (body: Partial<Settings>) => createRequest<Settings, ApiError, Partial<Settings>>(PUT, '/api/settings', body),
}

export const edbApi = {
  getExercise               : (id: number) => createEdbRequest<Exercise, ApiError>(GET, `/api/v1/exercises/${id}`),
  searchExercises           : (query: string) => createEdbRequest<Exercise[], ApiError>(GET, `/api/v1/exercises/search?query=${query}`),
}
