import { Platform } from 'react-native'

import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { DeviceInformation } from 'features/trustedDevice/helpers/useDeviceInfo'
import { env } from 'libs/environment/env'
import { LINE_BREAK } from 'ui/theme/constants'

export const ZENDESK_FORM_URLS =
  'https://aide.passculture.app/hc/fr/requests/new?ticket_form_id=20669662761500'

type ZendeskReason = 'motif_signaler_un_bug' | 'motif_gestion_informations_compte'
type SubReason = 'motif_gestion_informations_compte' | 'mon_compte_a_été_piraté'

type Fields = {
  lastName: string | null
  firstName: string | null
  reason: ZendeskReason | null
  subReason: SubReason
  requesterEmail: string | null
  account: string | null
  description: string | null
  birthDate: string | null
}

const ZENDESK_FIELDS: Record<keyof Fields, string> = {
  lastName: 'tf_20701989633692',
  firstName: 'tf_20701995245852',
  reason: 'tf_20669850863388',
  subReason: 'tf_20673049658652',
  requesterEmail: 'tf_anonymous_requester_email',
  account: 'tf_20704397346076',
  description: 'tf_description',
  birthDate: 'tf_20701971989276',
}

type ZendeskFieldValues = Partial<Fields>

const parseLineBreaks = (text: string) => text.replaceAll(/\r\n|\r|\n/g, '<br>')

export const buildZendeskUrl = (fields: ZendeskFieldValues): string => {
  const queryParts: string[] = []
  for (const [key, value] of Object.entries(fields)) {
    const fieldId = ZENDESK_FIELDS[key]
    if (value) {
      const encodedValue = encodeURIComponent(parseLineBreaks(value))
      queryParts.push(`${fieldId}=${encodedValue}`)
    }
  }

  return `${ZENDESK_FORM_URLS}&${queryParts.join('&')}`
}

const getDebugData = ({
  user,
  deviceInfo,
  version,
}: {
  user?: UserProfileResponseWithoutSurvey
  deviceInfo?: DeviceInformation
  version?: string
}) => {
  const isWeb = Platform.OS === 'web'

  const webCommitHash = isWeb ? `-${String(env.COMMIT_HASH)}` : ''
  const zoomInPercent = deviceInfo?.screenZoomLevel
    ? `${Math.round(deviceInfo.screenZoomLevel * 100)}%`
    : undefined

  const undefinedValue = 'Non renseigné'

  const debugData = [
    { label: 'App version', value: version ? `${version}${webCommitHash}` : undefinedValue },
    { label: 'Device ID', value: deviceInfo?.deviceId ?? undefinedValue },
    { label: 'Device model', value: deviceInfo?.source ?? undefinedValue },
    { label: 'Device OS', value: deviceInfo?.os ?? undefinedValue },
    { label: 'Device resolution', value: deviceInfo?.resolution ?? undefinedValue },
    { label: 'Device zoom', value: zoomInPercent ?? undefinedValue },
    { label: 'User ID', value: user?.id ?? undefinedValue },
    { label: 'Device font scale', value: deviceInfo?.fontScale ?? undefinedValue },
    { label: 'User CreditType', value: user?.creditType ?? undefinedValue },
    { label: 'User StatusType', value: user?.statusType ?? undefinedValue },
    { label: 'User EligibilityType', value: user?.eligibilityType ?? undefinedValue },
  ]

  return [...debugData]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((item) => `${item.label}\u00a0: ${String(item.value)}`)
    .join(LINE_BREAK)
}

export const buildZendeskUrlForFraud = ({
  user,
  deviceInfo,
  version,
  description,
}: {
  user?: UserProfileResponseWithoutSurvey
  deviceInfo?: DeviceInformation
  version?: string
  description?: string
}) =>
  buildZendeskUrl({
    lastName: user?.lastName,
    firstName: user?.firstName,
    reason: 'motif_gestion_informations_compte',
    subReason: 'mon_compte_a_été_piraté',
    account: user?.email,
    birthDate: user?.birthDate,
    description: getDescription({ description, user, deviceInfo, version }),
  })

export const buildZendeskUrlForDebug = ({
  user,
  description,
  deviceInfo,
  version,
}: {
  user?: UserProfileResponseWithoutSurvey
  description?: string
  deviceInfo?: DeviceInformation
  version?: string
}) =>
  buildZendeskUrl({
    lastName: user?.lastName,
    firstName: user?.firstName,
    reason: 'motif_signaler_un_bug',
    account: user?.email,
    description: getDescription({ description, user, deviceInfo, version }),
    birthDate: user?.birthDate,
  })

const getDescription = ({
  description = '',
  user,
  deviceInfo,
  version,
}: {
  description?: string
  user?: UserProfileResponseWithoutSurvey
  deviceInfo?: DeviceInformation
  version?: string
}) =>
  `<h4>VOTRE MESSAGE\u00a0:</h4>${description}<h4>NE PAS EFFACER LES INFORMATIONS TECHNIQUES CI-DESSOUS\u00a0:</h4>${getDebugData({ user, deviceInfo, version })}`
