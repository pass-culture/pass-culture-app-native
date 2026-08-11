/// <reference types="node" />

/**
 * CI helper for the native hard-build fingerprint registry (POC).
 *
 * Collection: hardBuilds/{platform}_{fingerprint}
 * Project: HOT_UPDATER_FIREBASE_PROJECT_ID (pc-native-testing)
 *
 * Usage:
 *   yarn ts-node --transpile-only scripts/hardBuildsFingerprint.ts exists --platform ios --fingerprint <hash>
 *   yarn ts-node --transpile-only scripts/hardBuildsFingerprint.ts register --platform ios --fingerprint <hash> \
 *     --testing-uri <url> --firebase-console-uri <url> --env testing --version 1.0.0 --build-number 123
 */

import * as admin from 'firebase-admin'

type Platform = 'ios' | 'android'
type Command = 'exists' | 'register'

type CliArgs = {
  command: Command
  platform: Platform
  fingerprint: string
  testingUri?: string
  firebaseConsoleUri?: string
  env?: string
  version?: string
  buildNumber?: string
  force?: boolean
}

const COLLECTION = 'hardBuilds'

const parseArgs = (argv: string[]): CliArgs => {
  const [command, ...rest] = argv
  if (command !== 'exists' && command !== 'register') {
    throw new Error(`Unknown command "${command}". Expected "exists" or "register".`)
  }

  const get = (flag: string): string | undefined => {
    const index = rest.indexOf(flag)
    if (index === -1) return undefined
    return rest[index + 1]
  }

  const platform = get('--platform')
  const fingerprint = get('--fingerprint')
  if (platform !== 'ios' && platform !== 'android') {
    throw new Error('--platform must be "ios" or "android"')
  }
  if (!fingerprint) {
    throw new Error('--fingerprint is required')
  }

  return {
    command,
    platform,
    fingerprint,
    testingUri: get('--testing-uri'),
    firebaseConsoleUri: get('--firebase-console-uri'),
    env: get('--env'),
    version: get('--version'),
    buildNumber: get('--build-number'),
    force: rest.includes('--force'),
  }
}

const getDocId = (platform: Platform, fingerprint: string) => `${platform}_${fingerprint}`

const initFirestore = () => {
  const projectId = process.env.HOT_UPDATER_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECTID
  if (!projectId) {
    throw new Error('Missing HOT_UPDATER_FIREBASE_PROJECT_ID (or FIREBASE_PROJECTID)')
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    })
  }

  return admin.firestore()
}

const runExists = async (args: CliArgs) => {
  const db = initFirestore()
  const docId = getDocId(args.platform, args.fingerprint)
  const snapshot = await db.collection(COLLECTION).doc(docId).get()
  const payload = {
    exists: snapshot.exists,
    id: docId,
    data: snapshot.exists ? snapshot.data() : null,
  }
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

const runRegister = async (args: CliArgs) => {
  if (!args.testingUri) {
    throw new Error('--testing-uri is required for register')
  }

  const db = initFirestore()
  const docId = getDocId(args.platform, args.fingerprint)
  const docRef = db.collection(COLLECTION).doc(docId)
  const existing = await docRef.get()

  if (existing.exists && !args.force) {
    const payload = { registered: false, skipped: true, id: docId, data: existing.data() }
    process.stdout.write(`${JSON.stringify(payload)}\n`)
    return
  }

  const data = {
    fingerprint: args.fingerprint,
    platform: args.platform,
    env: args.env ?? process.env.ENV ?? 'testing',
    version: args.version ?? null,
    buildNumber: args.buildNumber ? Number(args.buildNumber) : null,
    testingUri: args.testingUri,
    firebaseConsoleUri: args.firebaseConsoleUri ?? null,
    createdAt: existing.exists
      ? (existing.data()?.createdAt ?? admin.firestore.FieldValue.serverTimestamp())
      : admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  await docRef.set(data, { merge: true })
  const payload = { registered: true, skipped: false, id: docId, data }
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

const main = async () => {
  const args = parseArgs(process.argv.slice(2))
  if (args.command === 'exists') {
    await runExists(args)
    return
  }
  await runRegister(args)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`${message}\n`)
  process.exit(1)
})
