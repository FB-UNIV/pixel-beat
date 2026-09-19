# PIXEL BEAT

## Installation

1. install nvm : [nvm documentation](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. installation node version 25.2.0 `nvm install` (reads `.nvmrc`)
3. `git clone https://github.com/BoujuFrancoisPro/pixel-beat.git && cd pixel-beat`
4. `npm install` (a `postinstall` script creates `public/assets/` automatically)
5. `npm run start`

Access the UI in your browser at http://localhost:8000/

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for the scripts reference,
realtime event contract, testing, and code style. Short version:

### Backend

All the files related to the backend server are located in `src/`

Types are defined in `models/`

Sockets handling is done in the `src/sockets/sockets.ts`

### Frontend

not using webpack so gl have fun the main.js script is long :)
