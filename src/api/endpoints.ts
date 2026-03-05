/* eslint-disable @stylistic/key-spacing */
import { useDateFormat } from '@vueuse/core'
import { createRequest as createRequest, DELETE, GET, POST, PUT } from '$src/api/api'

export function authRegisterRequest(body: RegisterRequest) {
  return createRequest<AuthResponse, ApiError, RegisterRequest>(
    POST,
    '/api/auth/register',
    body,
  )
}

export function authLoginRequest(body: LoginRequest) {
  return createRequest<AuthResponse, ApiError, LoginRequest>(
    POST,
    '/api/auth/login',
    body,
  )
}

export function authVerifyRequest(body: VerifyRequest) {
  return createRequest<MessageResponse, ApiError, VerifyRequest>(
    POST,
    '/api/auth/verify',
    body,
  )
}

export function authEmailSendResetPasswordRequest(body: SendResetPasswordRequest) {
  return createRequest<MessageResponse, ApiError, SendResetPasswordRequest>(
    POST,
    '/api/auth/email/send-reset-password',
    body,
  )
}

export function authResetPasswordRequest(body: ResetPasswordRequest) {
  return createRequest<MessageResponse, ApiError, ResetPasswordRequest>(
    POST,
    '/api/auth/reset-password',
    body,
  )
}

export function authGoogleRedirectRequest(body: GoogleRedirectRequest) {
  return createRequest<UrlResponse, ApiError, GoogleRedirectRequest>(
    POST,
    '/api/auth/google/redirect',
    body,
  )
}

export function getAuthGoogleCallbackRequest(queryParams: string) {
  return createRequest<AuthResponse, ApiError>(
    GET,
    `/api/auth/google/callback${queryParams}`,
  )
}

export function authEmailSendVerificationRequest(body: SendVerificationRequest) {
  return createRequest<MessageResponse, ApiError, SendVerificationRequest>(
    POST,
    '/api/auth/email/send-verification',
    body,
  )
}

export function authLogoutRequest() {
  return createRequest<MessageResponse, ApiError>(
    POST,
    '/api/auth/logout',
  )
}

export function getUserRequest() {
  return createRequest<User, ApiError>(
    GET,
    '/api/user',
  )
}

export function getWeightedProductsRequest() {
  return createRequest<WeightedProduct[], ApiError>(
    GET,
    '/api/weighted-products',
  )
}

export function getWeightedProductRequest(id: number) {
  return createRequest<WeightedProduct, ApiError>(
    GET,
    `/api/weighted-products/${id}`,
  )
}

export function removeWeightedProductRequest(id: number) {
  return createRequest<undefined, ApiError>(
    DELETE,
    `/api/weighted-products/${id}`,
  )
}

export function getConsumablesRequest(date?: Date) {
  const formatted = useDateFormat(date, 'YYYY-MM-DD').value
  const query = formatted ? `?record_date=${formatted}` : ''
  return createRequest<Consumable[], ApiError>(
    GET,
    `/api/consumables${query}`,
  )
}

export function test() {
  return createRequest<string, ApiError>(
    GET,
    '/api',
  )
}

export function createConsumableRequest(body: StoreConsumableRequest) {
  return createRequest<Consumable, ApiError, StoreConsumableRequest>(
    POST,
    '/api/consumables',
    body,
  )
}

export function getConsumableRequest(id: number) {
  return createRequest<Consumable, ApiError>(
    GET,
    `/api/consumables/${id}`,
  )
}

export function updateConsumableRequest(id: number, body: UpdateConsumableRequest) {
  return createRequest<Consumable, ApiError<ConsumableError>, UpdateConsumableRequest>(
    PUT,
    `/api/consumables/${id}`,
    body,
  )
}

export function removeConsumableRequest(id: number) {
  return createRequest<undefined, ApiError>(
    DELETE,
    `/api/consumables/${id}`,
  )
}

export function getExercisesRequest(date?: Date) {
  const formatted = useDateFormat(date, 'YYYY-MM-DD').value
  const query = formatted ? `?record_date=${formatted}` : ''
  return createRequest<Exercise[], ApiError>(
    GET,
    `/api/exercises${query}`,
  )
}

export function createExerciseRequest(body: StoreExerciseRequest) {
  return createRequest<Exercise, ApiError, StoreExerciseRequest>(
    POST,
    '/api/exercises',
    body,
  )
}

export function getExerciseRequest(id: number) {
  return createRequest<Exercise, ApiError>(
    GET,
    `/api/exercises/${id}`,
  )
}

export function updateExerciseRequest(id: number, body: UpdateExerciseRequest) {
  return createRequest<Exercise, ApiError, UpdateExerciseRequest>(
    PUT,
    `/api/exercises/${id}`,
    body,
  )
}

export function removeExerciseRequest(id: number) {
  return createRequest<undefined, ApiError>(
    DELETE,
    `/api/exercises/${id}`,
  )
}

export function getDatesRequest(params?: DateFilters) {
  const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
  return createRequest<Record<string, string[]>, ApiError>(
    GET,
    `/api/dates${query}`,
  )
}

export function removeDatesRequest(body: DateFilters) {
  return createRequest<undefined, ApiError, DateFilters>(
    DELETE,
    '/api/dates',
    body,
  )
}

export function getAdminStatsRequest() {
  return createRequest<MessageResponse, ApiError>(
    GET,
    '/api/admin/stats',
  )
}

export function getSettingsRequest() {
  return createRequest<Settings, ApiError>(
    GET,
    '/api/settings',
  )
}

export function updateSettingsRequest() {
  return createRequest<Settings, ApiError>(
    PUT,
    '/api/settings',
  )
}


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
  updateExercise            : (id: number, body: UpdateExerciseRequest) => createRequest<Exercise, ApiError, UpdateExerciseRequest>(PUT, `/api/exercises/${id}`, body),
  removeExercise            : (id: number) => createRequest<undefined, ApiError>(DELETE, `/api/exercises/${id}`),
  removeDates               : (body: DateFilters) => createRequest<undefined, ApiError, DateFilters>(DELETE, '/api/dates', body),
  getAdminStats             : () => createRequest<MessageResponse, ApiError>(GET, '/api/admin/stats'),
  getSettings               : () => createRequest<Settings, ApiError>(GET, '/api/settings'),
  updateSettings            : (body: Partial<Settings>) => createRequest<Settings, ApiError, Partial<Settings>>(PUT, '/api/settings', body),
}
