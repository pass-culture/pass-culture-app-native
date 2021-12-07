import { getBatchSDK } from 'libs/batch/batch-sdk'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'

/* eslint-disable no-console */
export const Batch = {
  start() {
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
          text: 'Découvre les nouvelles offres en exclusivité sur ton pass en activant les notifications !',
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

    try {
      window.batchSDK('setup', options)
      window.batchSDK((api) => api.ui.show('alert'))
    } catch (error) {
      eventMonitoring.captureException(error)
    }
  },
}

export const BatchUser = {
  getInstallationID() {
    return new Promise((resolve, reject) => {
      try {
        window.batchSDK((api) => api.getInstallationID().then(resolve).catch(reject))
      } catch (error) {
        eventMonitoring.captureException(error)
      }
    })
  },
  editor() {
    return this
  },
  setIdentifier(id: string) {
    try {
      window.batchSDK((api) => api.setCustomUserID(id))
    } catch (error) {
      eventMonitoring.captureException(error)
    }
    return this
  },
  save() {
    return
  },
}

export const BatchPush = {
  registerForRemoteNotifications() {
    getBatchSDK()
    Batch.start()
  },
}
