#!/usr/bin/env node

/**
 * Comprehensive test runner for D&D Character MCP Server
 * This script runs all test characters through validation and functionality tests
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.blue}Running: ${description}${colors.reset}`);
  log(`Command: ${command}`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    });
    log(`${colors.green}✅ ${description} - PASSED${colors.reset}`);
    return { success: true, output };
  } catch (error) {
    log(`${colors.red}❌ ${description} - FAILED${colors.reset}`);
    log(`Error: ${error.message}`);
    if (error.stdout) log(`stdout: ${error.stdout}`);
    if (error.stderr) log(`stderr: ${error.stderr}`);
    return { success: false, error: error.message };
  }
}

function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => r.success === false).length
    },
    results
  };

  const reportPath = path.join(process.cwd(), 'test-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n${colors.blue}Test report saved to: ${reportPath}${colors.reset}`);

  return report;
}

async function main() {
  log(`${colors.bold}${colors.blue}D&D Character MCP Server - Comprehensive Test Suite${colors.reset}`);
  log(`${colors.blue}Starting comprehensive testing...${colors.reset}\n`);

  const testSuites = [
    {
      name: 'TypeScript Compilation',
      command: 'npm run build',
      description: 'Build the project and check for TypeScript errors'
    },
    {
      name: 'Character Creation Tests',
      command: 'npm run test:characters',
      description: 'Test character creation functionality with various configurations'
    },
    {
      name: 'Dice Rolling Tests',
      command: 'npm run test:dice',
      description: 'Test dice rolling mechanics including advantage/disadvantage'
    },
    {
      name: 'Inventory Management Tests',
      command: 'npm run test:inventory',
      description: 'Test inventory, equipment, and item management'
    },
    {
      name: 'Spell Management Tests',
      command: 'npm run test:spells',
      description: 'Test spell preparation, casting, and slot management'
    },
    {
      name: 'Character Validation Tests',
      command: 'npm run test:validation',
      description: 'Test character data validation and error detection'
    },
    {
      name: 'Full Test Suite with Coverage',
      command: 'npm run test:coverage',
      description: 'Run all tests with coverage reporting'
    }
  ];

  const results = [];

  for (const suite of testSuites) {
    const result = runCommand(suite.command, suite.description);
    results.push({
      name: suite.name,
      description: suite.description,
      command: suite.command,
      ...result
    });

    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Generate test report
  const report = generateTestReport(results);

  // Print summary
  log(`\n${colors.bold}${colors.blue}=== TEST SUMMARY ===${colors.reset}`);
  log(`Total test suites: ${report.summary.total}`);
  log(`${colors.green}Passed: ${report.summary.passed}${colors.reset}`);
  log(`${colors.red}Failed: ${report.summary.failed}${colors.reset}`);

  if (report.summary.failed > 0) {
    log(`\n${colors.red}${colors.bold}Some tests failed. Check the output above for details.${colors.reset}`);
    process.exit(1);
  } else {
    log(`\n${colors.green}${colors.bold}All tests passed! 🎉${colors.reset}`);
  }

  // Additional validation
  log(`\n${colors.blue}Running additional validation checks...${colors.reset}`);

  // Check if all test characters are properly defined
  try {
    const testCharactersPath = path.join(process.cwd(), 'tests', 'data', 'testCharacters.ts');
    const testCharactersContent = readFileSync(testCharactersPath, 'utf8');
    
    const expectedCharacters = [
      'testFighter',
      'testWizard', 
      'testRogue',
      'testPaladin',
      'testCleric',
      'testWarlock'
    ];

    const missingCharacters = expectedCharacters.filter(char => 
      !testCharactersContent.includes(`export const ${char}`)
    );

    if (missingCharacters.length > 0) {
      log(`${colors.yellow}Warning: Missing test characters: ${missingCharacters.join(', ')}${colors.reset}`);
    } else {
      log(`${colors.green}✅ All test characters are properly defined${colors.reset}`);
    }
  } catch (error) {
    log(`${colors.yellow}Warning: Could not validate test characters: ${error.message}${colors.reset}`);
  }

  // Check test coverage
  try {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
    const totalCoverage = coverage.total.lines.pct;
    
    log(`\n${colors.blue}Test Coverage: ${totalCoverage}%${colors.reset}`);
    
    if (totalCoverage >= 80) {
      log(`${colors.green}✅ Excellent test coverage (≥80%)${colors.reset}`);
    } else if (totalCoverage >= 70) {
      log(`${colors.yellow}⚠️ Good test coverage (70-79%)${colors.reset}`);
    } else {
      log(`${colors.red}❌ Low test coverage (<70%) - Consider adding more tests${colors.reset}`);
    }
  } catch (error) {
    log(`${colors.yellow}Warning: Could not read coverage report: ${error.message}${colors.reset}`);
  }

  log(`\n${colors.blue}Testing completed successfully!${colors.reset}`);
  log(`${colors.blue}You can now commit your changes with confidence.${colors.reset}\n`);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`${colors.red}Uncaught Exception: ${error.message}${colors.reset}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`${colors.red}Unhandled Rejection at: ${promise}, reason: ${reason}${colors.reset}`);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`${colors.red}Test runner failed: ${error.message}${colors.reset}`);
  process.exit(1);
});