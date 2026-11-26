export function getWiiMenuTileData(isDevelopment: boolean) {
  return [
    { id: 1, image: 'images/wii_menu/CV_Tile.png', imageAlt: 'CV Tile', url: isDevelopment ? '/cv' : 'https://alexis.org.uk/cv' },
    { id: 2, image: 'images/wii_menu/Cassette_Tile.png', imageAlt: 'Cassette Tile', url: isDevelopment ? '/cassettes' : 'https://cassettes.alexis.org.uk' },
    { id: 3, image: 'images/wii_menu/GitHub_Tile.png', imageAlt: 'Github Tile', url: 'https://github.com/etelan' },
  ];
}
