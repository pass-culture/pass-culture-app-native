import { act, renderHook } from 'tests/utils'

import { useEmailSpellingHelp, SUGGESTION_DELAY_IN_MS } from './useEmailSpellingHelp'

const initialProps: Parameters<typeof useEmailSpellingHelp>[0] = {
  email: '',
}

jest.useFakeTimers()

describe('useEmailSpellingHelp', () => {
  it.each(['', undefined])(
    'should not display suggestion for empty email',
    (email: string | undefined) => {
      const { result } = renderHook(useEmailSpellingHelp, {
        initialProps: { ...initialProps, email },
      })

      expect(result.current.suggestedEmail).toBeUndefined()
    }
  )

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

  it('should not display suggestion before a delay', async () => {
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

    expect(result.current.suggestedEmail).toBeUndefined()
  })

  it('should not display suggestion before a delay with the last typed stuff', async () => {
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
