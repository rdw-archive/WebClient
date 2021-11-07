# About

> The Revival WebClient is a browser-based client capable of rendering networked multiplayer games using modern web technologies

Right now it's just an experiment, but it's basically bundling third-party libraries and frameworks with some glue:

* [Electron](https://www.electronjs.org/) for the runtime and native APIs
* [BabylonJS](https://www.babylonjs.com/) for WebGL rendering, WebAudio and (optionally) physics support
* Builtin browser APIs for stuff like networking (via [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) API)
* Custom abstractions, tools and utilities specific to the domain of game development
* An addon system and high-level scripting API to make all this stuff easier to use
* There's probably something else that I forgot... how do I delete this point?

All of this is intended to be used mainly in my own projects (for now), and relies on several other components to actually be useful:

* [LoginServer](https://github.com/RevivalEngine/WorldServer): Handles user authentication, realm management and identities
* [WorldServer](https://github.com/RevivalEngine/WorldServer): Runs the simulation of the game world and all gameplay logic
* [Watcher](https://github.com/RevivalEngine/WorldServer): Monitoring toolset to analyse server health and other metrics

## Status

Work is currently in process to build a Minimum Viable Product (MVP) prototype. It's not ready for actual use, but rather something I'm continually tinkering with and that's developed alongside other, as of yet undisclosed projects.

Feel free to ask questions, make suggestions, or give feedback via creating issues, but please don't expect this to "just work" or have many features. It likely will be released properly some day, but today is not that day.

The only reason I opened up the repository already is because it's required for certain things (GitHub pages, CI actions, etc.). Consider this a private repository that may or may not end up in a publicly-releasable state in the future. Or maybe it won't, you never know with these side projects.

Also, assume the git history can change (`rebase`) as I don't expect anyone to actually clone this repository yet. Nothing is set in stone, as far as I'm concerned.

## See also

For more information, please see the online [documentation](https://revivalengine.github.io).

Note: This documentation website is an initial proof of concept and as such, it's not very useful at this time.

## Licensing Information

All original code is published under the [Mozilla Public License, version 2 (no anti-GPL "Exhibit B")](https://www.mozilla.org/en-US/MPL/2.0/). Third party code may have its own license (usually MIT) but there should generally be no interoperability issues even for commercial use cases.

Please find the full license here: [.github/LICENSE](.github/LICENSE)
