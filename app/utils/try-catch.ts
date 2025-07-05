import type { AxiosError } from "axios"

type Success<T> = [T, null]
type Failed = [null, string]
type Result<T> = Success<T> | Failed

export const tryCatch = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ message: string }>).response?.data.message ||
      "Unknown Error!"
    console.log(error)
    return [null, errorMessage]
  }
}
