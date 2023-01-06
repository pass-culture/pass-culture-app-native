import { renderHook } from 'tests/utils'

import { formatDateToLastUpdatedAtMessage } from './formatDateToLastUpdatedAtMessage'

describe('formatDateToLastUpdatedAtMessage', () => {
  it('should not return formated date when last updated date is not provided', () => {
    const { result } = renderHook(() => formatDateToLastUpdatedAtMessage(undefined))
    expect(result.current).toBeUndefined()
  })

  it('should return formated date when last updated date is provided', () => {
    const { result } = renderHook(() => formatDateToLastUpdatedAtMessage('2021-10-25T12:30Z'))
    expect(result.current).toEqual('25/10/2021 à 12h30')
  })
})
