#!/usr/bin/env node

/**
 * Script de migration architecture Pass Culture
 * Objectif: Automatiser le passage de 28 contextes → 8-10 contextes
 * Usage: node migration.js [command]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
let chalk;
try {
  chalk = require('chalk');
} catch (e) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Missing dependency: chalk');
  console.error('Please run: npm install chalk');
  process.exit(1);
}

// ==================== CONFIGURATION ====================

const CONFIG = {
  srcPath: './src',
  contextsPath: './src/contexts',
  featuresPath: './src/features',
  reports: {
    baseline: './reports/architecture-baseline.json',
    current: './reports/architecture-current.json',
    diff: './reports/architecture-diff.json'
  },
  migration: {
    phase1: ['Foundation', 'ESLint rules', 'Bundle analyzer'],
    phase2: ['AuthContext', 'LocationContext', 'SettingsContext'],
    phase3: ['SearchContext', 'HomeContext', 'OfferContext']
  }
};

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Execute command and return output
 */
function executeCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    }).trim();
  } catch (error) {
    console.error(chalk.red(`❌ Erreur commande: ${command}`));
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Scan filesystem for patterns
 */
function scanForPatterns(directory, patterns) {
  const results = {};
  
  patterns.forEach(pattern => {
    try {
      const command = `grep -r "${pattern}" ${directory} --include="*.ts" --include="*.tsx" -l`;
      const files = executeCommand(command, { silent: true }).split('\n').filter(Boolean);
      results[pattern] = files;
    } catch (error) {
      results[pattern] = [];
    }
  });
  
  return results;
}

/**
 * Count lines of code in directory
 */
function countLinesOfCode(directory, extensions = ['.ts', '.tsx']) {
  let totalLines = 0;
  let totalFiles = 0;
  
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDir(filePath);
      } else if (extensions.some(ext => file.endsWith(ext))) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;
        totalFiles++;
      }
    });
  }
  
  scanDir(directory);
  return { totalLines, totalFiles };
}

// ==================== COMMANDS ====================

/**
 * Génère baseline architecture actuelle
 */
function generateBaseline() {
  console.log(chalk.blue('📊 Génération baseline architecture...'));
  
  const contextPatterns = [
    'createContext',
    'React.createContext',
    'useContext',
    'Context.Provider',
    // 'Context.Consumer'
  ];
  
  const architecturePatterns = [
    'useState',
    'useEffect', 
    'useQuery',
    'useMutation',
    // 'create\\(', // Zustand
    'Provider>'
  ];
  
  const contextFiles = scanForPatterns(CONFIG.srcPath, contextPatterns);
  const architectureFiles = scanForPatterns(CONFIG.srcPath, architecturePatterns);
  const codeStats = countLinesOfCode(CONFIG.srcPath);
  
  // Compte spécifique des contextes
  const contextsInContextsFolder = fs.existsSync(CONFIG.contextsPath) 
    ? fs.readdirSync(CONFIG.contextsPath).filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length
    : 0;
  
  const baseline = {
    timestamp: new Date().toISOString(),
    contexts: {
      createContextUsages: contextFiles['createContext']?.length || 0,
      reactCreateContextUsages: contextFiles['React.createContext']?.length || 0,
      useContextUsages: contextFiles['useContext']?.length || 0,
      providerUsages: contextFiles['Context.Provider']?.length || 0,
      contextsFiles: contextsInContextsFolder,
      totalContextRelatedFiles: new Set([
        ...contextFiles['createContext'] || [],
        ...contextFiles['React.createContext'] || [],
        ...contextFiles['useContext'] || []
      ]).size
    },
    architecture: {
      useStateFiles: architectureFiles['useState']?.length || 0,
      useEffectFiles: architectureFiles['useEffect']?.length || 0,
      useQueryFiles: architectureFiles['useQuery']?.length || 0,
      useMutationFiles: architectureFiles['useMutation']?.length || 0,
      zustandFiles: architectureFiles['create\\(']?.length || 0,
      providerFiles: architectureFiles['Provider>']?.length || 0
    },
    codeStats,
    objective: {
      contexts: { current: contextsInContextsFolder, target: 10 },
      performance: { current: '4s P95', target: '<2s P95' },
      bundle: { current: '18.7MB', target: '<15MB' }
    }
  };
  
  // Sauvegarde baseline
  fs.mkdirSync(path.dirname(CONFIG.reports.baseline), { recursive: true });
  fs.writeFileSync(CONFIG.reports.baseline, JSON.stringify(baseline, null, 2));
  
  console.log(chalk.green('✅ Baseline générée:'));
  console.log(chalk.white(`   📁 Contextes identifiés: ${baseline.contexts.totalContextRelatedFiles}`));
  console.log(chalk.white(`   📁 Fichiers contexts/: ${baseline.contexts.contextsFiles}`));
  console.log(chalk.white(`   📊 React Query usage: ${baseline.architecture.useQueryFiles} fichiers`));
  console.log(chalk.white(`   📊 Zustand usage: ${baseline.architecture.zustandFiles} fichiers`));
  console.log(chalk.white(`   📈 Code: ${baseline.codeStats.totalFiles} fichiers, ${baseline.codeStats.totalLines} lignes`));
}

/**
 * Lance l'analyse ESLint avec les nouvelles règles
 */
