// import firebase from 'firebase/app'
import firebase from '@firebase/app'
// import firebase from 'firebase/compat/app'
/* eslint-disable-next-line no-restricted-imports */
const { getAI, GoogleAIBackend } = require('@firebase/ai')
// import { getAI, GoogleAIBackend } from '@firebase/ai/dist/index.cjs'
import { initializeVertexApp } from '../firebase-init'

export const ai = getAI(initializeVertexApp(), { backend: new GoogleAIBackend() })
