# D&D 5e Character MCP Server - Testing Guide

This document describes the comprehensive test suite for the D&D 5e Character MCP Server, including test characters, validation tests, and CI/CD setup.

## Test Suite Overview

The test suite includes comprehensive tests for all major functionality:

- **Character Creation Tests** - Validates character creation with various configurations
- **Dice Rolling Tests** - Tests all dice mechanics including advantage/disadvantage
- **Inventory Management Tests** - Tests item management, equipment, and weight calculations
- **Spell Management Tests** - Tests wizard spell preparation, casting, and slot management
- **Character Validation Tests** - Tests character data validation and error detection

## Test Characters

The test suite includes diverse pre-configured characters representing different D&D archetypes:

### Core Test Characters

1. **Sir Gareth Ironshield** (Human Fighter, Level 5)
   - Classic tank build with high Strength and Constitution
   - Tests: Equipment management, combat mechanics, saving throws

2. **Elaria Moonweaver** (High Elf Wizard, Level 3)
   - Spellcaster build with high Intelligence
   - Tests: Spell management, cantrips, spell slot mechanics

3. **Finn Lightfingers** (Lightfoot Halfling Rogue, Level 4)
   - Skill-focused build with high Dexterity
   - Tests: Skill checks, stealth mechanics, sneak attack

4. **Bahamut Goldscale** (Gold Dragonborn Paladin, Level 2)
   - Divine warrior with high Charisma
   - Tests: Divine magic, breath weapons, lay on hands

5. **Thorin Stonebeard** (Mountain Dwarf Cleric, Level 6)
   - Divine spellcaster with balanced stats
   - Tests: Divine spellcasting, channel divinity, healing

6. **Zara Hellborn** (Tiefling Warlock, Level 1)
   - Otherworldly patron build
   - Tests: Warlock mechanics, short rest recovery, eldritch invocations

### Edge Case Characters

The test suite also includes characters designed to test validation:

- **Invalid Level Character** - Tests level validation (level 25)
- **Invalid Ability Scores Character** - Tests ability score validation
- **Missing Fields Character** - Tests required field validation
- **Inconsistent Data Character** - Tests data consistency validation

## Running Tests

### Prerequisites

```bash
npm install
```

### Individual Test Suites

```bash
# Character creation tests
npm run test:characters

# Dice rolling tests
npm run test:dice

# Inventory management tests
npm run test:inventory

# Spell management tests (wizard)
npm run test:spells

# Character validation tests
npm run test:validation
```

### Comprehensive Testing

```bash
# Run all tests
npm test

# Run all tests with coverage
npm run test:coverage

# Run comprehensive test suite with validation
node scripts/test-all-characters.js

# CI-friendly test run
npm run test:ci
```

### Watch Mode

```bash
# Run tests in watch mode during development
npm run test:watch
```

## Test Coverage

The test suite aims for comprehensive coverage:

- **Character Creation**: 95%+ coverage
- **Dice Rolling**: 100% coverage (deterministic with mocked random)
- **Inventory Management**: 90%+ coverage
- **Spell Management**: 85%+ coverage
- **Validation**: 95%+ coverage

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/coverage-summary.json` - JSON summary
- `coverage/lcov.info` - LCOV format for CI integration

## Test Data Structure

### Test Character Data

Test characters are defined in `tests/data/testCharacters.ts` with the following structure:

```typescript
export const testFighter: Partial<DNDCharacter> = {
  name: "Sir Gareth Ironshield",
  level: 5,
  class: { name: "Fighter", level: 5, hitDie: 10 },
  race: { name: "Human", size: "Medium", speed: 30, traits: [] },
  abilityScores: createTestAbilityScores(16, 14, 15, 12, 13, 10),
  // ... additional properties
};
```

### Helper Functions

- `createTestAbilityScores(str, dex, con, int, wis, cha)` - Creates ability score objects
- `createCompleteCharacter(partial)` - Creates complete character from partial data
- `createEmptyInventory()` - Creates empty inventory structure

## Continuous Integration

### GitHub Actions Workflow

The CI/CD pipeline (`.github/workflows/ci.yml`) includes:

1. **Test Suite** - Runs on Node.js 18.x, 20.x, 21.x
2. **Security Scan** - Audits dependencies for vulnerabilities
3. **Code Quality** - Checks formatting and complexity
4. **Character Validation** - Validates all test characters
5. **Compatibility Tests** - Tests on Ubuntu, Windows, macOS
6. **Performance Tests** - Basic performance benchmarking
7. **Deployment Readiness** - Prepares deployment artifacts

### Workflow Triggers

- **Push to main/develop** - Full test suite
- **Pull requests to main** - Full test suite with compatibility checks
- **Manual trigger** - Available for ad-hoc testing

### Test Artifacts

- Test results and coverage reports
- Build artifacts
- Performance benchmarks
- Deployment packages

## Test Development Guidelines

### Adding New Test Characters

1. Define character in `tests/data/testCharacters.ts`
2. Include diverse ability scores and class features
3. Add validation tests for the character
4. Update this documentation

### Writing New Tests

1. Follow existing test patterns and naming conventions
2. Use descriptive test names that explain what is being tested
3. Include both positive and negative test cases
4. Mock external dependencies (like `Math.random` for dice)
5. Test edge cases and error conditions

### Test Categories

- **Unit Tests** - Test individual functions and components
- **Integration Tests** - Test interactions between components
- **Validation Tests** - Test data validation and error handling
- **Performance Tests** - Test performance characteristics
- **Compatibility Tests** - Test cross-platform compatibility

## Debugging Tests

### Common Issues

1. **Mock Issues** - Ensure `Math.random` is properly mocked for dice tests
2. **File Cleanup** - Tests clean up temporary files in `afterEach`
3. **Async Operations** - Use proper async/await for file operations
4. **Type Issues** - Ensure test data matches TypeScript interfaces

### Debug Commands

```bash
# Run specific test file
npm test -- character.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage and open report
npm run test:coverage && open coverage/lcov-report/index.html
```

## Performance Testing

### Benchmarks

The test suite includes basic performance benchmarks:

- Character creation: < 10ms per character
- Dice rolling: < 1ms per roll
- Inventory operations: < 5ms per operation
- Spell management: < 10ms per operation

### Load Testing

For load testing the MCP server:

```bash
# Start server in background
npm start &

# Run load tests (placeholder)
echo "Load testing placeholder - implement with your preferred tool"

# Stop server
pkill -f "node dist/index.js"
```

## Contributing

When contributing to the test suite:

1. Ensure all tests pass: `npm run test:ci`
2. Maintain or improve test coverage
3. Add tests for new functionality
4. Update documentation for new test characters or scenarios
5. Follow the existing code style and patterns

## Troubleshooting

### Common Test Failures

1. **TypeScript compilation errors** - Run `npm run build` to check for type issues
2. **Missing test data** - Ensure all test characters are properly exported
3. **File system issues** - Check file permissions and cleanup in tests
4. **Random seed issues** - Ensure proper mocking of random functions

### Getting Help

- Check the GitHub Actions logs for CI failures
- Review test output for specific error messages
- Ensure all dependencies are installed with `npm ci`
- Clear build artifacts with `npm run clean` if needed

---

This comprehensive test suite ensures the D&D 5e Character MCP Server is robust, reliable, and ready for production use. The diverse test characters and thorough validation help catch issues early and maintain code quality.