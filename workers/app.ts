import { createRequestHandler } from "react-router";
import { routeCursorRoom } from "./cursor-room-router";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

// Create the normal React Router request handler.
const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

// Cloudflare needs the Durable Object exported from the Worker.
export { CursorRoom } from "./cursor-room";

export default {
	fetch(request, env, ctx) {
		// Try the cursor WebSocket first, then fall back to React Router.
		return (
			routeCursorRoom(request, env) ??
			requestHandler(request, {
				cloudflare: { env, ctx },
			})
		);
	},
} satisfies ExportedHandler<Env>;