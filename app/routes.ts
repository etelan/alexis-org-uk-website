import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("cv", "routes/CV.tsx"), // alexis.org.uk/cv
  route("cassettes", "routes/cassetteLibrary.tsx"), // alexis.org.uk/cassettes
] satisfies RouteConfig;