// Alexis WIP Notes
// Messages between client and server. 
// Also, defines the cursor send rate and idle timeout.

// [MESSAGE PAYLOADS]
// Identity for one visitor inside a room.
export type CursorSession = {
	id: string;
	name: string;
	color: string;
};

export type CursorPosition = {
	x: number;
	y: number;
};

// [SERVER sent to CLIENT]
// Sent to a visitor when they join the room.
export type WelcomeMessage = {
	type: "welcome";
} & CursorSession;

// Sent when a visitor moves their cursor. 
export type CursorMessage = {
	type: "cursor";
} & CursorSession &
	CursorPosition;

// Sent when a visitor leaves the room.
export type LeaveMessage = {
	type: "leave";
	id: string;
};

// Messages the room can send to the browser.
export type ServerMessage = WelcomeMessage | CursorMessage | LeaveMessage;


// [CLIENT sent to SERVER]
export type ClientMessage = CursorPosition;

// Cursor send rate and idle timeout.
export const MAX_SENDS_PER_SECOND = 10;
export const IDLE_TIMEOUT_MS = 5000;
export const SEND_INTERVAL_MS = 1000 / MAX_SENDS_PER_SECOND;

// Parse a browser message into a cursor position, or return null if it is invalid.
export function parseCursorPosition(message: string): CursorPosition | null {
	try {
		const data = JSON.parse(message);

		if (typeof data?.x !== "number" || typeof data?.y !== "number") {
			return null;
		}

		return { x: data.x, y: data.y };
	} catch {
		return null;
	}
}
