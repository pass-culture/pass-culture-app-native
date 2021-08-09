import { getBatchSDK } from 'libs/batch/batch-sdk'
import { env } from 'libs/environment'

/* eslint-disable no-console */
export const Batch = {
  start() {
    getBatchSDK()
    /* Initiate Batch SDK opt-in UI configuration (native prompt) */
    let batchSDKUIConfig

    /* Use a specific configuration for the Firefox web browser (custom prompt) */
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      batchSDKUIConfig = {
        alert: {
          attach: 'top center',
          autoShow: false,
          btnWidth: '200',
          positiveSubBtnLabel: 'Activer les notifications',
          negativeBtnLabel: 'Plus tard',
          positiveBtnStyle: { backgroundColor: '#eb0055', hoverBackgroundColor: '#c10046' },
          icon: 'favicon.ico',
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
    window.batchSDK('setup', {
      apiKey: env.BATCH_API_KEY_WEB,
      subdomain: env.BATCH_SUBDOMAIN,
      authKey: env.BATCH_AUTH_KEY,
      vapidPublicKey: env.BATCH_VAPID_PUBLIC_KEY,
      ui: batchSDKUIConfig,
      defaultIcon: env.PUBLIC_URL + '/images/ic_launcher_xxxhdpi.png',
      smallIcon: env.PUBLIC_URL + '/images/app-icon-android-notif-mask.png', // for Chrome Android
      useExistingServiceWorker: true,
      sameOrigin: !__DEV__,
    })
    window.batchSDK((api) => {
      api.ui.show('alert')
    })
  },
}

export const BatchUser = {
  getInstallationID() {
    return new Promise((resolve, reject) => {
      window.batchSDK(function (api) {
        api.getInstallationID().then(resolve).catch(reject)
      })
    })
  },
  editor() {
    return this
  },
  setIdentifier(id: string) {
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
