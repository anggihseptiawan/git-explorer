import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("detail/:username", "routes/detail.tsx"),
  route("api/pagination", "routes/api/pagination.ts"),
] satisfies RouteConfig
