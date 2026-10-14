import { useFreeDigitalOffersQuery } from 'features/generalPublicHome/queries/useFreeDigitalOffersQuery'
import { useGetOffersModuleDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { renderHook } from 'tests/utils'

const mockUseGetOffersModuleDataQuery = useGetOffersModuleDataQuery as jest.Mock
jest.mock('features/home/queries/useGetOffersDataQuery', () => ({
  useGetOffersModuleDataQuery: jest.fn(),
}))

describe('useFreeDigitalOffersQuery', () => {
  beforeEach(() => {
    mockUseGetOffersModuleDataQuery.mockReturnValue({ data: undefined })
  })

  it('should query the free digital offers module of the playlist', () => {
    const { result } = renderHook(() => useFreeDigitalOffersQuery('podcasts'))

    expect(mockUseGetOffersModuleDataQuery).toHaveBeenCalledWith(result.current.module)
    expect(result.current.module.id).toBe('generalPublicHome-podcasts')
  })

  it('should forward the module data', () => {
    const data = { playlistItems: [{ objectID: '1' }], nbPlaylistResults: 1, moduleId: 'id' }
    mockUseGetOffersModuleDataQuery.mockReturnValueOnce({ data })

    const { result } = renderHook(() => useFreeDigitalOffersQuery('videos'))

    expect(result.current.data).toBe(data)
  })

  it('should keep the same module across renders', () => {
    const { result, rerender } = renderHook(() => useFreeDigitalOffersQuery('videos'))
    const firstModule = result.current.module

    rerender({})

    expect(result.current.module).toBe(firstModule)
  })
})
