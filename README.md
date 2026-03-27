# The Secret of Monkey Island - The Text Adventure

A small browser-based adventure/demo built with plain HTML, CSS and JavaScript.

## Summary

This project contains an implementation of the classic point-and-click adventure The Secret of Monkey Island, realised as a ZX-spectrum style text-based adventure. 

It was created purely as an experiment with coding agents and is not for commerical use.  Please be aware that the game is the IP of LucasArts. 

It's implemented as a static web project using `index.html` and modular JS in the `js/` folder. Game data (dialogue, items, NPCs, rooms, puzzles) live under `data/`.

## Quick start

- Open `index.html` in a modern browser to run the game locally.
- Or run a simple static server from the project root (recommended when using modules or loading assets):

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

## Project structure

- index.html — main entry page
- css/
  - style.css — site and game styles
- js/ — game code modules
  - engine.js, ui.js, graphics.js, loader.js, dialogue.js, combat.js, beeper.js
- data/ — JSON/JS data for game content
  - dialogue.js, items.js, npcs.js, puzzles.js, rooms.js, insults.js
- midi/ — music assets (theme.mid)
- sample_graphics/ — image assets used by the game
- Docs/ — documentation and walkthroughs

## Development notes

- The code is vanilla JS; no build step required.
- Keep data in `data/` and logic in `js/` to separate content from engine.
- If adding new assets, update the loader module to include them.

## Contributing

- Fork the repo and open a PR with concise, focused changes.
- Include a short description of your change and any testing steps.
- For large features, open an issue first to discuss design.

## License

No license file included. Add a `LICENSE` file if you want to make the project's license explicit.

## Credits

- Project inspired by classic adventure games.
- MIDI and sample graphics included in the `midi/` and `sample_graphics/` folders — verify usage rights before redistribution.

----

If you'd like, I can:
- add a `LICENSE` file (MIT/Apache/etc.),
- expand run instructions or a dev script, or
- create a short CONTRIBUTING.md.  
Tell me which next step you prefer.
