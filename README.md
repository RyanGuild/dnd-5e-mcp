# D&D 5e Character MCP Server

A Model Context Protocol (MCP) server for managing D&D 5e characters, including character creation, dice rolling, and game mechanics.

## Features

- **Character Creation**: Create D&D 5e characters with custom ability scores, classes, races, and backgrounds
- **Character Persistence**: Characters are automatically saved to and loaded from `~/.characters.json`
- **Dice Rolling**: Roll various types of dice with modifiers, advantage, and disadvantage
- **Game Mechanics**: Roll ability checks, saving throws, skill checks, attack rolls, and damage
- **Character Management**: View, update, and delete character information
- **Inventory System**: Complete inventory management with weapons, armor, and equipment
- **Equipment Stats**: Automatic calculation of AC, attack bonuses, and other equipment-based stats
- **Hit Die Rolling**: Roll hit dice for healing during short rests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Usage

### Running the Server

Start the MCP server:
```bash
npm start
```

Or run in development mode:
```bash
npm run dev
```

### Available Tools

#### Character Management

- **create_character**: Create a new D&D 5e character
  - Parameters: `name`, `class`, `race`, `level` (optional), `abilityScores` (optional)
  - Example: Create a level 1 Human Fighter named "Aragorn"

- **get_character**: Get current character information
  - Shows all character stats, ability scores, skills, and saving throws

- **update_character**: Update character information
  - Parameters: `field`, `value`
  - Example: Update hit points, equipment, or spells
  - Character is automatically saved after updates

- **delete_character**: Delete the current character
  - Removes the character from memory and deletes the ~/.characters.json file

#### Dice Rolling

- **roll_dice**: Roll dice with optional modifiers
  - Parameters: `dice`, `sides`, `modifier` (optional), `advantage` (optional), `disadvantage` (optional)
  - Example: Roll 2d6+3 with advantage

- **roll_ability_check**: Roll an ability check for the current character
  - Parameters: `ability` (strength, dexterity, etc.), `proficient` (optional)
  - Example: Roll a Strength check

- **roll_saving_throw**: Roll a saving throw for the current character
  - Parameters: `ability`
  - Example: Roll a Constitution saving throw

- **roll_skill_check**: Roll a skill check for the current character
  - Parameters: `skill` (Athletics, Stealth, etc.)
  - Example: Roll a Stealth check

- **roll_attack**: Roll an attack roll for the current character
  - Parameters: `ability` (strength/dexterity), `proficient` (optional), `advantage` (optional), `disadvantage` (optional)
  - Example: Roll a Strength-based attack with proficiency

- **roll_damage**: Roll damage dice
  - Parameters: `dice`, `sides`, `modifier` (optional)
  - Example: Roll 1d8+2 damage

- **roll_hit_die**: Roll hit dice for healing
  - Parameters: `hitDie`, `constitutionModifier`
  - Example: Roll a d8 hit die with +2 Constitution modifier

#### Inventory Management

- **add_item**: Add an item to the character's inventory
  - Parameters: `itemId`, `quantity` (optional), `equipped` (optional), `notes` (optional)
  - Example: Add a longsword and equip it immediately

- **remove_item**: Remove an item from the character's inventory
  - Parameters: `itemId`, `quantity` (optional)
  - Example: Remove 1 longsword from inventory

- **equip_item**: Equip an item from the character's inventory
  - Parameters: `itemId`
  - Example: Equip a shield

- **unequip_item**: Unequip an item from the character's inventory
  - Parameters: `itemId`
  - Example: Unequip armor

- **get_inventory**: Get the character's inventory and equipped items
  - Shows all items, quantities, equipped status, and weight

- **search_items**: Search for weapons, armor, or equipment
  - Parameters: `query`
  - Example: Search for "sword" to find all sword-type weapons

- **get_equipment_stats**: Get calculated equipment stats
  - Shows AC, attack bonus, damage bonus, speed modifier, and equipped items

## Character Data Structure

The server maintains a complete D&D 5e character with:

- Basic info (name, level, class, race, background)
- Ability scores (STR, DEX, CON, INT, WIS, CHA) with modifiers
- Skills with proficiency bonuses
- Saving throws with proficiency
- Hit points (current, maximum, temporary)
- Armor class, initiative, speed
- Equipment, spells, features, languages
- Experience points and notes
- Complete inventory system with weapons, armor, and equipment
- Equipment proficiencies based on class