function runArchitectureLint() {
  console.log(chalk.blue('🔍 Analyse ESLint architecture...'));
  
  try {
    // Test des règles sur la codebase
    executeCommand('npx eslint src/ --ext .ts,.tsx --format json > reports/eslint-architecture.json || true');
    
    // Parse les résultats
    const results = JSON.parse(fs.readFileSync('./reports/eslint-architecture.json', 'utf8'));
    
    const violations = results.reduce((acc, file) => {
      file.messages.forEach(message => {
        if (message.ruleId && message.ruleId.startsWith('pass-culture/')) {
          if (!acc[message.ruleId]) acc[message.ruleId] = [];
          acc[message.ruleId].push({
            file: file.filePath,
            line: message.line,
            message: message.message
          });
        }
      });
      return acc;
    }, {});
    
    console.log(chalk.green('✅ Analyse ESLint terminée:'));
    Object.entries(violations).forEach(([rule, issues]) => {
      console.log(chalk.white(`   🚨 ${rule}: ${issues.length} violations`));
    });
    
    // Recommandations
    if (violations['pass-culture/no-new-contexts']?.length > 0) {
      console.log(chalk.yellow('\n💡 Action: Bloquer création nouveaux contextes activée'));
    }
    
    return violations;
    
  } catch (error) {
    console.error(chalk.red('❌ Erreur analyse ESLint:'), error.message);
  }
}

/**
 * Génère rapport de migration par phase
 */
function generateMigrationReport(phase = 'all') {
  console.log(chalk.blue(`📋 Rapport migration Phase ${phase}...`));
  
  const baseline = JSON.parse(fs.readFileSync(CONFIG.reports.baseline, 'utf8'));
  const current = {
    timestamp: new Date().toISOString(),
    phase,
    ...generateBaseline
  };
  
  // Calculs des deltas
  const contextsDelta = current.contexts?.totalContextRelatedFiles - baseline.contexts.totalContextRelatedFiles;
  const reactQueryDelta = current.architecture?.useQueryFiles - baseline.architecture.useQueryFiles;
  
  const report = {
    baseline: baseline.timestamp,
    current: current.timestamp,
    phase,
    progress: {
      contexts: {
        baseline: baseline.contexts.totalContextRelatedFiles,
        current: current.contexts?.totalContextRelatedFiles || 0,
        delta: contextsDelta,
        target: 10,
        progressPercent: Math.max(0, (baseline.contexts.totalContextRelatedFiles - (current.contexts?.totalContextRelatedFiles || 0)) / (baseline.contexts.totalContextRelatedFiles - 10) * 100)
      },
      reactQuery: {
        baseline: baseline.architecture.useQueryFiles,
        current: current.architecture?.useQueryFiles || 0,
        delta: reactQueryDelta,
        adoptionPercent: ((current.architecture?.useQueryFiles || 0) / baseline.contexts.totalContextRelatedFiles) * 100
      }
    },
    recommendations: []
  };
  
  // Recommandations basées sur les données
  if (contextsDelta > 0) {
    report.recommendations.push('🚨 ALERTE: Nouveaux contextes détectés. Vérifier règle ESLint no-new-contexts');
  }
  
  if (reactQueryDelta > 5) {
    report.recommendations.push('✅ Bonne progression React Query. Continuer migration contextes serveur');
  }
  
  if (report.progress.contexts.progressPercent > 50) {
    report.recommendations.push('🎯 Phase 2 ready: Migrer AuthContext, LocationContext, SettingsContext');
  }
  
  fs.writeFileSync(CONFIG.reports.current, JSON.stringify(report, null, 2));
  
  console.log(chalk.green('✅ Rapport généré:'));
  console.log(chalk.white(`   📊 Progression contextes: ${report.progress.contexts.progressPercent.toFixed(1)}%`));
  console.log(chalk.white(`   📈 Adoption React Query: ${report.progress.reactQuery.adoptionPercent.toFixed(1)}%`));
  
  report.recommendations.forEach(rec => {
    console.log(chalk.cyan(`   💡 ${rec}`));
  });
  
  return report;
}

/**
 * Aide et usage
 */
function showHelp() {
  console.log(chalk.cyan('🏗️  Script Migration Architecture Pass Culture'));
  console.log(chalk.white('\nCommandes disponibles:'));
  console.log(chalk.white('  baseline       Génère baseline architecture actuelle'));
  console.log(chalk.white('  lint          Lance analyse ESLint avec règles architecture'));  
  console.log(chalk.white('  report        Génère rapport migration avec métriques'));
  console.log(chalk.white('  status        Affiche status actuel vs objectifs'));
  console.log(chalk.white('  help          Affiche cette aide'));
  console.log(chalk.yellow('\nExemples:'));
  console.log(chalk.white('  node architecture-migration.js baseline'));
  console.log(chalk.white('  node architecture-migration.js lint'));
  console.log(chalk.white('  node architecture-migration.js report phase2'));
}

// ==================== MAIN EXECUTION ====================

const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case 'baseline':
    generateBaseline();
    break;
    
  case 'lint':
    runArchitectureLint();
    break;
    
  case 'report':
    generateMigrationReport(argument);
    break;
    
  case 'status':
    if (fs.existsSync(CONFIG.reports.baseline)) {
      generateMigrationReport('current');
    } else {
      console.log(chalk.red('❌ Aucune baseline trouvée. Lancez: node architecture-migration.js baseline'));
    }
    break;
    
  case 'help':
  default:
    showHelp();
    break;
}

// ==================== EXPORT POUR TESTS ====================

module.exports = {
  generateBaseline,
  runArchitectureLint,
  generateMigrationReport,
  CONFIG
};