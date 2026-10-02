import type { Route } from "./+types/home";
import CassetteLibrary from "./cassetteLibrary";
import WiiMenu from "./WiiMenu";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Alexis" },
		{ name: "description", content: "Alexis' website" },
	];
}

export function loader({ request }: Route.LoaderArgs) {
	return {
		isCassetteHost: new URL(request.url).hostname === "cassettes.alexis.org.uk",
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return loaderData.isCassetteHost ? <CassetteLibrary /> : <WiiMenu />;
}
