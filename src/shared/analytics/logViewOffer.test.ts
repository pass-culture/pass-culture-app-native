import { logViewOffer, setViewOfferTrackingFn } from './logViewOffer'

describe('logOfferPlaylistView', () => {
  const mockTrackingFn = jest.fn()

  beforeEach(() => {
    mockTrackingFn.mockReset()
    mockTrackingFn.mockResolvedValue(true)
  })

  it('should throw when not call tracking function is set', async () => {
    await expect(
      logViewOffer({
        pageId: '',
        pageLocation: '',
        playlists: [],
      })
    ).rejects.toThrow('No tracking function set')
  })

  it('should call tracking function if defined', async () => {
    setViewOfferTrackingFn(mockTrackingFn)
    await logViewOffer({
      pageId: 'page',
      pageLocation: 'location',
      playlists: [
        {
          items: [
            { index: 0, key: 'a' },
            { index: 2, key: 'b' },
            { index: 1, key: 'c' },
          ],
          callId: '',
          index: 0,
          moduleId: 'module_1',
          extra: { homeEntryId: 'homeEntry_1' },
        },
      ],
    })

    expect(mockTrackingFn).toHaveBeenCalledWith({
      origin: 'location - page',
      index: 0,
      items_0: '0:a,2:b,1:c',
      moduleId: 'module_1',
      homeEntryId: 'homeEntry_1',
    })
  })

  it('should split items if there are too many', async () => {
    setViewOfferTrackingFn(mockTrackingFn)
    await logViewOffer({
      pageId: 'page',
      pageLocation: 'location',
      playlists: [
        {
          items: [
            { index: 0, key: '238763487623' },
            { index: 2, key: '007236290523' },
            { index: 1, key: '121219045433' },
            { index: 3, key: '000436235239' },
            { index: 4, key: '887352521214' },
            { index: 5, key: '892462624359' },
            { index: 6, key: '523909802354' },
            { index: 7, key: '990962432368' },
          ],
          callId: '',
          index: 0,
          moduleId: 'module_1',
          extra: { homeEntryId: 'homeEntry_1' },
        },
      ],
    })

    expect(mockTrackingFn).toHaveBeenCalledWith({
      origin: 'location - page',
      index: 0,
      items_0:
        '0:238763487623,2:007236290523,1:121219045433,3:000436235239,4:887352521214,5:892462624359',
      items_1: '6:523909802354,7:990962432368',
      moduleId: 'module_1',
      homeEntryId: 'homeEntry_1',
    })
  })

  it('should call tracking function for each playlist', async () => {
    setViewOfferTrackingFn(mockTrackingFn)
    await logViewOffer({
      pageId: 'page',
      pageLocation: 'location',
      playlists: [
        {
          items: [
            { index: 0, key: 'a' },
            { index: 2, key: 'b' },
            { index: 1, key: 'c' },
          ],
          callId: '',
          index: 0,
          moduleId: 'module_1',
          extra: { homeEntryId: 'homeEntry_1' },
        },
        {
          items: [
            { index: 5, key: 'e' },
            { index: 6, key: 'f' },
            { index: 7, key: 'g' },
          ],
          callId: '',
          index: 1,
          moduleId: 'module_2',
          extra: { homeEntryId: 'homeEntry_2' },
        },
      ],
    })

    expect(mockTrackingFn).toHaveBeenNthCalledWith(1, {
      origin: 'location - page',
      index: 0,
      items_0: '0:a,2:b,1:c',
      moduleId: 'module_1',
      homeEntryId: 'homeEntry_1',
    })
    expect(mockTrackingFn).toHaveBeenLastCalledWith({
      origin: 'location - page',
      index: 1,
      items_0: '5:e,6:f,7:g',
      moduleId: 'module_2',
      homeEntryId: 'homeEntry_2',
    })
  })

  it('should throw an error', async () => {
    mockTrackingFn.mockRejectedValueOnce(new Error('Error'))
    setViewOfferTrackingFn(mockTrackingFn)

    await expect(
      logViewOffer({
        pageId: 'page',
        pageLocation: 'location',
        playlists: [
          {
            items: [
              { index: 0, key: 'a' },
              { index: 2, key: 'b' },
              { index: 1, key: 'c' },
            ],
            callId: '',
            index: 0,
            moduleId: 'module_1',
            extra: { homeEntryId: 'homeEntry_1' },
          },
        ],
      })
    ).rejects.toThrow('Error')
  })
})
