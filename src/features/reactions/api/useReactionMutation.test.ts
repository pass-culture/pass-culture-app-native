import { ReactionTypeEnum, RefreshResponse } from 'api/gen'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn(),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('useReactionMutation', () => {
  it('should call reaction mutation function', async () => {
    mockServer.postApi<RefreshResponse>('/v1/refresh_access_token', {
      requestOptions: { persist: true },
      responseOptions: { statusCode: 200 },
    })
    mockServer.postApi(`/v1/reaction`, { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ offerId: 12, reactionType: ReactionTypeEnum.LIKE })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })

  it.skip('should call reaction mutate function with error', async () => {
    mockServer.postApi<RefreshResponse>('/v1/refresh_access_token', {
      requestOptions: { persist: true },
      responseOptions: { statusCode: 200 },
    })
    mockServer.postApi(`/v1/reaction`, {})

    const { result } = renderUseReactionMutation()

    result.current.mutate({ offerId: 12, reactionType: ReactionTypeEnum.LIKE })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, 'Une erreur s’est produite')
    })
  })
})

const renderUseReactionMutation = () =>
  renderHook(() => useReactionMutation(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
