import type { AxiosError } from "axios"

type Success<T> = [T, null]
type Failed<E> = [null, string]
type Result<T, E = AxiosError> = Success<T> | Failed<E>

export const tryCatch = async <T, E = AxiosError>(
  promise: Promise<T>
): Promise<Result<T, E>> => {
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ message: string }>).response?.data.message ||
      "Unknown Error!"
    return [null, errorMessage]
  }
}
