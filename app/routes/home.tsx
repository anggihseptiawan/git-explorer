import { Input } from "~/components/ui/input"
import type { Route } from "./+types/home"
import { Github, Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Form, href, Link, useNavigation } from "react-router"
import { tryCatch } from "~/utils/try-catch"
import { http } from "~/utils/http"
import type { UserList } from "~/types/api"
import { AxiosError } from "axios"
import { Card, CardContent } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Alert, AlertDescription } from "~/components/ui/alert"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Git Explorer" },
    { name: "description", content: "Welcome to Git Explorer!" },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url)
  const user = searchParams.get("user")
  if (!user) return { user: "", users: null, error: null }

  const [users, error] = await tryCatch<UserList>(
    http.get(`search/users?q=${user}&per_page=5`).then((r) => r.data)
  )
  return { user, users, error }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation()

  return (
    <>
      <header className="px-4 py-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Git Explorer</h1>
        <p className="text-center">
          Discover GitHub users and explore their repositories with detailed
          insights
        </p>
      </header>
      <main className="p-4 sm:w-3/4 mx-auto">
        <div className="relative sm:w-3/4 mx-auto mb-20">
          <Form action="/" method="get">
            <Search
              className="absolute top-3.5 left-4 text-gray-400"
              size={22}
            />
            <Input
              placeholder="Find a user"
              className="pl-11 py-6 absolute inset-0"
              name="user"
              defaultValue={loaderData.user || ""}
            />
            <Button
              type="submit"
              className="absolute right-1 top-[7px] cursor-pointer"
              disabled={navigation.state === "loading"}
            >
              {navigation.state === "loading" ? "Searching..." : "Search"}
            </Button>
          </Form>
          {loaderData.error && (
            <Alert variant="destructive" className="top-16">
              <AlertDescription>{loaderData.error}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {loaderData.users?.items.map((user) => (
            <Card
              key={user.id}
              className="transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              <CardContent className="px-4 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 transition-all">
                  <AvatarImage src={user.avatar_url} alt={user.login} />
                  <AvatarFallback className="text-lg">
                    {user.login.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">{user.login}</h4>
                  <Badge variant="outline">{user.type}</Badge>
                  <Link
                    to={href("/detail/:username", { username: user.login })}
                    className="cursor-pointer"
                  >
                    <Button className="w-full cursor-pointer">
                      See Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
