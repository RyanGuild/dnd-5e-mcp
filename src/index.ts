import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { DNDCharacter } from './types/character.js';
import { SpellManager } from './utils/spells.js';
import { ClericSpellManager } from './utils/cleric-spells.js';
import { ClericCharacter } from './utils/cleric-character.js';
import { loadCharacter } from './utils/storage.js';
import { getAllToolDefinitions, executeToolHandler } from './handlers/registry.js';
import { HandlerContext } from './handlers/types.js';

// Global state
let currentCharacter: DNDCharacter | null = null;
let spellManager: SpellManager | null = null;
let clericSpellManager: ClericSpellManager | null = null;
let clericCharacter: ClericCharacter | null = null;

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
    return spellManager || clericSpellManager;
  },
  set spellManager(manager: SpellManager | ClericSpellManager | null) {
    if (manager instanceof ClericSpellManager) {
      clericSpellManager = manager;
      spellManager = null;
    } else {
      spellManager = manager;
      clericSpellManager = null;
    }
  },
  setCurrentCharacter: (character: DNDCharacter | null) => {
    currentCharacter = character;
  },
  setSpellManager: (manager: SpellManager | ClericSpellManager | null) => {
    if (manager instanceof ClericSpellManager) {
      clericSpellManager = manager;
      spellManager = null;
    } else {
      spellManager = manager;
      clericSpellManager = null;
    }
  }
};

// Load character on startup
async function loadCharacterOnStartup() {
  try {
    const character = await loadCharacter();
    if (character) {
      currentCharacter = character;
      
      // Initialize spell manager for wizards
      if (character.class.name === 'Wizard') {
        spellManager = new SpellManager(
          character.level,
          character.abilityScores.intelligence.modifier,
          character.knownSpells
        );
      }
      
      // Initialize cleric character and spell manager for clerics
      // Note: In a full implementation, domain would be stored with the character
      if (character.class.name === 'Cleric') {
        try {
          // For now, use a default domain - in a real implementation this would be stored
          const domainName = 'Life'; // This should be retrieved from character data
          clericCharacter = new ClericCharacter(character, domainName);
          clericSpellManager = clericCharacter.getSpellManager();
        } catch (error) {
          console.error('Error creating cleric character:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error loading character:', error);
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
