// Alexis Notes
// The UI for showing the cursors.

import { useEffect, useRef, useState } from "react";
import "./cursor.css";

// Get all our message types between client and server
import {
	IDLE_TIMEOUT_MS,
	SEND_INTERVAL_MS,
	type CursorMessage,
	type ServerMessage,
	type Cursor,
} from "../../workers/cursor-protocol";

// This smooths out our movements of cursors
const CURSOR_LERP_FACTOR = 0.2;
const CURSOR_SNAP_DISTANCE = 0.5;

export function CursorPresence() {
	// Where the cursors are (what the UI uses)
	const [cursors, setCursors] = useState<Record<string, Cursor>>({});
	// What the destination of the cursor is (what the server says)
	const cursorTargetsRef = useRef<Record<string, Cursor>>({});

	// Are we idle? (no mouse movement for IDLE_TIMEOUT_MS)
	const isIdleRef = useRef(false);
	// Something to compare against IDLE_TIMEOUT_MS
	const idleTimeoutRef = useRef<number | null>(null);

	// Something to compare against SEND_INTERVAL_MS (rate limit pos to server)
	const lastSentAt = useRef(0);

	// When the component mounts, open a websocket to the server and listen for messages.
	useEffect(() => {
		// Make the websocket (http -> ws, https -> wss)
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(
			`${protocol}://${window.location.host}/ws/homepage`,
		);

		// Cursors are sent to client as messages, we update our local states with them.
		const updateCursor = (cursor: CursorMessage) => {

			// What the destination of the cursor is
			cursorTargetsRef.current = {
				...cursorTargetsRef.current,
				[cursor.id]: cursor,
			};

			// What the UI is animating
			setCursors((current) => ({
				...current,
				[cursor.id]: current[cursor.id] ?? cursor,
			}));
		};

		// When cursors leave, process that message and remove them from our local state.
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

		// We have moved! Reset idle timer and isIdle
		const resetIdleTimer = () => {
			isIdleRef.current = false;

			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}

			idleTimeoutRef.current = window.setTimeout(() => {
				isIdleRef.current = true;
			}, IDLE_TIMEOUT_MS);
		};

		// We are moving! 
		// Send our cursor position to the server, but rate limit it to SEND_INTERVAL_MS.
		const handleMouseMove = (event: MouseEvent) => {

			// We are not idle. We are moving!
			resetIdleTimer();

			// Rate limit. 
			// Make sure that the current time is at least SEND_INTERVAL_MS after the last time we sent a message.
			const now = Date.now();
			if (now - lastSentAt.current < SEND_INTERVAL_MS) return;
			lastSentAt.current = now;

			// If our socket is not open, don't send anything.
			if (socket.readyState !== WebSocket.OPEN) return;

			// Send position to server
			socket.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
		};

		// Add the mouse moving listener
		window.addEventListener("mousemove", handleMouseMove);

		// Listen to server messages (other people's cursors leaving and moving)
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

		resetIdleTimer();

		// The UI animates the cursors to their destination positions. (linear interpolation)
		const animate = () => {
			// Update the cursors to their destination positions, but only if they have changed.
			setCursors((current) => {
				let changed = false;
				// "The new version of the cursors" (the next state)
				const next: Record<string, Cursor> = {};

				// Cycle through all the cursors and move them towards their destination positions.
				for (const cursor of Object.values(current)) {
					// Final location of the cursor (where the server says it should be)
					const target = cursorTargetsRef.current[cursor.id];

					// If there is no target, just keep the cursor where it is.
					if (!target) {
						next[cursor.id] = cursor;
						continue;
					}

					// Calculate distances
					const dx = target.x - cursor.x;
					const dy = target.y - cursor.y;
					// Using our mate Pythagoras to calculate the distance between the cursor and its target.
					const distance = Math.hypot(dx, dy);

					// If its small enough distance, just snap to it. No need to smooth nothing. (This is to avoid jittering when the cursor is very close to its target)
					if (distance <= CURSOR_SNAP_DISTANCE) {
						next[cursor.id] = target;
						changed ||= target.x !== cursor.x || target.y !== cursor.y;
						continue;
					}

					// Move the cursor towards its target position using linear interpolation (lerp). This makes the movement smooth.
					const x = cursor.x + dx * CURSOR_LERP_FACTOR;
					const y = cursor.y + dy * CURSOR_LERP_FACTOR;

					// Update the next state with the new position of the cursor. If it has changed, mark it as changed.
					next[cursor.id] = {
						...cursor,
						x,
						y,
					};
					changed = true;
				}

				// If it's not changed just return the current state, otherwise return the next state. This is to avoid unnecessary re-renders.
				return changed ? next : current;
			});

			// Gotta keep animating! Request the next animation frame.
			frameRef.current = window.requestAnimationFrame(animate);
		};

		const frameRef = {
			current: window.requestAnimationFrame(animate),
		};

		// Remove the mouse listener, remove the idle timer, stop animating, close the socket when the component unmounts (aka, the page is closed or navigated away from)
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);

			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}

			window.cancelAnimationFrame(frameRef.current);
			socket.close();
		};
	}, []);

	// Loop over all the cursors and render them. 
	// Each cursor is a circle with a name at a position on the screen.
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
					<div className="cursor-with-text">
						<img src={"images/Wii Cursor Blank.cur"} alt={cursor.name}/>
						<p className="caption" 
							style={{ "--cursor-color": cursor.color, "--size": "3px" } as React.CSSProperties}>
							{cursor.name}
						</p>
					</div>
				</div>
			))}
		</>
	);
}
