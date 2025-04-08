import { logPlaylistOfferView, setPlaylistOfferViewTrackingFn } from './logPlaylistOfferView'

describe('logOfferPlaylistView', () => {
  const mockTrackingFn = jest.fn()

  beforeEach(() => {
    mockTrackingFn.mockReset()
    mockTrackingFn.mockResolvedValue(true)
  })

  it('should throw when not call tracking function is set', async () => {
    await expect(
      logPlaylistOfferView({
        pageId: '',
        pageLocation: '',
        playlists: [],
      })
    ).rejects.toMatchObject(new Error('No tracking function set'))
  })

  it('should call tracking function if defined', async () => {
    setPlaylistOfferViewTrackingFn(mockTrackingFn)
    await logPlaylistOfferView({
      pageId: 'page',
      pageLocation: 'location',
      playlists: [{ offerIds: ['a', 'b', 'c'], callId: '', index: 0, playlistId: '' }],
    })

    expect(mockTrackingFn).toHaveBeenCalledWith({
      callId: '',
      id: 'page',
      index: 0,
      location: 'location',
      offerIds: ['a', 'b', 'c'],
      playlistId: '',
    })
  })

  it('should call tracking function for each playlist', async () => {
    setPlaylistOfferViewTrackingFn(mockTrackingFn)
    await logPlaylistOfferView({
      pageId: 'page',
      pageLocation: 'location',
      playlists: [
        { offerIds: ['a', 'b', 'c'], callId: 'call1', index: 0, playlistId: '111' },
        { offerIds: ['e', 'f', 'g'], callId: 'call2', index: 1, playlistId: '222' },
      ],
    })

    expect(mockTrackingFn).toHaveBeenNthCalledWith(1, {
      callId: 'call1',
      id: 'page',
      index: 0,
      location: 'location',
      offerIds: ['a', 'b', 'c'],
      playlistId: '111',
    })
    expect(mockTrackingFn).toHaveBeenLastCalledWith({
      callId: 'call2',
      id: 'page',
      index: 1,
      location: 'location',
      offerIds: ['e', 'f', 'g'],
      playlistId: '222',
    })
  })

  it('should throw an error', async () => {
    mockTrackingFn.mockRejectedValueOnce({ message: 'Error' })
    setPlaylistOfferViewTrackingFn(mockTrackingFn)

    await expect(
      logPlaylistOfferView({
        pageId: 'page',
        pageLocation: 'location',
        playlists: [{ offerIds: ['a', 'b', 'c'], callId: '', index: 0, playlistId: '' }],
      })
    ).rejects.toMatchObject(new Error('Error'))
  })
})
