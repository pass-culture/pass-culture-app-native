import { getRemoteConfig } from 'firebase/remote-config'

import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'

import initializeApp from '../firebase-init'

const app = initializeApp()

const remoteConfig = getRemoteConfig(app)
remoteConfig.defaultConfig = DEFAULT_REMOTE_CONFIG

export default remoteConfig
