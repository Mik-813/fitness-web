/* eslint-disable @stylistic/space-in-parens */
/* eslint-disable @stylistic/no-multi-spaces */
/* eslint @stylistic/key-spacing: ["warn", { "align": "colon" }] */
import { useDateFormat } from '@vueuse/core'
import { createEdbRequest, createRequest as createRequest, DELETE, GET, POST, PUT } from '$src/api/api'

export const endpoints = {
  getExercises              : (date?: Date                              ) => createRequest<Exercise[], ApiError>(                                          GET,    `/api/exercises?${`record_date=${useDateFormat(date, 'YYYY-MM-DD').value}`}`),
  getDates                  : (params?: DateFilters                     ) => createRequest<Record<string, string[]>, ApiError>(                            GET,    `/api/dates?${new URLSearchParams(params as any).toString()}`),
  getConsumables            : (date?: Date                              ) => createRequest<Consumable[], ApiError>(                                        GET,    `/api/consumables?${`record_date=${useDateFormat(date, 'YYYY-MM-DD').value}`}`),
  authRegister              : (body: AuthRequest                        ) => createRequest<AuthResponse, ApiError, AuthRequest>(                           POST,   '/api/auth/register', body),
  authLogin                 : (body: AuthRequest                        ) => createRequest<AuthResponse, ApiError, AuthRequest>(                           POST,   '/api/auth/login', body),
  authVerify                : (body: VerifyRequest                      ) => createRequest<MessageResponse, ApiError, VerifyRequest>(                      POST,   '/api/auth/verify', body),
  authEmailSendResetPassword: (body: SendResetPasswordRequest           ) => createRequest<MessageResponse, ApiError, SendResetPasswordRequest>(           POST,   '/api/auth/email/send-reset-password', body),
  authResetPassword         : (body: ResetPasswordRequest               ) => createRequest<MessageResponse, ApiError, ResetPasswordRequest>(               POST,   '/api/auth/reset-password', body),
  authGoogleRedirect        : (body: GoogleRedirectRequest              ) => createRequest<GoogleRedirectResponse, ApiError, GoogleRedirectRequest>(       POST,   '/api/auth/google/redirect', body),
  authGooglePending         : (body: GooglePendingRequest               ) => createRequest<GooglePendingResponse, ApiError, GooglePendingRequest>(         POST,   '/api/auth/google/pending', body),
  getAuthGoogleCallback     : (queryParams: string                      ) => createRequest<AuthResponse, ApiError>(                                        GET,    `/api/auth/google/callback${queryParams}`),
  authEmailSendVerification : (body: SendVerificationRequest            ) => createRequest<MessageResponse, ApiError, SendVerificationRequest>(            POST,   '/api/auth/email/send-verification', body),
  authLogout                : (                                         ) => createRequest<MessageResponse, ApiError>(                                     POST,   '/api/auth/logout').intercept(() => localStorage.removeItem('token')),
  getUser                   : (                                         ) => createRequest<User, ApiError>(                                                GET,    '/api/user'),
  getWeightedProducts       : (                                         ) => createRequest<WeightedProduct[], ApiError>(                                   GET,    '/api/weighted-products'),
  getWeightedProduct        : (id: number                               ) => createRequest<WeightedProduct, ApiError>(                                     GET,    `/api/weighted-products/${id}`),
  removeWeightedProduct     : (id: number                               ) => createRequest<undefined, ApiError>(                                           DELETE, `/api/weighted-products/${id}`),
  createConsumable          : (body: StoreConsumableRequest             ) => createRequest<Consumable, ApiError, StoreConsumableRequest>(                  POST,   '/api/consumables', body),
  getConsumable             : (id: number                               ) => createRequest<Consumable, ApiError>(                                          GET,    `/api/consumables/${id}`),
  updateConsumable          : (id: number, body: UpdateConsumableRequest) => createRequest<Consumable, ApiError<ConsumableError>, UpdateConsumableRequest>(PUT,    `/api/consumables/${id}`, body),
  removeConsumable          : (id: number                               ) => createRequest<undefined, ApiError>(                                           DELETE, `/api/consumables/${id}`),
  createExercise            : (body: StoreExerciseRequest               ) => createRequest<Exercise, ApiError, StoreExerciseRequest>(                      POST,   '/api/exercises', body),
  getExercise               : (id: number                               ) => createRequest<Exercise, ApiError>(                                            GET,    `/api/exercises/${id}`),
  updateExercise            : (id: number, body: Exercise               ) => createRequest<Exercise, ApiError, Exercise>(                                  PUT,    `/api/exercises/${id}`, body),
  removeExercise            : (id: number                               ) => createRequest<undefined, ApiError>(                                           DELETE, `/api/exercises/${id}`),
  removeDates               : (body: DateFilters                        ) => createRequest<undefined, ApiError, DateFilters>(                              DELETE, '/api/dates', body),
  getAdminStats             : (                                         ) => createRequest<MessageResponse, ApiError>(                                     GET,    '/api/admin/stats'),
  getSettings               : (                                         ) => createRequest<Settings, ApiError>(                                            GET,    '/api/settings'),
  updateSettings            : (body: Partial<Settings>                  ) => createRequest<Settings, ApiError, Partial<Settings>>(                         PUT,    '/api/settings', body),
  generateNutrition         : (body: ProductGenerator                   ) => createRequest<Omit<Product, 'user_id'>, ApiError, ProductGenerator>(          POST,   '/api/products/generate-nutrition', body),
  getFilteredDbExericises   : (filters: ExerciseFilters                 ) => createEdbRequest<DbExercisesPage, ApiError>(                                  GET,    `/api/v1/exercises/filter?${new URLSearchParams(filters as Record<string, any>).toString()}`),
}
