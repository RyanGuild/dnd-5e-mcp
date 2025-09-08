import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { DNDCharacter } from './types/character.js';
import { SpellManager, CasterConfig } from './utils/spells.js';
import { loadCharacter } from './utils/storage.js';
import { getAllToolDefinitions, executeToolHandler } from './handlers/registry.js';
import { HandlerContext } from './handlers/types.js';

// Global state
let currentCharacter: DNDCharacter | null = null;
let spellManager: SpellManager | null = null;

// Create the server
const server = new Server({
  name: 'dnd-character-mcp',
  version: '1.0.0',
});

// Set up the handler context
const context: HandlerContext = {
  get currentCharacter() {
    return currentCharacter;
  },
  set currentCharacter(character: DNDCharacter | null) {
    currentCharacter = character;
  },
  get spellManager() {
    return spellManager;
  },
  set spellManager(manager: SpellManager | null) {
    spellManager = manager;
  },
  setCurrentCharacter: (character: DNDCharacter | null) => {
    currentCharacter = character;
  },
  setSpellManager: (manager: SpellManager | null) => {
    spellManager = manager;
  }
};

// Load character on startup
async function loadCharacterOnStartup() {
  try {
    const character = await loadCharacter();
    if (character) {
      currentCharacter = character;

      // Initialize spell manager for spellcasting classes
      if (isSpellcaster(character.class.name)) {
        const casterConfig = getCasterConfig(character);
        spellManager = new SpellManager(
          character.level,
          casterConfig,
          character.knownSpells
        );
      }
    }
  } catch (error) {
    console.error('Error loading character:', error);
  }
}

// Helper function to determine if a class is a spellcaster
function isSpellcaster(className: string): boolean {
  const spellcastingClasses = [
    'Wizard', 'Cleric', 'Sorcerer', 'Druid', 'Bard',
    'Paladin', 'Ranger', 'Warlock', 'Eldritch Knight'
  ];
  return spellcastingClasses.includes(className);
}

// Helper function to get caster configuration for a character
function getCasterConfig(character: DNDCharacter): CasterConfig {
  const className = character.class.name;

  switch (className) {
    case 'Wizard':
      return {
        type: 'wizard',
        spellcastingAbility: 'intelligence',
        casterType: 'full'
      };

    case 'Cleric':
      return {
        type: 'cleric',
        spellcastingAbility: 'wisdom',
        casterType: 'half',
        domainSpells: {
          // For now, use default domain spells - in a real implementation,
          // this would be stored with the character
          1: ['Bless', 'Cure Wounds'],
          2: ['Spiritual Weapon'],
          3: ['Spirit Guardians'],
          4: ['Guardian of Faith'],
          5: ['Flame Strike']
        }
      };

    case 'Sorcerer':
      return {
        type: 'sorcerer',
        spellcastingAbility: 'charisma',
        casterType: 'third'
      };

    case 'Druid':
      return {
        type: 'druid',
        spellcastingAbility: 'wisdom',
        casterType: 'full'
      };

    case 'Bard':
      return {
        type: 'bard',
        spellcastingAbility: 'charisma',
        casterType: 'full'
      };

    case 'Paladin':
      return {
        type: 'paladin',
        spellcastingAbility: 'charisma',
        casterType: 'third'
      };

    case 'Ranger':
      return {
        type: 'ranger',
        spellcastingAbility: 'wisdom',
        casterType: 'half'
      };

    case 'Warlock':
      return {
        type: 'warlock',
        spellcastingAbility: 'charisma',
        casterType: 'pact'
      };

    case 'Eldritch Knight':
      return {
        type: 'wizard', // Eldritch Knights use wizard spellcasting
        spellcastingAbility: 'intelligence',
        casterType: 'third'
      };

    default:
      // Default to wizard configuration
      return {
        type: 'wizard',
        spellcastingAbility: 'intelligence',
        casterType: 'full'
      };
  }
}

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = getAllToolDefinitions();
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await executeToolHandler(name, args, context);
    // Convert HandlerResult to CallToolResult format expected by MCP SDK
    return {
      content: result.content,
      isError: result.isError
    } as CallToolResult;
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    } as CallToolResult;
  }
});

// Start the server
async function main() {
  await loadCharacterOnStartup();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('D&D Character MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
