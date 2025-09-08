import { DNDCharacter } from '../types/character';
import { SpellManager } from '../utils/spells';

export interface HandlerContext {
  currentCharacter: DNDCharacter | null;
  spellManager: SpellManager | null;
  setCurrentCharacter: (character: DNDCharacter | null) => void;
  setSpellManager: (manager: SpellManager | null) => void;
}

export interface HandlerResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolHandler {
  name: string;
  handler: (args: any, context: HandlerContext) => Promise<HandlerResult>;
}

export interface ToolModule {
  tools: Array<{
    name: string;
    description: string;
    inputSchema: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  }>;
  handlers: ToolHandler[];
}

export function createSuccessResult(text: string): HandlerResult {
  return {
    content: [{ type: 'text', text }],
    isError: false
  };
}

export function createErrorResult(text: string): HandlerResult {
  return {
    content: [{ type: 'text', text }],
    isError: true
  };
}
