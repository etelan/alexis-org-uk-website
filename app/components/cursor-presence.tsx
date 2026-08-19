import { useEffect, useRef, useState } from "react";

import {
	IDLE_TIMEOUT_MS,
	SEND_INTERVAL_MS,
	type CursorMessage,
	type CursorSession,
	type ServerMessage,
} from "../../workers/cursor-protocol";

type Cursor = CursorSession & {
	x: number;
	y: number;
};

// This smooths out our movements of cursors
const CURSOR_LERP_FACTOR = 0.2;
const CURSOR_SNAP_DISTANCE = 0.5;

export function CursorPresence() {
	const [cursors, setCursors] = useState<Record<string, Cursor>>({});
	const idleTimeoutRef = useRef<number | null>(null);
	const lastSentAt = useRef(0);
	const isIdleRef = useRef(false);
	const cursorTargetsRef = useRef<Record<string, Cursor>>({});

	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(
			`${protocol}://${window.location.host}/ws/homepage`,
		);

		const updateCursor = (cursor: CursorMessage) => {
			cursorTargetsRef.current = {
				...cursorTargetsRef.current,
				[cursor.id]: cursor,
			};

			setCursors((current) => ({
				...current,
				[cursor.id]: current[cursor.id] ?? cursor,
			}));
		};

		const removeCursor = (id: string) => {
			const nextTargets = { ...cursorTargetsRef.current };
			delete nextTargets[id];
			cursorTargetsRef.current = nextTargets;

			setCursors((current) => {
				const next = { ...current };
				delete next[id];
				return next;
			});
		};

		const resetIdleTimer = () => {
			isIdleRef.current = false;

			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}

			idleTimeoutRef.current = window.setTimeout(() => {
				isIdleRef.current = true;
			}, IDLE_TIMEOUT_MS);
		};

		const handleMouseMove = (event: MouseEvent) => {
			const now = Date.now();

			resetIdleTimer();

			if (now - lastSentAt.current < SEND_INTERVAL_MS) return;
			if (isIdleRef.current) return;

			lastSentAt.current = now;

			if (socket.readyState !== WebSocket.OPEN) return;

			socket.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
		};

		socket.addEventListener("message", (event) => {
			const message = JSON.parse(event.data) as ServerMessage;

			switch (message.type) {
				case "cursor":
					updateCursor(message);
					break;
				case "leave":
					removeCursor(message.id);
					break;
			}
		});

		window.addEventListener("mousemove", handleMouseMove);
		resetIdleTimer();

		const animate = () => {
			setCursors((current) => {
				let changed = false;
				const next: Record<string, Cursor> = {};

				for (const cursor of Object.values(current)) {
					const target = cursorTargetsRef.current[cursor.id];

					if (!target) {
						next[cursor.id] = cursor;
						continue;
					}

					const dx = target.x - cursor.x;
					const dy = target.y - cursor.y;
					const distance = Math.hypot(dx, dy);

					if (distance <= CURSOR_SNAP_DISTANCE) {
						next[cursor.id] = target;
						changed ||= target.x !== cursor.x || target.y !== cursor.y;
						continue;
					}

					const x = cursor.x + dx * CURSOR_LERP_FACTOR;
					const y = cursor.y + dy * CURSOR_LERP_FACTOR;

					next[cursor.id] = {
						...cursor,
						x,
						y,
					};
					changed = true;
				}

				return changed ? next : current;
			});

			frameRef.current = window.requestAnimationFrame(animate);
		};

		const frameRef = {
			current: window.requestAnimationFrame(animate),
		};

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);

			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}

			window.cancelAnimationFrame(frameRef.current);
			socket.close();
		};
	}, []);

	return (
		<>
			{Object.values(cursors).map((cursor) => (
				<div
					key={cursor.id}
					className="pointer-events-none fixed z-50"
					style={{
						left: cursor.x,
						top: cursor.y,
						transform: "translate(8px, 8px)",
					}}
				>
					<div
						className="h-3 w-3 rounded-full"
						style={{ backgroundColor: cursor.color }}
					/>

					<div
						className="mt-1 rounded px-2 py-1 text-xs text-white"
						style={{ backgroundColor: cursor.color }}
					>
						{cursor.name}
					</div>
				</div>
			))}
		</>
	);
}
