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
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import type { Repositories, UserDetail } from "~/types/api"
import { http } from "~/utils/http"
import { tryCatch } from "~/utils/try-catch"
import type { Route } from "./+types/detail"
import { useNavigate } from "react-router"

export async function loader({ params }: Route.LoaderArgs) {
  const userPromise = tryCatch<UserDetail, AxiosError<{ message: string }>>(
    http.get(`users/${params.username}`).then((r) => r.data)
  )
  const repoPromise = tryCatch<Repositories[], AxiosError<{ message: string }>>(
    http
      .get(`users/${params.username}/repos?sort=updated&per_page=10`)
      .then((r) => r.data)
  )

  const [[user, userError], [repositories, repositoriesError]] =
    await Promise.all([userPromise, repoPromise])
  const errors = [userError, repositoriesError].filter(Boolean)

  return {
    user,
    repositories,
    errors: Array.from(new Set(errors)),
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      HTML: "bg-red-500",
      CSS: "bg-blue-400",
    }
    return colors[language] || "bg-gray-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <main className="max-w-6xl mx-auto mb-12 p-4">
      {!!loaderData.errors.length && (
        <Alert variant="destructive" className="mb-4">
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
                <p className="text-lg text-gray-100 mb-4">
                  {loaderData.user?.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{loaderData.user?.followers} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{loaderData.user?.following} following</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>{loaderData.user?.public_repos} repositories</span>
                </div>
                {loaderData.user?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{loaderData.user?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {formatDate(loaderData.user?.created_at || "")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={() => window.open(loaderData.user?.html_url, "_blank")}
              >
                <Github className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              {loaderData.user?.blog && (
                <a
                  href={
                    loaderData.user?.blog.startsWith("http")
                      ? loaderData.user?.blog
                      : `https://${loaderData.user?.blog}`
                  }
                  target="_blank"
                >
                  <Button variant="outline" className="text-muted">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Repositories */}
      {loaderData.repositories?.length && (
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Book className="h-6 w-6 text-blue-400" />
            <h3 className="text-2xl font-bold">Recent Repositories</h3>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {loaderData.repositories?.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loaderData.repositories?.map((repo) => (
              <Card
                key={repo.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
              >
                <CardContent className="px-6 py-2">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-400">
                      {repo.name}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white p-1"
                      onClick={() => window.open(repo.html_url, "_blank")}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
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
        </div>
      )}
    </main>
  )
}
