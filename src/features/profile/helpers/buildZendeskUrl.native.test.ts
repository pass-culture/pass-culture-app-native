import { DeviceInformation } from 'features/trustedDevice/helpers/useDeviceInfo'
import { beneficiaryUser } from 'fixtures/user'

import {
  ZENDESK_FORM_URLS,
  buildZendeskUrl,
  buildZendeskUrlForDebug,
  buildZendeskUrlForFraud,
} from './buildZendeskUrl'

const COMMIT_HASH = 'test-commit'
process.env.COMMIT_HASH = COMMIT_HASH

describe('buildZendeskUrl', () => {
  describe('buildZendeskFormUrl', () => {
    it('should build URL with all fields', () => {
      const url = buildZendeskUrl({
        lastName: 'Dupont',
        firstName: 'Jean',
        reason: 'motif_signaler_un_bug',
        account: 'jean@example.com',
        description: 'Le bouton ne marche pas',
        birthDate: '2000-01-15',
      })

      expect(url).toBe(
        ZENDESK_FORM_URLS +
          '&tf_20701989633692=Dupont' +
          '&tf_20701995245852=Jean' +
          '&tf_20669850863388=motif_signaler_un_bug' +
          '&tf_20704397346076=jean%40example.com' +
          '&tf_description=Le%20bouton%20ne%20marche%20pas' +
          '&tf_20701971989276=2000-01-15'
      )
    })

    it('should skip null and undefined fields', () => {
      const url = buildZendeskUrl({
        firstName: 'Jean',
        lastName: null,
        description: undefined,
      })

      expect(url).toBe(ZENDESK_FORM_URLS + '&tf_20701995245852=Jean')
    })

    it('should replace line breaks with <br> in field values', () => {
      const url = buildZendeskUrl({
        description: 'ligne1\nligne2\r\nligne3',
      })

      expect(url).toContain('tf_description=ligne1%3Cbr%3Eligne2%3Cbr%3Eligne3')
    })
  })

  const deviceInfo = {
    deviceId: 'device-123',
    source: 'iPhone 15',
    os: 'iOS 17',
    resolution: '1170x2532',
    fontScale: 1,
    screenZoomLevel: 1.25,
  } as DeviceInformation

  const version = '1.300.0'

  const debugData =
    `App version\u00a0: ${version}<br>` +
    'Device font scale\u00a0: 1<br>' +
    'Device ID\u00a0: device-123<br>' +
    'Device model\u00a0: iPhone 15<br>' +
    'Device OS\u00a0: iOS 17<br>' +
    'Device resolution\u00a0: 1170x2532<br>' +
    'Device zoom\u00a0: 125%<br>' +
    'User CreditType\u00a0: CREDIT_V3_18<br>' +
    'User EligibilityType\u00a0: ELIGIBLE_CREDIT_V3_18<br>' +
    'User ID\u00a0: 1234<br>' +
    'User StatusType\u00a0: BENEFICIARY'

  const technicalHeader = '<h4>NE PAS EFFACER LES INFORMATIONS TECHNIQUES CI-DESSOUS\u00a0:</h4>'

  const BASE_URL = ZENDESK_FORM_URLS

  describe('buildZendeskUrlForFraud', () => {
    it('should build the complete fraud URL', () => {
      const url = buildZendeskUrlForFraud({
        user: beneficiaryUser,
        deviceInfo,
        version,
        description: 'Mon compte a été piraté',
      })

      const description =
        '<h4>VOTRE MESSAGE\u00a0:</h4>Mon compte a été piraté' + technicalHeader + debugData

      expect(url).toBe(
        BASE_URL +
          '&tf_20701989633692=Dupond' +
          '&tf_20701995245852=Jean' +
          '&tf_20669850863388=motif_gestion_informations_compte' +
          `&tf_20673049658652=${encodeURIComponent('mon_compte_a_été_piraté')}` +
          `&tf_20704397346076=${encodeURIComponent('email@domain.ext')}` +
          '&tf_20701971989276=2002-12-01' +
          `&tf_description=${encodeURIComponent(description)}`
      )
    })
  })

  describe('buildZendeskUrlForDebug', () => {
    it('should build the complete debug URL', () => {
      const url = buildZendeskUrlForDebug({
        user: beneficiaryUser,
        deviceInfo,
        version,
        description: 'Le bouton plante',
      })

      const description =
        '<h4>VOTRE MESSAGE\u00a0:</h4>Le bouton plante' + technicalHeader + debugData

      expect(url).toBe(
        BASE_URL +
          '&tf_20701989633692=Dupond' +
          '&tf_20701995245852=Jean' +
          '&tf_20669850863388=motif_signaler_un_bug' +
          `&tf_20704397346076=${encodeURIComponent('email@domain.ext')}` +
          `&tf_description=${encodeURIComponent(description)}` +
          '&tf_20701971989276=2002-12-01'
      )
    })
  })
})
