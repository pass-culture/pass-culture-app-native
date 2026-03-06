import { buildZendeskUrl } from './buildZendeskUrl'

describe('buildZendeskFormUrl', () => {
  it('should build URL with all fields', () => {
    const url = buildZendeskUrl('report_bug', {
      lastName: 'Dupont',
      firstName: 'Jean',
      reason: 'motif_signaler_un_bug',
      account: 'jean@example.com',
      description: 'Le bouton ne marche pas',
      birthDate: '2000-01-15',
    })

    expect(url).toBe(
      'https://aide.passculture.app/hc/fr/requests/new?ticket_form_id=20669662761500' +
        '&tf_20701989633692=Dupont' +
        '&tf_20701995245852=Jean' +
        '&tf_20669850863388=motif_signaler_un_bug' +
        '&tf_anonymous_requester_email=jean%40example.com' +
        '&tf_description=Le%20bouton%20ne%20marche%20pas' +
        '&tf_20701971989276=2000-01-15'
    )
  })

  it('should skip null and undefined fields', () => {
    const url = buildZendeskUrl('report_bug', {
      firstName: 'Jean',
      lastName: null,
      description: undefined,
    })

    expect(url).toBe(
      'https://aide.passculture.app/hc/fr/requests/new?ticket_form_id=20669662761500' +
        '&tf_20701995245852=Jean'
    )
  })

  it('should replace line breaks with <br> in field values', () => {
    const url = buildZendeskUrl('report_bug', {
      description: 'ligne1\nligne2\r\nligne3',
    })

    expect(url).toContain('tf_description=ligne1%3Cbr%3Eligne2%3Cbr%3Eligne3')
  })
})
