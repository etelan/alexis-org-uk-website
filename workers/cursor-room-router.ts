// Alexis Notes
// There is one room per endpoint (aka, homepage). 
// This routes requests to the correct Durable Object based on the room name in the URL.

export function routeCursorRoom(
	request: Request,
	env: Env,
): Promise<Response> | null {
	const url = new URL(request.url);

	// Rooms (DurableObjects) only support websocket connections (aka, our rooms can only support cursors)
	if (!url.pathname.startsWith("/ws/")) {
		return null;
	}

	// Translate pathname to roomname: "/ws/homepage" becomes the room name "homepage".
	const roomName =
		decodeURIComponent(url.pathname.slice("/ws/".length)) ||
		"homepage";

	// For 1 webpage, there is only 1 Room and only 1 Durable Object.
	const room = env.CURSOR_ROOM.getByName(roomName);

    // Send it to the Durable Object for that room, send that response back to the browser.
	return room.fetch(request);
}