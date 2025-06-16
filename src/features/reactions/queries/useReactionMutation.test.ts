import { QueryClient } from '@tanstack/react-query'

import { ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData([QueryKeys.BOOKINGS], bookingsSnap)
}

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

  it.skip('should invalidate bookings query on success', async () => {
    mockServer.postApi('/v1/reaction', { offerId: 1, reactionType: ReactionTypeEnum.LIKE })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
      expect(queryCache.find([QueryKeys.BOOKINGS])?.state.isInvalidated).toBeTruthy()
    })
  })

  it.skip('should invalidate bookings query on error', async () => {
    mockServer.postApi('/v1/reaction', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseReactionMutation()

    result.current.mutate({ reactions: [{ offerId: 1, reactionType: ReactionTypeEnum.LIKE }] })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
      expect(queryCache.find([QueryKeys.BOOKINGS])?.state.isInvalidated).toBeTruthy()
    })
  })
})

const renderUseReactionMutation = () =>
  renderHook(() => useReactionMutation(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setup),
  })
