import { http } from "~/utils/http"
import type { Route } from "./+types/pagination"
import { tryCatch } from "~/utils/try-catch"
import type { Repositories } from "~/types/api"
import type { AxiosError } from "axios"

export async function loader({ request }: Route.LoaderArgs) {
  const endpoint = request.headers.get("endpoint") || ""
  const [repositories, error] = await tryCatch<Repositories[]>(
    http.get(endpoint).then((r) => r.data)
  )
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status: 400 })
  }

  return repositories
}
