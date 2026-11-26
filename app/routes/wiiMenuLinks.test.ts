import { getWiiMenuTileData } from "./wiiMenuLinks";

describe("Wii menu tile links", () => {
  test("links to the local cassette route in development", () => {
    const cassetteTile = getWiiMenuTileData(true).find((tile) => tile.id === 2);

    expect(cassetteTile?.url).toBe("/cassettes");
  });

  test("links to the cassette domain in production", () => {
    const cassetteTile = getWiiMenuTileData(false).find((tile) => tile.id === 2);

    expect(cassetteTile?.url).toBe("https://cassettes.alexis.org.uk");
  });
});
