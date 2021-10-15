import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import * as BookOfferUtils from 'features/bookOffer/services/utils'
import { waitFor } from 'tests/utils'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

const getTimesReviewHasBeenRequestedMock = jest
  .spyOn(BookOfferUtils, 'getTimesReviewHasBeenRequested')
  .mockResolvedValue(0)
const getFirstTimeReviewHasBeenRequestedDateMock = jest
  .spyOn(BookOfferUtils, 'getFirstTimeReviewHasBeenRequestedDate')
  .mockResolvedValue(new Date('2020-12-01T00:00:00Z'))

describe('useReviewInAppInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return shouldReviewBeRequested = true if review Modal has not been seen', async () => {
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
  it('should return shouldReviewBeRequested = true if review Modal has been seen once', async () => {
    getTimesReviewHasBeenRequestedMock.mockResolvedValueOnce(1)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
  it('should return shouldReviewBeRequested = true if review Modal has been seen twice', async () => {
    getTimesReviewHasBeenRequestedMock.mockResolvedValueOnce(2)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
  it('should return shouldReviewBeRequested = true if review Modal has been seen three times', async () => {
    getTimesReviewHasBeenRequestedMock.mockResolvedValueOnce(3)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
  //KO >
  it('should return shouldReviewBeRequested = false if review Modal has been seen more than three times', async () => {
    getTimesReviewHasBeenRequestedMock.mockResolvedValueOnce(4)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeFalsy()
    })
  })
  it('should return shouldReviewBeRequested = true if review Modal has been seen more than three times but one year ago', async () => {
    getTimesReviewHasBeenRequestedMock.mockResolvedValueOnce(3)
    getFirstTimeReviewHasBeenRequestedDateMock.mockResolvedValueOnce(
      new Date('2021-12-02T00:00:00Z')
    )
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
  it("test pour vérifier que on incrémente bien après l'affichage de la modale", () => {})
})
