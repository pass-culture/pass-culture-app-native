// TODO: remove this condition when BatchSDK will support Safari, see also service-worker.ts#L11
// eslint-disable-next-line no-restricted-imports
import { isSafari, isMobileSafari, isMacOs } from 'react-device-detect'

import { getBatchSDK } from 'libs/batch/batch-sdk'
import { env } from 'libs/environment'

const disabled = isMobileSafari || (isSafari && !isMacOs)

/* eslint-disable no-console */
export const Batch = {
  start() {
    if (disabled) {
      return
    }
    getBatchSDK()
    /* Initiate Batch SDK opt-in UI configuration (native prompt) */
    let batchSDKUIConfig

    /* Use a specific configuration for the Firefox and Safari web browser (custom prompt) */
    if (
      navigator.userAgent.indexOf('Firefox') !== -1 ||
      navigator.userAgent.indexOf('Safari') !== -1
    ) {
      batchSDKUIConfig = {
        alert: {
          attach: 'top center',
          autoShow: false,
          btnWidth: '200',
          positiveSubBtnLabel: 'Activer les notifications',
          negativeBtnLabel: 'Plus tard',
          positiveBtnStyle: { backgroundColor: '#eb0055', hoverBackgroundColor: '#c10046' },
          icon: env.PUBLIC_URL + '/images/ic_launcher_xxxhdpi.png',
          text:
            'Découvre les nouvelles offres en exclusivité sur ton pass en activant les notifications !',
        },
      }
    } else {
      batchSDKUIConfig = {
        native: {},
      }
    }
    /* Finalize the Batch SDK setup */
    /* eslint-disable-next-line */
    const options = {
      apiKey: env.BATCH_API_KEY_WEB,
      subdomain: env.BATCH_SUBDOMAIN,
      authKey: env.BATCH_AUTH_KEY,
      vapidPublicKey: env.BATCH_VAPID_PUBLIC_KEY,
      ui: batchSDKUIConfig,
      defaultIcon: env.PUBLIC_URL + '/images/ic_launcher_xxxhdpi.png',
      smallIcon: env.PUBLIC_URL + '/images/app-icon-android-notif.png', // for Chrome Android
      useExistingServiceWorker: true,
      dev: __DEV__,
      safari: {
        [env.PUBLIC_URL]: `web.passculture${env.ENV === 'production' ? '' : `.${env.ENV}`}`,
      },
    }

    window.batchSDK('setup', options)
    window.batchSDK((api) => {
      api.ui.show('alert')
    })
  },
}

export const BatchUser = {
  getInstallationID() {
    return new Promise((resolve, reject) => {
      if (disabled) {
        resolve('BATCH_NOT_AVAILABLE')
        return
      }
      window.batchSDK(function (api) {
        api.getInstallationID().then(resolve).catch(reject)
      })
    })
  },
  editor() {
    return this
  },
  setIdentifier(id: string) {
    if (disabled) {
      return this
    }
    window.batchSDK(function (api) {
      api.setCustomUserID(id)
    })
    return this
  },
  save() {
    return
  },
}

export const BatchPush = {
  registerForRemoteNotifications() {
    return
  },
}
