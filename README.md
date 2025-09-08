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
- **Resting System**: Complete short and long rest mechanics with hit dice spending and recovery
- **Exhaustion Tracking**: Full exhaustion level system with effects and recovery
- **Class Features**: Class-specific recovery during rests (Warlock spell slots, Fighter abilities, etc.)

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

#### Resting and Recovery

- **short_rest**: Take a short rest (1 hour) to spend hit dice and recover class features
  - Parameters: `hitDiceToSpend` (optional, default: 0)
  - Allows spending hit dice to regain hit points
  - Recovers class-specific features (Warlock spell slots, Fighter abilities, etc.)
  - Example: Take a short rest and spend 2 hit dice for healing

- **long_rest**: Take a long rest (8 hours) to fully recover
  - Restores all hit points to maximum
  - Restores half of maximum hit dice (minimum 1)
  - Restores all spell slots for most classes
  - Recovers all class features
  - Reduces exhaustion level by 1
  - Example: Take a long rest to fully recover

- **add_exhaustion**: Add exhaustion levels to the character
  - Parameters: `levels` (optional, default: 1)
  - Applies exhaustion effects based on D&D 5e rules
  - Example: Add 1 level of exhaustion from forced march

- **remove_exhaustion**: Remove exhaustion levels from the character
  - Parameters: `levels` (optional, default: 1)  
  - Removes exhaustion effects
  - Example: Remove exhaustion through magical healing

- **get_exhaustion_status**: Get current exhaustion level and effects
  - Shows current exhaustion level, name, description, and all active effects
  - Displays effective stats (modified HP, speed, disadvantages)
  - Example: Check current exhaustion status and penalties

- **get_hit_dice_status**: Get current hit dice available for short rests
  - Shows available hit dice, maximum hit dice, and die size
  - Explains healing potential with Constitution modifier
  - Example: Check how many hit dice are available for short rest healing

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
- Hit dice (current, maximum, size based on class)
- Exhaustion level (0-6 with cumulative effects)
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

## Resting and Recovery System

The server implements the complete D&D 5e resting and recovery system:

### Short Rest (1 Hour)
- Spend hit dice to regain hit points (roll hit die + Constitution modifier, minimum 1 HP)
- Recover class-specific features:
  - **Warlock**: All spell slots
  - **Fighter**: Second Wind, Action Surge
  - **Monk**: Ki points
  - **Bard**: Bardic Inspiration (level 5+)
  - **Druid**: Wild Shape (level 2+)
  - **Sorcerer**: Font of Magic (level 4+)

### Long Rest (8 Hours)
- Restore all hit points to maximum
- Restore half of maximum hit dice (minimum 1)
- Restore all spell slots for most spellcasting classes
- Recover all class features and abilities
- Reduce exhaustion level by 1

### Exhaustion System
The server tracks exhaustion levels 0-6 with cumulative effects:

- **Level 0**: No exhaustion - no penalties
- **Level 1**: Light Exhaustion - disadvantage on ability checks
- **Level 2**: Moderate Exhaustion - speed halved + level 1 effects
- **Level 3**: Heavy Exhaustion - disadvantage on attack rolls and saving throws + previous effects
- **Level 4**: Severe Exhaustion - hit point maximum halved + previous effects  
- **Level 5**: Near Death - speed reduced to 0 + previous effects
- **Level 6**: Death - character dies

The system automatically calculates effective stats based on exhaustion level and prevents resting when appropriate (e.g., can't short rest at exhaustion level 5+ due to 0 speed).

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

6. Take a short rest and spend hit dice:
```json
{
  "hitDiceToSpend": 2
}
```

7. Check exhaustion status:
```json
{}
```

8. Add exhaustion from environmental effects:
```json
{
  "levels": 1
}
```

9. Take a long rest to recover:
```json
{}
```

## Development

The project is built with TypeScript and uses the Model Context Protocol SDK. The server runs on stdio transport and can be integrated with MCP-compatible clients.

### Project Structure

- `src/index.ts` - Main MCP server implementation
- `src/types/character.ts` - TypeScript interfaces for D&D character data
- `src/utils/character.ts` - Character creation and calculation utilities
- `src/utils/dice.ts` - Dice rolling and game mechanics utilities
- `src/utils/rest.ts` - Resting system and exhaustion management
- `src/utils/inventory.ts` - Inventory and equipment management
- `src/utils/storage.ts` - Character persistence and file management

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## License

MIT
