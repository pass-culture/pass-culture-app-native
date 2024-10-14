import * as ReactQueryAPI from 'react-query'

import { ReactionTypeEnum } from 'api/gen'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { QueryKeys } from 'libs/queryKeys'
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

const useQueryClientSpy = jest.spyOn(ReactQueryAPI, 'useQueryClient')
const invalidateQueriesMock = jest.fn()
useQueryClientSpy.mockReturnValue({
  invalidateQueries: invalidateQueriesMock,
} as unknown as ReactQueryAPI.QueryClient)

describe('useReactionMutation', () => {
  it('should call reaction mutation function', async () => {
    mockServer.postApi('/v1/reaction', { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })

  it('should call reaction mutate function with error', async () => {
    mockServer.postApi('/v1/reaction', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
        message: 'Une erreur s’est produite',
        timeout: 5000,
      })
    })
  })

  it('should invalidate Offer query when offer id specified in parameter', async () => {
    mockServer.postApi('/v1/reaction', { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation(1)

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => expect(invalidateQueriesMock).toHaveBeenCalledWith([QueryKeys.OFFER, 1]))
  })

  it('should not invalidate Offer query when offer id not specified in parameter', async () => {
    mockServer.postApi('/v1/reaction', { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
      expect(invalidateQueriesMock).not.toHaveBeenCalledWith([QueryKeys.OFFER, 1])
    })
  })
})

const renderUseReactionMutation = (offerId?: number) =>
  renderHook(() => useReactionMutation(offerId), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
