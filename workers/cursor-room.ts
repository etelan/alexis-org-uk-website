// Alexis Notes
// There is one room per endpoint (aka, homepage). 
// Each room is a Durable Object that manages the state of all connected clients. 
// The room is responsible for broadcasting messages to all clients, and for keeping track of which clients are connected.


import { DurableObject } from "cloudflare:workers";
// Imports: We have subworkers for random-colour when a cursor loads in, cursor positioning and cursor position broadcasting.
import { randomColor } from "./random-colour";
import {
	type CursorSession,
	parseCursorPosition,
} from "./cursor-protocol";

export class CursorRoom extends DurableObject<Env> {
	async fetch(request: Request): Promise<Response> {
		// This endpoint only accepts WebSocket connections.
		if (request.headers.get("Upgrade") !== "websocket") {
			return new Response("Expected WebSocket", {
				status: 426,
			});
		}

		// Create the browser and server ends of the WebSocket.
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);

		// Give each visitor their own identity.
		const session: CursorSession = {
			id: crypto.randomUUID(),
			name: `Visitor ${this.ctx.getWebSockets().length + 1}`,
			color: randomColor(),
		};

		// Let Cloudflare manage the socket using hibernation.
		this.ctx.acceptWebSocket(server);

		// Store visitor details on their socket.
		server.serializeAttachment(session);

		// Tell the visitor their assigned identity.
		server.send(
			JSON.stringify({
				type: "welcome",
				...session,
			}),
		);

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	async webSocketMessage(
		sender: WebSocket,
		message: string | ArrayBuffer,
	) {
		if (typeof message !== "string") return;

		const session =
			sender.deserializeAttachment() as CursorSession | null;

		if (!session) return;

		const position = parseCursorPosition(message);

		if (!position) return;

		// Send this cursor position to everyone else.
		this.broadcast(
			{
				type: "cursor",
				...session,
				...position,
			},
			sender,
		);
	}

	async webSocketClose(
		socket: WebSocket,
		code: number,
		reason: string,
	) {
		const session =
			socket.deserializeAttachment() as CursorSession | null;

		// Tell everyone to remove this visitor's cursor.
		if (session) {
			this.broadcast(
				{
					type: "leave",
					id: session.id,
				},
				socket,
			);
		}

		socket.close(code, reason);
	}

	private broadcast(data: unknown, sender?: WebSocket) {
		const message = JSON.stringify(data);

		for (const socket of this.ctx.getWebSockets()) {
			// Don't send visitors their own cursor position.
			if (socket === sender) continue;

			try {
				socket.send(message);
			} catch {
				// The socket may have disconnected.
			}
		}
	}
}
