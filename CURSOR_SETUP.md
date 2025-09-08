# Cursor MCP Setup Guide

This guide will help you configure Cursor to use the D&D 5e Character MCP server.

## Prerequisites

1. Make sure the MCP server is built:
   ```bash
   npm run build
   ```

2. Verify the server works:
   ```bash
   npm start
   ```
   (Press Ctrl+C to stop it)

## Cursor Configuration

### Method 1: Using Cursor Settings UI

1. Open Cursor
2. Go to Settings (Cmd+, on Mac, Ctrl+, on Windows/Linux)
3. Search for "MCP" or "Model Context Protocol"
4. Add a new MCP server with these settings:
   - **Name**: `dnd-character`
   - **Command**: `node`
   - **Args**: `["dist/index.js"]`
   - **Working Directory**: `/Users/ryanguild/dnd-character-mcp`
   - **Enabled**: ✅

### Method 2: Using Configuration File

1. Copy the contents of `mcp-config.json` from this project
2. Add it to your Cursor MCP configuration file (location varies by OS):
   - **Mac**: `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/settings.json`
   - **Windows**: `%APPDATA%/Cursor/User/globalStorage/cursor.mcp/settings.json`
   - **Linux**: `~/.config/Cursor/User/globalStorage/cursor.mcp/settings.json`

### Method 3: Using .cursorrules

The `.cursorrules` file in this project contains the configuration. Cursor should automatically detect and use it.

## Verification

Once configured, you should be able to:

1. Open a new chat in Cursor
2. Ask it to create a D&D character:
   ```
   Create a level 1 Human Fighter named "Test Character"
   ```
3. The AI should use the MCP tools to create and manage your character

## Available Commands

Once the MCP server is connected, you can ask Cursor to:

- **Create characters**: "Create a level 3 Elf Wizard named Gandalf"
- **Manage inventory**: "Add a longsword and chain mail to my character"
- **Roll dice**: "Roll a d20 for a Strength check"
- **Search items**: "Find all sword-type weapons"
- **View character**: "Show me my character's stats and equipment"

## Troubleshooting

### Server Not Starting
- Make sure you're in the correct directory: `/Users/ryanguild/dnd-character-mcp`
- Run `npm run build` to ensure the TypeScript is compiled
- Check that Node.js is installed and accessible

### MCP Not Connecting
- Verify the working directory path is correct
- Make sure the `dist/index.js` file exists
- Check Cursor's MCP settings for any error messages

### Tools Not Available
- Ensure the server is enabled in Cursor's MCP settings
- Check that the `alwaysAllow` list includes the tools you want to use
- Restart Cursor after making configuration changes

## Development

When making changes to the MCP server:

1. Make your changes to the TypeScript files
2. Run `npm run build` to compile
3. Restart Cursor or reload the MCP server
4. Test your changes in a new chat

The character data is automatically saved to `~/.characters.json` and persists between sessions.
