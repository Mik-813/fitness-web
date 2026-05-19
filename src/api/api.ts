import axios, { type Method, type AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios'
import { reactive, ref, type UnwrapRef } from 'vue'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

export const api = axios.create({
  baseURL: `${import.meta.env.APP_URL}${import.meta.env.APP_PORT ? `:${import.meta.env.APP_PORT}` : ''}`,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = token)
    return config
  },
  async (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // should be dynamically imported, because "settings" is a top level component which needs additional time to load
      import('$src/router').then(({ default: router }) => {
        router.push('/')
      })
      return new Promise(() => {})
    }
    return Promise.reject(error)
  },
)

export const createEdbRequest = <TRes, TErr, TBody = void>(
  method: Method,
  url: string,
  body?: TBody,
) => createRequest<TRes, TErr, TBody>(
  method,
  url,
  body,
  api,
)

export const createRequest = <TRes, TErr, TBody = void>(
  method: Method,
  url: string,
  body?: TBody,
  axiosInstance?: AxiosInstance,
) => {
  interface Response<TMuteRes, TMuteErr> {
    data: TMuteRes | undefined
    error: TMuteErr | undefined
  }

  const listeners = {
    success: [] as ((data: TRes) => void)[],
    error: [] as ((err: TErr) => void)[],
    finish: [] as (() => void)[],
  }

  const _execute = async (overrideBody?: TBody) => {
    let data: TRes | undefined = undefined
    let error: TErr | undefined = undefined

    try {
      const res = await (axiosInstance ?? api).request<TRes>({
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
  interface Options<TMuteRes, TMuteErr> {
    data?: TMuteRes | (TRes | undefined)
    request?: (() => Promise<Response<TMuteRes, TMuteErr>>) | undefined
    onSuccess?: (data: TMuteRes | TRes) => void
    onError?: (error: TMuteErr | TErr) => void
    onFinish?: (data?: TMuteRes | TRes, error?: TMuteErr | TErr) => void
    refetch?: boolean
    debounce?: number
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

    use: <TDefData>(defaultData: TDefData, requestOnInit = true) => {
      const data = ref<TRes | TDefData>(defaultData)
      const error = ref<TErr | undefined>()
      const isLoading = ref(false)
      const isReady = ref(false)

      const execute = async (newBody?: TBody) => {
        isLoading.value = true
        isReady.value = false
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

      async function executeMutation<TMuteRes, TMuteErr>(options: Options<TMuteRes, TMuteErr>) {
        let response: Response<TRes | TMuteRes, TErr | TMuteErr> = {
          data: undefined,
          error: undefined, 
        }
    
        try {
          if (options.request) {
            response = await options.request()
            if (response.error) throw response.error
          }
    
          if (options.refetch) {
            response = await execute()
            if (response.error) throw response.error
          }
          options.onSuccess?.(response.data!)
        }
        catch (_err) {
          const err = _err as TErr
          error.value = err
          response.error = err
          options.onError?.(err)
        }
        finally {
          options.onFinish?.(response.data, response.error)
        }
      }

      let timeoutId: ReturnType<typeof setTimeout>

      const mutate = <TMuteRes, TMuteErr>(options: Options<TMuteRes, TMuteErr>) => {
        options.data && (data.value = options.data as UnwrapRef<TRes | TDefData>)

        if (options.debounce) {
          clearTimeout(timeoutId)

          timeoutId = setTimeout(
            async () => executeMutation(options),
            options.debounce,
          )
        }
        else {
          executeMutation(options)
        }
      }

      requestOnInit && execute()

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
