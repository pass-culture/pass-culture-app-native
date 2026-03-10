const ZENDESK_FORM_URLS = {
  report_bug: 'https://aide.passculture.app/hc/fr/requests/new?ticket_form_id=20669662761500',
} as const

type ZendeskFormType = keyof typeof ZENDESK_FORM_URLS

const ZENDESK_FIELDS = {
  lastName: 'tf_20701989633692',
  firstName: 'tf_20701995245852',
  reason: 'tf_20669850863388',
  account: 'tf_anonymous_requester_email',
  description: 'tf_description',
  birthDate: 'tf_20701971989276',
} as const

type ZendeskReason = 'motif_signaler_un_bug'

type ZendeskFieldValues = Omit<
  Partial<Record<keyof typeof ZENDESK_FIELDS, string | null>>,
  'reason'
> & { reason?: ZendeskReason | null }

const parseLineBreaks = (text: string) => text.replaceAll(/\r\n|\r|\n/g, '<br>')

export const buildZendeskUrl = (formType: ZendeskFormType, fields: ZendeskFieldValues): string => {
  const baseUrl = ZENDESK_FORM_URLS[formType]
  const queryParts: string[] = []
  for (const [key, value] of Object.entries(fields)) {
    const fieldId = ZENDESK_FIELDS[key]
    if (value) {
      const encodedValue = encodeURIComponent(parseLineBreaks(value))
      queryParts.push(`${fieldId}=${encodedValue}`)
    }
  }

  return `${baseUrl}&${queryParts.join('&')}`
}
