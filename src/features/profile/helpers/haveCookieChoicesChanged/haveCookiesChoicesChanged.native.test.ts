import { CookiesChoiceByCategory } from 'features/cookies/types'
import { haveCookieChoicesChanged } from 'features/profile/helpers/haveCookieChoicesChanged/haveCookieChoicesChanged'

describe('haveCookieChoicesChanged', () => {
  const persistedCookieChoices: CookiesChoiceByCategory = {
    customization: false,
    performance: false,
    marketing: false,
    video: false,
  }

  it('should return false when edited choices are the exact same object as persisted choices', () => {
    const editedCookieChoices = persistedCookieChoices
    const result = haveCookieChoicesChanged(editedCookieChoices, persistedCookieChoices)

    expect(result).toEqual(false)
  })

  it('should returns false when edited choices match persisted choices (different references)', () => {
    const editedCookieChoices: CookiesChoiceByCategory = { ...persistedCookieChoices }
    const result = haveCookieChoicesChanged(editedCookieChoices, persistedCookieChoices)

    expect(result).toEqual(false)
  })

  it.each([
    {
      key: 'customization',
      editedCookieChoices: { customization: true },
    },
    {
      key: 'performance',
      editedCookieChoices: { performance: true },
    },
    {
      key: 'marketing',
      editedCookieChoices: { marketing: true },
    },
    {
      key: 'video',
      editedCookieChoices: { video: true },
    },
  ])('should returns true when a single key differs: $key', ({ editedCookieChoices }) => {
    const editedCookieChoicesFull: CookiesChoiceByCategory = {
      ...persistedCookieChoices,
      ...editedCookieChoices,
    }
    const result = haveCookieChoicesChanged(editedCookieChoicesFull, persistedCookieChoices)

    expect(result).toEqual(true)
  })

  it('should returns true when multiple keys differ', () => {
    const editedCookieChoices: CookiesChoiceByCategory = {
      ...persistedCookieChoices,
      performance: true,
      marketing: true,
    }
    const result = haveCookieChoicesChanged(editedCookieChoices, persistedCookieChoices)

    expect(result).toEqual(true)
  })

  it('should be symmetric when swapping edited and persisted choices', () => {
    const editedCookieChoices: CookiesChoiceByCategory = {
      ...persistedCookieChoices,
      performance: true,
    }
    const resultForward = haveCookieChoicesChanged(editedCookieChoices, persistedCookieChoices)
    const resultBackward = haveCookieChoicesChanged(persistedCookieChoices, editedCookieChoices)

    expect(resultForward).toEqual(true)
    expect(resultBackward).toEqual(true)
  })

  it('should not mutate the edited or persisted choices objects', () => {
    const editedCookieChoices: CookiesChoiceByCategory = {
      ...persistedCookieChoices,
      video: true,
    }
    const snapshotOfEditedChoices = { ...editedCookieChoices }
    const snapshotOfPersistedChoices = { ...persistedCookieChoices }

    haveCookieChoicesChanged(editedCookieChoices, persistedCookieChoices)

    expect(editedCookieChoices).toEqual(snapshotOfEditedChoices)
    expect(persistedCookieChoices).toEqual(snapshotOfPersistedChoices)
  })
})
