/* eslint-disable local-rules/apostrophe-in-text */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GoogleGenAI } = require('@google/genai')
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' })

const ai = new GoogleGenAI({ apiKey: process.env.TEST_KEY })

const instructionsE2eTests = `Agis comme un rédacteur chargé de transformer des fichiers de test technique (écrits pour l'outil Maestro en format YAML) en descriptions de parcours utilisateur qui soient claires et compréhensibles par un public non technique.

**Ton objectif principal est de\u00a0:**
Raconter l'histoire du parcours utilisateur testé, en te concentrant sur ce que l'utilisateur *fait* et ce qu'il *voit* à chaque étape, comme si tu expliquais le fonctionnement de cette fonctionnalité à quelqu'un qui ne connaît rien à la technique.

**Input que tu recevras\u00a0:**
Le contenu complet d'un fichier de test Maestro (format '.yml').

**Instructions pour la sortie\u00a0:**

1.  **Titre principal\u00a0:** Utilise un titre simple et descriptif qui résume le parcours testé (par exemple\u00a0: "Réserver une Séance de Cinéma").
2.  **Introduction (optionnelle mais recommandée)\u00a0:** Une ou deux phrases pour introduire le parcours (par exemple\u00a0: "Ce document vous guide à travers les étapes qu'un utilisateur suit pour [action principale] dans l'application...").
3.  **Structure du contenu\u00a0:**
    * Divise le parcours en grandes étapes logiques, numérotées et avec des sous-titres clairs (par exemple\u00a0: "1. Démarrage et Découverte des Offres", "2. Trouver les Séances et Choisir le Jour").
    * Pour chaque grande étape, utilise des listes à puces pour détailler les actions spécifiques de l'utilisateur ou ce qui s'affiche à l'écran.
4.  **Langage et Ton\u00a0:**
    * Utilise un langage simple, direct et accessible.
    * Évite impérativement le jargon technique issu du fichier de test (par exemple, les noms d'ID d'éléments, les commandes Maestro spécifiques comme 'assertVisible', 'runFlow', 'tapOn', 'index', 'timeout'). Traduis ces actions en langage courant (par exemple, "L'utilisateur appuie sur...", "L'application vérifie que...", "L'écran affiche...").
    * Si le fichier de test mentionne des conditions (par exemple, 'when: visible...') ou des boucles ('repeat'), explique-les comme des scénarios ou des adaptations du parcours (par exemple\u00a0: "Que se passe-t-il si [élément X] n'apparaît pas tout de suite\u00a0? L'application fait alors ceci pour continuer...").
5.  **Ce qu'il faut OMETTRE\u00a0:**
    * Ne mentionne PAS les identifiants techniques comme 'appId'.
    * Ne retranscris PAS les commentaires techniques du fichier de test (comme les 'TODO') à moins qu'ils ne décrivent une expérience utilisateur perceptible (par exemple, un temps de chargement notable peut être mentionné comme "il y a un petit temps de chargement").
    * Ne crée PAS de section de conclusion technique ou de résumé des "points techniques". Le document doit rester focalisé sur la perspective de l'utilisateur non technique.
6.  **Format\u00a0:** La sortie doit être en Markdown simple, facile à lire.

**Exemple de structure à suivre (inspiré du document "Réserver une Séance de Cinéma")\u00a0:**

# [Titre du Parcours]

[Petite introduction]

## 1. [Nom de la première grande étape]

* [Action utilisateur ou observation 1]
* [Action utilisateur ou observation 2]
    * *[Note pour l'utilisateur, si pertinent, par exemple, sur un temps de chargement]*

## 2. [Nom de la deuxième grande étape]

* [Description d'un scénario conditionnel ou d'une boucle, expliquée simplement]
    1.  [Action A dans le scénario]
    2.  [Action B dans le scénario]
* [Action utilisateur principale pour cette étape]

[Continuer avec les autres étapes...]

---
**Génère la documentation du parcours utilisateur en suivant scrupuleusement ces instructions.**

---
**Voici le contenu du fichier de test Maestro\u00a0:**
 `

const INPUT_DIR = '.maestro/tests/subFolder'
const DOCUSAURUS_DIR = 'AJSMD/docs/tests-e2e'

function formatName(fileName) {
  // Enlève les extensions et nettoie le nom du composant
  return fileName
    .replace(/\.native\.test\.tsx\.md$/, '')
    .replace(/\.native\.test\.ts\.md$/, '')
    .replace(/\.test\.ts\.md$/, '')
    .replace('.yml', '')
    .split('_')
    .pop()
}

async function callLLM(input) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: `${input}`,
  })
  return response.text
}
async function processFolder(folder) {
  const files = fs.readdirSync(`${INPUT_DIR}/${folder}`)

  for (const file of files) {
    try {
      await processFile(file, folder)
    } catch (err) {
      console.error(`❌ Erreur sur ${folder}`, err)
    }
  }
}

async function processFile(file, folder) {
  const baseName = formatName(file)
  const destDir = path.join(DOCUSAURUS_DIR, folder)
  const destPath = path.join(destDir, `${baseName}.md`)
  const slug = `/${baseName.toLowerCase()}`

  const rawContent = fs.readFileSync(path.join(`${INPUT_DIR}/${folder}`, file), 'utf8')

  // ✨ Appel LLM
  const llmOutput = await callLLM(rawContent + instructionsE2eTests)

  // 🧾 Génère le fichier final
  const frontmatter = `---\ntitle: ${baseName}\nslug: ${slug}\n---\n\n`
  const finalContent = frontmatter + llmOutput

  fs.mkdirSync(destDir, { recursive: true })
  fs.writeFileSync(destPath, finalContent)

  // eslint-disable-next-line no-console
  console.log(`✅ Documentation écrite\u00a0: ${destPath}`)
}

async function run() {
  const folders = fs.readdirSync(INPUT_DIR).filter((f) => f !== 'analytics')
  processFolder(folders[9])

  // for (const folder of folders) {
  //   processFolder(folder)
  // }
}

run()
