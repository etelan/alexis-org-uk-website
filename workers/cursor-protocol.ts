export type CursorSession = {
	id: string;
	name: string;
	color: string;
};

export type CursorPosition = {
	x: number;
	y: number;
};

export type WelcomeMessage = {
	type: "welcome";
} & CursorSession;

export type CursorMessage = {
	type: "cursor";
} & CursorSession &
	CursorPosition;

export type LeaveMessage = {
	type: "leave";
	id: string;
};

export type ServerMessage = WelcomeMessage | CursorMessage | LeaveMessage;

export type ClientMessage = CursorPosition;

export const MAX_SENDS_PER_SECOND = 10;
export const IDLE_TIMEOUT_MS = 5000;
export const SEND_INTERVAL_MS = 1000 / MAX_SENDS_PER_SECOND;

export function isCursorPosition(value: unknown): value is CursorPosition {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const position = value as Partial<CursorPosition>;

	return (
		typeof position.x === "number" &&
		typeof position.y === "number"
	);
}

export function parseCursorPosition(message: string): CursorPosition | null {
	try {
		const data: unknown = JSON.parse(message);
		return isCursorPosition(data) ? data : null;
	} catch {
		return null;
	}
}
