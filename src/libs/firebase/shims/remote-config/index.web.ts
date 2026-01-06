import { getRemoteConfig } from 'firebase/remote-config'

import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'

import { app } from '../firebase-init'

const firebaseRemoteConfig = getRemoteConfig(app)
//@ts-ignore firebase authorize json to be sent but not in its typing
firebaseRemoteConfig.defaultConfig = DEFAULT_REMOTE_CONFIG

export default firebaseRemoteConfig
