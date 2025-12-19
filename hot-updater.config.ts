/* eslint-disable import/no-extraneous-dependencies */

import { bare } from '@hot-updater/bare'
import { firebaseDatabase, firebaseStorage } from '@hot-updater/firebase'
import { withSentry } from '@hot-updater/sentry-plugin'
import { config } from 'dotenv'
import * as admin from 'firebase-admin'
import { defineConfig } from 'hot-updater'

const ENV = process.env.NODE_ENV || 'local'

config({ path: `.env.${ENV}` })
config()

const credential = admin.credential.applicationDefault()

export default defineConfig({
  build: withSentry(bare({ enableHermes: true, sourcemap: true }), {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }),
  storage: firebaseStorage({
    projectId: process.env.HOT_UPDATER_FIREBASE_PROJECT_ID,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    storageBucket: process.env.HOT_UPDATER_FIREBASE_STORAGE_BUCKET!,
    credential,
  }),
  database: firebaseDatabase({
    projectId: process.env.HOT_UPDATER_FIREBASE_PROJECT_ID,
    credential,
  }),
  updateStrategy: 'appVersion',
})