## Character Persistence

Characters are automatically saved to `~/.characters.json` in the user's home directory. The server will:

- **Load character on startup**: If a `~/.characters.json` file exists, the character is automatically loaded
- **Save after creation**: New characters are immediately saved to the file
- **Save after updates**: Any character modifications are automatically persisted
- **Delete on request**: The `delete_character` tool removes both the in-memory character and the file

This ensures your character data persists between server restarts and sessions, and prevents direct editing of the character file by external tools.

## Example Usage

1. Create a character:
```json
{
  "name": "Aragorn",
  "class": "Ranger",
  "race": "Human",
  "level": 3,
  "abilityScores": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 13,
    "intelligence": 12,
    "wisdom": 15,
    "charisma": 10
  }
}
```

2. Roll an attack:
```json
{
  "ability": "strength",
  "proficient": true,
  "advantage": false
}
```

3. Roll damage:
```json
{
  "dice": 1,
  "sides": 8,
  "modifier": 3
}
```

4. Add equipment to inventory:
```json
{
  "itemId": "longsword",
  "quantity": 1,
  "equipped": true
}
```

5. Search for items:
```json
{
  "query": "sword"
}
```

## Development

The project is built with TypeScript and uses the Model Context Protocol SDK. The server runs on stdio transport and can be integrated with MCP-compatible clients.

### Project Structure

- `src/index.ts` - Main MCP server implementation
- `src/types/character.ts` - TypeScript interfaces for D&D character data
- `src/utils/character.ts` - Character creation and calculation utilities
- `src/utils/dice.ts` - Dice rolling and game mechanics utilities

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Docker

### Using Pre-built Image
The latest image is automatically built and published to GitHub Container Registry:

```bash
docker pull ghcr.io/ryanguild/dnd-character-mcp:latest
docker run --rm -it ghcr.io/ryanguild/dnd-character-mcp:latest
```

### Build Locally
```bash
docker build -t dnd-character-mcp .
```

### Run

#### Basic Usage
- Run ephemeral (no persistence):
```bash
docker run --rm -it dnd-character-mcp
```

- Run with persistence (bind the container user's home file used by the server):
```bash
docker run --rm -it \
  -v "$HOME/.dnd-entities.json":/home/nodejs/.dnd-entities.json \
  --name dnd-character-mcp \
  dnd-character-mcp
```

#### Docker MCP Gateway Compatible
For use with Docker MCP Gateway, run with resource limits and security settings:
```bash
docker run -d \
  --name dnd-character-mcp \
  --cpus=1 \
  --memory=2g \
  --security-opt seccomp=unconfined \
  --cap-drop=ALL \
  --cap-add=CHOWN \
  --cap-add=SETGID \
  --cap-add=SETUID \
  -v "$HOME/.dnd-entities.json":/home/nodejs/.dnd-entities.json \
  ghcr.io/ryanguild/dnd-character-mcp:latest
```

#### MCP Gateway Integration
The image includes proper labels for Docker MCP Gateway discovery:
- `mcp.server.name`: dnd-character
- `mcp.server.transport`: stdio
- `mcp.server.capabilities`: character-management,inventory,dice-rolling

#### Available Tags
- `latest` - Latest stable release
- `main` - Latest from main branch
- `v1.0.0` - Specific version tags
- `v1.0` - Major.minor version
- `v1` - Major version

#### CI/CD Pipeline
The Docker image is automatically built and pushed to GitHub Container Registry on:
- Push to `main`/`master` branch
- Creation of version tags (e.g., `v1.0.0`)
- Pull requests to `main`/`master` branch

Notes:
- The server uses stdio (no network port). Use this image with MCP-capable clients (e.g., Cursor) by pointing the MCP command to `node dist/index.js` inside the container or running the container and connecting via stdio.
- Data persists to `/home/nodejs/.dnd-entities.json` in the container; bind-mount your host's `~/.dnd-entities.json` to keep data between runs.
- Resource limits (1 CPU, 2GB RAM) align with Docker MCP Gateway recommendations.

## License

MIT
