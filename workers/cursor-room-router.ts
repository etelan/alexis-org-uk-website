export function routeCursorRoom(
	request: Request,
	env: Env,
): Promise<Response> | null {
	const url = new URL(request.url);

	// Only handle requests to our WebSocket endpoint.
	if (!url.pathname.startsWith("/ws/")) {
		return null;
	}

	// "/ws/homepage" becomes the room name "homepage".
	const roomName =
		decodeURIComponent(url.pathname.slice("/ws/".length)) ||
		"homepage";

	// The same room name always points to the same Durable Object.
	const room = env.CURSOR_ROOM.getByName(roomName);

	return room.fetch(request);
}