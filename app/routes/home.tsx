import type { Route } from "./+types/home";
import { CursorPresence } from "../components/cursor-presence";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Alexis" },
		{ name: "description", content: "Alexis' website" },
	];
}

export default function Home() {
	return (
		<main className="relative min-h-screen overflow-hidden p-8">
			<CursorPresence />
			<h1 className="text-4xl font-bold">Hello 👋</h1>

			<p className="mt-4 text-lg">
				Move your mouse around and open this page in another tab.
			</p>
		</main>
	);
}
