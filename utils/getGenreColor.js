const genreColors = {
  "Adventure": "red",
  "Hack and slash/Beat'em up": "teal",
  "Indie": "amber",
  "Platform": "yellow",
  "Point-and-click": "lime",
  "Puzzle": "indigo",
  "Racing": "emeral",
  "Real Time Strategy (RTS)": "orange",
  "Role-playing (RPG)": "sky",
  "Shooter": "cyan",
  "Simulator": "blue",
  "Strategy": "green",
  "Tactical": "violet",
  "Turn-based strategy (TBS)": "purple",
  "Visual Novel": "fuchsia",
};

export default function getGenreColor(genre) {
  return genreColors[genre] || "white";
}
