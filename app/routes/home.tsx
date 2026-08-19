import type { Route } from "./+types/home";
import { useEffect, useRef, useState } from "react";

type Cursor = {
	id: string;
	name: string;
	color: string;
	x: number;
	y: number;
};

type ServerMessage =
	| {
			type: "welcome";
			id: string;
			name: string;
			color: string;
	  }
	| {
			type: "cursor";
			id: string;
			name: string;
			color: string;
			x: number;
			y: number;
	  }
	| {
			type: "leave";
			id: string;
	  };

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Alexis" },
		{ name: "description", content: "Alexis' website" },
	];
}

export default function Home() {
	const [cursors, setCursors] = useState<Record<string, Cursor>>({});
	const socketRef = useRef<WebSocket | null>(null);
	const idleTimeoutRef = useRef<number | null>(null);
	const lastSentAt = useRef(0);
	const isIdleRef = useRef(false);

	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(
			`${protocol}://${window.location.host}/ws/homepage`,
		);

		socketRef.current = socket;

		socket.addEventListener("message", (event) => {
			const message = JSON.parse(event.data) as ServerMessage;

			if (message.type === "cursor") {
				setCursors((current) => ({
					...current,
					[message.id]: message,
				}));
			}

			if (message.type === "leave") {
				setCursors((current) => {
					const next = { ...current };
					delete next[message.id];
					return next;
				});
			}
		});

		const resetIdleTimer = () => {
			isIdleRef.current = false;

			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}

			idleTimeoutRef.current = window.setTimeout(() => {
				isIdleRef.current = true;
			}, 5000);
		};

		const handleMouseMove = (event: MouseEvent) => {
			const now = Date.now();

			resetIdleTimer();

			// Limit cursor updates to 10 times per second.
			if (now - lastSentAt.current < 100) return;
			if (isIdleRef.current) return;

			lastSentAt.current = now;

			if (socket.readyState !== WebSocket.OPEN) return;

			socket.send(
				JSON.stringify({
					x: event.clientX,
					y: event.clientY,
				}),
			);
		};

		window.addEventListener("mousemove", handleMouseMove);
		resetIdleTimer();

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (idleTimeoutRef.current !== null) {
				window.clearTimeout(idleTimeoutRef.current);
			}
			socket.close();
		};
	}, []);

	return (
		<main className="relative min-h-screen overflow-hidden p-8">
			<h1 className="text-4xl font-bold">Hello 👋</h1>

			<p className="mt-4 text-lg">
				Move your mouse around and open this page in another tab.
			</p>

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
		</main>
	);
}
