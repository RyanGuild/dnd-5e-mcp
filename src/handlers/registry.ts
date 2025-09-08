import { ToolDefinition, HandlerResult, HandlerContext, ToolModule } from './types';

// Import all handler modules
import { characterModule } from './character';
import { diceModule } from './dice';
import { hitpointsModule } from './hitpoints';
import { inventoryModule } from './inventory';
import { combatModule } from './combat';
import { spellsModule } from './spells';
import { classFeaturesModule } from './classFeatures';
import { entitiesModule } from './entities';

// Registry of all tool modules
const toolModules: ToolModule[] = [
  characterModule,
  diceModule,
  hitpointsModule,
  inventoryModule,
  combatModule,
  spellsModule,
  classFeaturesModule,
  entitiesModule
];

// Registry of all handlers by name
const handlerRegistry = new Map<string, (args: any, context: HandlerContext) => Promise<HandlerResult>>();

// Initialize the registry
function initializeRegistry(): void {
  for (const module of toolModules) {
    for (const handler of module.handlers) {
      handlerRegistry.set(handler.name, handler.handler);
    }
  }
}

// Get all tool definitions from all modules
export function getAllToolDefinitions(): ToolDefinition[] {
  const allTools: ToolDefinition[] = [];
  
  for (const module of toolModules) {
    allTools.push(...module.tools);
  }
  
  return allTools;
}

// Execute a tool handler by name
export async function executeToolHandler(
  name: string, 
  args: any, 
  context: HandlerContext
): Promise<HandlerResult> {
  // Initialize registry if not already done
  if (handlerRegistry.size === 0) {
    initializeRegistry();
  }
  
  const handler = handlerRegistry.get(name);
  if (!handler) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true
    };
  }
  
  try {
    return await handler(args, context);
  } catch (error) {
    return {
      content: [{ 
        type: 'text', 
        text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}` 
      }],
      isError: true
    };
  }
}

// Get handler count for debugging
export function getHandlerCount(): number {
  if (handlerRegistry.size === 0) {
    initializeRegistry();
  }
  return handlerRegistry.size;
}

// Get all registered tool names
export function getAllToolNames(): string[] {
  if (handlerRegistry.size === 0) {
    initializeRegistry();
  }
  return Array.from(handlerRegistry.keys());
}
