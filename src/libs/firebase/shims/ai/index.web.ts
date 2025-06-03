import firebase from 'firebase/compat/app'
/* eslint-disable-next-line no-restricted-imports */
import { getAI, GoogleAIBackend } from '@firebase/ai'
import { initializeVertexApp } from '../firebase-init'

export const ai = getAI(initializeVertexApp(), { backend: new GoogleAIBackend() })
