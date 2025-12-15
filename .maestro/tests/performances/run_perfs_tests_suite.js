#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// =============================================================================
// 1. CONFIGURATION
// =============================================================================

// Récupération du Bundle ID depuis les variables d'environnement (défini dans le bash)
const BUNDLE_ID = process.env.BUNDLE_ID || 'app.passculture.staging';

// Définition des chemins absolus (INCHANGÉS)
const REPO_ROOT = path.resolve(__dirname, '../../');
const RESULTS_DIR = path.join(REPO_ROOT, 'perf-results');
const PARSER_SCRIPT = path.join(REPO_ROOT, '../scripts/parse-perf-results.js');

// Liste des scénarios à tester
const SCENARIOS = [
  { 
    name: 'Home', 
    file: '/tests/HomePerformance.yml' 
  },
  { 
      name: 'Search', 
      file: '/tests/SearchPerformance.yml' 
  },
  /*
  { 
    name: 'Booking', 
    file: '.maestro/tests/BookingPerformance.yml' 
  },
  */
];

// =============================================================================
// 2. INITIALISATION
// =============================================================================

console.log(`\n🚀 Démarrage de l'orchestrateur de performance`);
console.log(`🎯 App Bundle: ${BUNDLE_ID}`);
console.log(`📂 Répertoire de résultats: ${RESULTS_DIR}`);

// Création du dossier de résultats s'il n'existe pas
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Objet qui contiendra le rapport final de tous les écrans
const finalReport = {};
let globalFailure = false;

// =============================================================================
// 3. EXECUTION DES SCENARIOS
// =============================================================================

SCENARIOS.forEach((scenario) => {
  console.log(`\n---------------------------------------------------`);
  console.log(`📱 Test en cours : ${scenario.name}`);
  console.log(`---------------------------------------------------`);

  const yamlPath = path.join(REPO_ROOT, scenario.file);
  const resultJsonPath = path.join(RESULTS_DIR, `result_${scenario.name}.json`);

  // Vérification que le fichier YAML existe bien
  if (!fs.existsSync(yamlPath)) {
    console.error(`❌ ERREUR: Le fichier scénario est introuvable: ${yamlPath}`);
    finalReport[scenario.name] = { status: 'skipped', reason: 'YAML missing' };
    return;
  }

  // Commande interne exécutée par Flashlight (Maestro)
  const maestroCommand = `MAESTRO_APP_ID=${BUNDLE_ID} maestro test ${yamlPath}`;

  // Commande Flashlight
  const flashlightCmd = `flashlight test --bundleId "${BUNDLE_ID}" --testCommand "${maestroCommand}" --resultsFilePath "${resultJsonPath}" --duration 15000 --iterationCount 5`;

  try {
    // A. Lancement du test
    console.log(`Running Flashlight...`);
    execSync(flashlightCmd, { stdio: 'inherit' });

    // B. Parsing des résultats via ton script existant
    if (fs.existsSync(resultJsonPath)) {
      console.log(`📊 Traitement des résultats avec ${path.basename(PARSER_SCRIPT)}...`);
      
      let parsedScore = "N/A";
      try {
        // On capture la sortie (stdout) pour récupérer la note
        const output = execSync(`node "${PARSER_SCRIPT}" "${resultJsonPath}"`, { encoding: 'utf8' });
        
        // On nettoie la sortie pour avoir juste la note
        parsedScore = output.trim();
        console.log(`✅ Score brut récupéré : ${parsedScore}`);
      } catch (parseErr) {
        console.error(`⚠️ Erreur lors du parsing : ${parseErr.message}`);
        parsedScore = "Error Parsing";
      }

      // Ajout au rapport global
      finalReport[scenario.name] = {
        status: 'success',
        score: parsedScore,
        raw_file: resultJsonPath
      };

    } else {
      console.error(`❌ Erreur: Le fichier de résultats JSON n'a pas été généré.`);
      finalReport[scenario.name] = { status: 'failed', reason: 'No JSON output' };
      globalFailure = true;
    }

  } catch (err) {
    console.error(`❌ CRASH: Une erreur est survenue durant le test ${scenario.name}`);
    console.error(err.message);
    finalReport[scenario.name] = { status: 'crash', error: err.message };
    globalFailure = true;
  }
});

// =============================================================================
// 4. GENERATION DU RAPPORT GLOBAL & RECAP
// =============================================================================

const globalReportPath = path.join(RESULTS_DIR, 'global_report.json');
fs.writeFileSync(globalReportPath, JSON.stringify(finalReport, null, 2));

console.log(`\n===================================================`);
console.log(`🏁 Suite de tests terminée.`);
console.log(`📄 Rapport global JSON généré : ${globalReportPath}`);
console.log(`===================================================`);

// --- NOUVEAU BLOC : Affichage propre du récapitulatif des notes ---
console.log(`\n📊 RÉCAPITULATIF DES SCORES`);
console.log(`---------------------------`);

// On itère sur le rapport pour afficher une ligne par scénario
Object.keys(finalReport).forEach(scenarioName => {
  const data = finalReport[scenarioName];
  
  if (data.status === 'success') {
    // Affiche : "Home : 85" (par exemple)
    // padEnd permet d'aligner l'affichage
    console.log(`✅ ${scenarioName.padEnd(15)} : ${data.score}`);
  } else {
    // Affiche l'erreur si échec
    console.log(`❌ ${scenarioName.padEnd(15)} : ÉCHEC (${data.reason || data.error || 'Unknown'})`);
  }
});

console.log(`---------------------------\n`);

// Affichage final du JSON brut pour le debug CI (comme avant)
// console.log(JSON.stringify(finalReport, null, 2)); // Je l'ai commenté pour éviter le doublon, décommente si nécessaire pour tes logs CI.

if (globalFailure) {
  console.error(`❌ Certains tests techniques ont échoué.`);
  process.exit(1);
} else {
  console.log(`✅ Tous les scénarios ont été exécutés avec succès.`);
  process.exit(0);
}