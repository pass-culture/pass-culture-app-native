import { ReactionTypeEnum } from 'api/gen'
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
jest.mock('libs/jwt/jwt')

describe('useReactionMutation', () => {
  it('should call reaction mutation function', async () => {
    mockServer.postApi('/v1/reaction', { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 12, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })

  it('should call reaction mutate function with error', async () => {
    mockServer.postApi('/v1/reaction', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 12, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
        message: 'Une erreur s’est produite',
        timeout: 5000,
      })
    })
  })
})

const renderUseReactionMutation = () =>
  renderHook(() => useReactionMutation(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
