/* eslint-disable import/no-extraneous-dependencies */

import { bare } from '@hot-updater/bare'
import { firebaseStorage, firebaseDatabase } from '@hot-updater/firebase'
import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin'
import { defineConfig } from 'hot-updater'

const credential = admin.credential.applicationDefault()

const ENV = process.env.NODE_ENV || 'development'

dotenv.config({ path: `.env.${ENV}` })
dotenv.config()

export default defineConfig({
  updateStrategy: 'appVersion',
  build: bare({
    enableHermes: true,
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
})
