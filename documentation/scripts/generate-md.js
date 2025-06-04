// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GoogleGenAI } = require('@google/genai')
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' })

const ai = new GoogleGenAI({ apiKey: process.env.TEST_KEY })

const instructionsUnitTests = `À partir de ces informations, génère une documentation qui\u00a0:
1. Identifie le nom de la fonctionnalité principale.
2. Regroupe les comportements par contextes ou scénarios distincts (par exemple, "utilisateur connecté avec mot de passe", "utilisateur connecté via SSO", "utilisateur déconnecté", "avec paramètres d'URL spécifiques", etc.).
3. Pour chaque contexte/scénario, résume les règles de gestion ou les comportements attendus du système, en te basant sur les descriptions "should..." ou les actions décrites.
4. Utilise un langage clair et accessible, comme si tu rédigeais une documentation technique pour des développeurs ou des chefs de produit.
5. Structure la sortie avec des titres et des listes à puces pour une meilleure lisibilité.
6. Si possible, ajoute un titre général pour la documentation de la fonctionnalité.
Ne te contente pas de lister les tests, mais interprète-les pour décrire le fonctionnement de la fonctionnalité.

Le résultat doit être un .md pour pouvoir l’intégrer directement dans un Docusaurus - il ne faut pas ajouter la balise md dans le résultat pour qu'il puisse s'afficher correctement.
Ne rajoute pas de sous titre comme "Documentation de la fonctionnalité  xxxx" ne nom du composant ou de la fonctionnalité en titre est suffisant.
 `

const INPUT_DIR = 'documentation/outputs'
const DOCUSAURUS_DIR = 'AJSMD/docs/tests-unitaires'

function formatName(fileName) {
  // Enlève les extensions et nettoie le nom du composant
  return fileName
    .replace(/\.native\.test\.tsx\.md$/, '')
    .replace(/\.native\.test\.ts\.md$/, '')
    .replace(/\.test\.ts\.md$/, '')
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

async function processFile(file) {
  const parts = file.replace('.md', '').split('_')
  const [namespace, ...subdirs] = parts

  const baseName = formatName(file)
  const destDir = path.join(DOCUSAURUS_DIR, ...subdirs.slice(0, -1))
  const destPath = path.join(destDir, `${baseName}.md`)
  const slug = `/${namespace}/${subdirs.join('/').toLowerCase()}/${baseName.toLowerCase()}`

  const rawContent = fs.readFileSync(path.join(INPUT_DIR, file), 'utf8')

  // ✨ Appel LLM
  const llmOutput = await callLLM(rawContent + instructionsUnitTests)

  // 🧾 Génère le fichier final
  const frontmatter = `---\ntitle: ${baseName}\nslug: ${slug}\n---\n\n`
  const finalContent = frontmatter + llmOutput

  fs.mkdirSync(destDir, { recursive: true })
  fs.writeFileSync(destPath, finalContent)

  console.log(`✅ Documentation écrite\u00a0: ${destPath}`)
}

async function run() {
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.md'))
  const firstFiles = files.slice(100, 110)
  // await processFile(firstFile)
  for (const file of firstFiles) {
    try {
      await processFile(file)
    } catch (err) {
      console.error(`❌ Erreur sur ${file}`, err)
    }
  }
}

run()
