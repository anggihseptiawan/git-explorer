import type { AxiosError } from "axios"
import {
  ArrowLeft,
  Book,
  Calendar,
  GitFork,
  Github,
  LinkIcon,
  MapPin,
  Star,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import type { Repositories, UserDetail } from "~/types/api"
import { http } from "~/utils/http"
import { tryCatch } from "~/utils/try-catch"
import type { Route } from "./+types/detail"
import { useState } from "react"
import { formatDate } from "~/utils/format-date"
import { getLanguageColor } from "~/utils/get-language-color"
import axios from "axios"
import { toast } from "sonner"

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Git Explorer | ${params.username}` },
    { name: "description", content: "Welcome to Git Explorer!" },
  ]
}

export async function loader({ params }: Route.LoaderArgs) {
  const userPromise = tryCatch<UserDetail>(
    http.get(`users/${params.username}`).then((r) => r.data)
  )
  const endpoint = `users/${params.username}/repos?sort=updated&page=1&per_page=15`
  const repoPromise = tryCatch<Repositories[]>(
    http.get(endpoint).then((r) => r.data)
  )

  const [[user, userError], [repositories, repositoriesError]] =
    await Promise.all([userPromise, repoPromise])
  const errors = [userError, repositoriesError].filter(Boolean)

  return {
    user,
    repositories,
    errors: Array.from(new Set(errors)),
    username: params.username,
  }
}

type PaginationState = {
  currentPage: number
  perPage: number
  loading: "idle" | "next" | "previous"
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const [repositories, setRepositories] = useState(loaderData.repositories)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    perPage: 15,
    loading: "idle",
  })

  async function handlePageChange(goto: "next" | "previous") {
    const { currentPage, perPage } = paginationState
    const targetPage = goto === "next" ? currentPage + 1 : currentPage - 1
    const endpoint = `users/${loaderData.username}/repos?sort=updated&page=${targetPage}&per_page=${perPage}`

    setPaginationState((prev) => ({ ...prev, loading: goto }))
    const [repositories, error] = await tryCatch<Repositories[]>(
      axios
        .get("/api/pagination", { headers: { endpoint } })
        .then((r) => r.data)
    )
    if (error) toast(error)
    setPaginationState((prev) => ({
      ...prev,
      currentPage: targetPage,
      loading: "idle",
    }))
    setRepositories(repositories)
  }

  return (
    <main className="max-w-6xl mx-auto mb-12 p-4">
      {!!loaderData.errors.length && (
        <Alert variant="destructive" className="border-red-500 mb-4">
          <AlertDescription>
            <ul>
              {loaderData.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to search results
      </Button>

      <Card className="bg-gradient-to-r from-blue-600 to-blue-900 text-white mb-8">
        <CardHeader className="">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-white/20">
              <AvatarImage
                src={loaderData.user?.avatar_url}
                alt={loaderData.user?.login}
              />
              <AvatarFallback className="bg-gray-600 text-2xl">
                {loaderData.user?.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold">
                  {loaderData.user?.name || loaderData.user?.login}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white w-fit"
                >
                  @{loaderData.user?.login}
                </Badge>
              </div>

              {loaderData.user?.bio && (
                <p className="text-lg text-gray-300 mb-4">
                  {loaderData.user?.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {Number(loaderData.user?.followers || 0).toLocaleString()}{" "}
                    followers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {Number(loaderData.user?.following || 0).toLocaleString()}{" "}
                    following
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>
                    {Number(
                      loaderData.user?.public_repos || 0
                    ).toLocaleString()}{" "}
                    repositories
                  </span>
                </div>
                {loaderData.user?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {loaderData.user?.location === "undefined"
                        ? "-"
                        : loaderData.user.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {loaderData.user?.created_at
                      ? formatDate(loaderData.user?.created_at)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a href={loaderData.user?.html_url || "#"} target="_blank">
                <Button
                  variant="secondary"
                  className="cursor-pointer bg-white/20 hover:bg-white/30 text-white"
                >
                  <Github className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
              </a>
              {loaderData.user?.blog && (
                <a
                  href={
                    loaderData.user?.blog.startsWith("http")
                      ? loaderData.user?.blog
                      : `https://${loaderData.user?.blog}`
                  }
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    className="cursor-pointer text-black w-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Website
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Repositories */}
      {!!repositories?.length ? (
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Book className="h-6 w-6 text-blue-400" />
            <h3 className="text-2xl font-bold">Recent Repositories</h3>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {repositories?.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {repositories?.map((repo) => (
              <Card
                key={repo.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
              >
                <CardContent className="px-6 py-2">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-400">
                      {repo.name}
                    </h4>
                    <a href={repo.html_url} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-gray-400 p-1"
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>

                  {repo.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-400"
                        >
                          +{repo.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      {repo.language ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getLanguageColor(
                              repo.language
                            )}`}
                          ></div>
                          <span>{repo.language}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Updated {formatDate(repo.updated_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => handlePageChange("previous")}
              disabled={paginationState.currentPage === 1}
            >
              {paginationState.loading === "previous"
                ? "Loading.."
                : "Previous"}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => handlePageChange("next")}
            >
              {paginationState.loading === "next" ? "Loading.." : "Next"}
            </Button>
          </div>
        </div>
      ) : (
        <Alert>
          <AlertDescription>No repositories found!</AlertDescription>
        </Alert>
      )}
    </main>
  )
}
