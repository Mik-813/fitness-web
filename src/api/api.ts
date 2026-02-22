import axios, { type Method, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { reactive, ref, type UnwrapRef } from 'vue'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = token)
    config.headers.Authorization = 'Bearer 3|aEwk0lKEb7EXnHtCd1AZoyF7kS7hjLNYPFu8nMLK293712b5'
    return config
  },
  async (error) => Promise.reject(error),
)

export const createRequest = <TRes, TErr, TBody = void>(
  method: Method,
  url: string,
  body?: TBody, 
) => {
  const listeners = {
    success: [] as ((data: TRes) => void)[],
    error: [] as ((err: TErr) => void)[],
    finish: [] as (() => void)[],
  }

  const _execute = async (overrideBody?: TBody) => {
    let data: TRes | undefined = undefined
    let error: TErr | undefined = undefined

    try {
      const res = await api.request<TRes>({
        method,
        url,
        data: overrideBody ?? body,
      })
      data = res.data
      listeners.success.forEach((cb) => cb(data!))
    }
    catch (_err) {
      const err = _err as AxiosError<TErr>
      if (!(axios.isAxiosError(err) && err.response)) {
        // we can't throw, since we need to return the object, using console.error as an alternative
        // eslint-disable-next-line no-console
        console.error(_err)
        error = { message: 'Unknown error' } as unknown as TErr
      }
      else {
        error = err.response.data as TErr
      }
      listeners.error.forEach((cb) => cb(error!))
    }
    finally {
      listeners.finish.forEach((cb) => cb())
    }
    return {
      data,
      error, 
    }
  }

  return {
    invoke: async (overrideBody?: TBody) => _execute(overrideBody),

    invoke3: async (overrideBody?: TBody): Promise<TRes> => {
      const { data, error } = await _execute(overrideBody)
      if (error) {
        throw error
      }
      return data!
    },

    use: <TDefData>(defaultData: TDefData) => {
      const data = ref<TRes | TDefData>(defaultData)
      const error = ref<TErr | undefined>()
      const isLoading = ref(false)
      const isReady = ref(false)

      const execute = async (newBody?: TBody) => {
        isLoading.value = true
        error.value = undefined
        
        const res = await _execute(newBody)
        
        if (res.data) {
          data.value = res.data as UnwrapRef<TRes | TDefData>
          isReady.value = true
        }
        if (res.error) error.value = res.error
        isLoading.value = false
        return res
      }

      const mutate = async (
        optimisticData: TRes, 
        updaterFn?: () => Promise<unknown>,
        refetch = false,
      ): Promise<boolean> => {
        const oldData = data.value
        data.value = optimisticData as UnwrapRef<TRes | TDefData>
        
        try {
          if (updaterFn) {
            await updaterFn()
          }

          if (refetch) {
            const { error: fetchError } = await execute()
            if (fetchError) return false
          }
          return true
        }
        catch (err) {
          data.value = oldData
          error.value = err as TErr
          return false
        }
      }

      execute()

      return reactive({
        data,      
        error,
        isLoading,
        isReady,
        execute,
        mutate,     
      })
    },
  }
}
