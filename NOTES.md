```shell
❯ jq 'map(.Genres | split(",")) | flatten | map(gsub("^\\s+|\\s+$"; "")) | unique' content/games.json
[
  "Adventure",
  "Hack and slash/Beat'em up",
  "Indie",
  "Platform",
  "Point-and-click",
  "Puzzle",
  "Racing",
  "Real Time Strategy (RTS)",
  "Role-playing (RPG)",
  "Shooter",
  "Simulator",
  "Strategy",
  "Tactical",
  "Turn-based strategy (TBS)",
  "Visual Novel"
]
```
