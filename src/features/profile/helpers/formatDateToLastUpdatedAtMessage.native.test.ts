import timezoneMock from 'timezone-mock'

import { renderHook } from 'tests/utils'

import { formatDateToLastUpdatedAtMessage } from './formatDateToLastUpdatedAtMessage'

describe('formatDateToLastUpdatedAtMessage', () => {
  afterAll(() => timezoneMock.unregister())

  it('should not return formatted date when last updated date is not provided', () => {
    const { result } = renderHook(() => formatDateToLastUpdatedAtMessage(undefined))

    expect(result.current).toBeUndefined()
  })

  it('should return formatted date when last updated date is provided', () => {
    // Brazil/East timezone is equivalent to UTC-3 on the 28th of August
    timezoneMock.register('Brazil/East')

    const { result } = renderHook(() => formatDateToLastUpdatedAtMessage('2023-08-28 12:00:00'))

    expect(result.current).toEqual('28/08/2023 à 09h00')
  })
})
