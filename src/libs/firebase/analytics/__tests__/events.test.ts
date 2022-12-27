import { AnalyticsEvent, validateAnalyticsEvent } from 'libs/firebase/analytics/events'

const analyticsMembers = [...Object.values(AnalyticsEvent)]

describe('AnalyticsEvent', () => {
  // eslint-disable-next-line jest/expect-expect
  it('actual members should respect Firebase naming rules', () => {
    for (const member of analyticsMembers) {
      const isValidMember = validateAnalyticsEvent(member as string)
      if (!isValidMember) {
        fail(`${member} is not valid`)
      }
    }
  })
  it('fake member should fail the test when it is too long', () => {
    expect(validateAnalyticsEvent('a'.repeat(39))).toBeTruthy()
    expect(validateAnalyticsEvent('a'.repeat(40))).toBeTruthy()
    expect(validateAnalyticsEvent('a'.repeat(41))).toBeFalsy()
  })
  it('fake member should fail the test when its first letter is not alphabetic', () => {
    expect(validateAnalyticsEvent('!test')).toBeFalsy()
    expect(validateAnalyticsEvent('1test')).toBeFalsy()
    expect(validateAnalyticsEvent('_test')).toBeFalsy()
  })
  it('fake member should fail the test when it contains a non alpha numeric char', () => {
    expect(validateAnalyticsEvent('Event-Testé')).toBeFalsy()
  })
  it('fake member should fail the test when it includes a "-"', () => {
    expect(validateAnalyticsEvent('Event-Test')).toBeFalsy()
  })
  it('fake member should fail the test when it starts a reserved prefix', () => {
    expect(validateAnalyticsEvent('firebase_test')).toBeFalsy()
    expect(validateAnalyticsEvent('google_test')).toBeFalsy()
    expect(validateAnalyticsEvent('ga_test')).toBeFalsy()
    expect(validateAnalyticsEvent('test_firebase_test')).toBeTruthy()
    expect(validateAnalyticsEvent('test_googletest')).toBeTruthy()
    expect(validateAnalyticsEvent('test_ga_test')).toBeTruthy()
  })
})
