import { useAsyncState, type UseAsyncStateReturn, type UseAsyncStateOptions } from '@vueuse/core'
import { type UnwrapRef, type MaybeRef, ref, type Ref } from 'vue'

interface StateExtension<TErr, TDat> {
  error: TErr
  data: TDat
}

type AsyncRef<T> = Ref<T | UnwrapRef<T> | UnwrapRef<T | UnwrapRef<T>>>

export function refAsync<State extends StateExtension<TErr, TDat>, TErr, TDat, Params extends any[] = any[], Shallow extends boolean = true>(
  promise: Promise<State & StateExtension<TErr, TDat>> | ((...args: Params) => Promise<State & StateExtension<TErr, TDat>>),
  initialData: MaybeRef<TDat> = undefined as TDat,
  initialError: MaybeRef<TErr> = undefined as TErr,
  options?: UseAsyncStateOptions<Shallow, State>,
) {
  const result = useAsyncState<State, Params, Shallow>(
    promise, 
    { 
      data: initialData,
      error: initialError,
    } as State,
    options,
  )
  let data = ref(result.state.value.data)
  let error = ref(result.state.value.error)
  if (data.value && error.value) {
    data.value = data.value!
    error.value = error.value!
    return {
      ...result,
      data,
      error, 
    } as UseAsyncStateReturn<State, Params, Shallow> & {
      data: AsyncRef<NonNullable<TDat>>
      error: AsyncRef<NonNullable<TErr>>
    } 
  }
  if (data.value) {
    data.value = data.value!
    return {
      ...result,
      data,
      error, 
    } as UseAsyncStateReturn<State, Params, Shallow> & {
      data: AsyncRef<NonNullable<TDat>>
      error: AsyncRef<TErr>
    } 
  }
  if (error.value) {
    error.value = error.value!
    return {
      ...result,
      data,
      error, 
    } as UseAsyncStateReturn<State, Params, Shallow> & {
      data: AsyncRef<TDat>
      error: AsyncRef<NonNullable<TErr>>
    }
  }
  
  return {
    ...result,
    data,
    error, 
  } as UseAsyncStateReturn<State, Params, Shallow> & {
    data: AsyncRef<TDat>
    error: AsyncRef<TErr>
  } 
}
