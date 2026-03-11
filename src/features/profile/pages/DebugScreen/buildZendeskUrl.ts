import { UserProfileResponseWithoutSurvey } from 'features/share/types'

const ZENDESK_FORM_URLS =
  'https://aide.passculture.app/hc/fr/requests/new?ticket_form_id=20669662761500'

type ZendeskReason = 'motif_signaler_un_bug' | 'motif_gestion_informations_compte'
type SubReason = 'motif_gestion_informations_compte'

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

export const buildZendeskUrlForFraud = (user: UserProfileResponseWithoutSurvey | undefined) => {
  return buildZendeskUrl({
    lastName: user?.lastName,
    firstName: user?.firstName,
    reason: 'motif_gestion_informations_compte',
    subReason: 'motif_gestion_informations_compte',
    account: user?.email,
    birthDate: user?.birthDate,
  })
}
