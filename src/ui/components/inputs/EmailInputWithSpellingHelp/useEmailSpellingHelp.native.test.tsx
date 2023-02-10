import { act, renderHook } from 'tests/utils'

import { useEmailSpellingHelp, SUGGESTION_DELAY_IN_MS } from './useEmailSpellingHelp'

const initialProps: Parameters<typeof useEmailSpellingHelp>[0] = {
  email: '',
}

jest.useFakeTimers('legacy')

describe('useEmailSpellingHelp', () => {
  it('should not display suggestion for empty email', () => {
    const { result } = renderHook(useEmailSpellingHelp, {
      initialProps: { ...initialProps, email: '' },
    })

    expect(result.current.suggestedEmail).toBeUndefined()
  })

  it('should display suggestion with a corrected email when the email is mystyped', async () => {
    const { result, rerender } = renderHook(useEmailSpellingHelp, { initialProps })

    await act(async () => {
      rerender({
        ...initialProps,
        email: 'firstname.lastname@gmal.com',
      })
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(result.current.suggestedEmail?.full).toEqual('firstname.lastname@gmail.com')
  })

  it('should not display the suggestion before a delay once the user has finished typing his email', async () => {
    const { result, rerender } = renderHook(useEmailSpellingHelp, { initialProps })

    await act(async () => {
      rerender({
        ...initialProps,
        email: 'firstname.lastname@gmal.com',
      })
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS - 1)
    })

    await act(async () => {
      rerender({
        ...initialProps,
        email: 'firstname.lastname@gmali.com',
      })
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS - 1)
    })

    expect(result.current.suggestedEmail).toBeUndefined()
  })
})
