import { useLogOfferImagesScroll } from 'features/offer/helpers/useLogOfferImagesScroll/useLogOfferImagesScroll'
import { analytics } from 'libs/analytics/provider'
import { renderHook } from 'tests/utils'

describe('useLogOfferImagesScroll', () => {
  it('should not return a logger when the offer has no image', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 0, from: 'offer' })
    )

    expect(result.current).toBeUndefined()
  })

  it('should not return a logger when the offer has a single image', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 1, from: 'offer' })
    )

    expect(result.current).toBeUndefined()
  })

  it('should log the event with the new image index', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 3, from: 'offer' })
    )

    result.current?.(1)

    expect(analytics.logOfferImagesScroll).toHaveBeenNthCalledWith(1, {
      offerId: 1,
      nbImages: 3,
      imageIndex: 1,
      from: 'offer',
    })
  })

  it('should log every image change of a rapid succession', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 3, from: 'offerPreview' })
    )

    result.current?.(1)
    result.current?.(2)
    result.current?.(1)

    expect(analytics.logOfferImagesScroll).toHaveBeenCalledTimes(3)
    expect(analytics.logOfferImagesScroll).toHaveBeenNthCalledWith(3, {
      offerId: 1,
      nbImages: 3,
      imageIndex: 1,
      from: 'offerPreview',
    })
  })

  it('should not log twice the same image index', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 3, from: 'offer' })
    )

    result.current?.(2)
    result.current?.(2)

    expect(analytics.logOfferImagesScroll).toHaveBeenCalledTimes(1)
  })

  it('should not log the image the carousel is opened on', () => {
    const { result } = renderHook(() =>
      useLogOfferImagesScroll({ offerId: 1, nbImages: 3, from: 'offerPreview', defaultIndex: 2 })
    )

    result.current?.(2)

    expect(analytics.logOfferImagesScroll).not.toHaveBeenCalled()
  })

  it('should not log the image the carousel is reopened on when the default index changes', () => {
    const { result, rerender } = renderHook(
      ({ defaultIndex }: { defaultIndex: number }) =>
        useLogOfferImagesScroll({ offerId: 1, nbImages: 3, from: 'offerPreview', defaultIndex }),
      { initialProps: { defaultIndex: 0 } }
    )

    rerender({ defaultIndex: 1 })
    result.current?.(1)

    expect(analytics.logOfferImagesScroll).not.toHaveBeenCalled()
  })
})
