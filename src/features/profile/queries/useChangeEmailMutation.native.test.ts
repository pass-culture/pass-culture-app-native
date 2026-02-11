import { replace } from '__mocks__/@react-navigation/native'
import { useChangeEmailMutation } from 'features/profile/queries/useChangeEmailMutation'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

const mockShowSuccessSnackBar = jest.spyOn(snackBarStoreModule, 'showSuccessSnackBar')
const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

jest.mock('libs/jwt/jwt')

jest.useFakeTimers()

describe('useChangeEmailMutation', () => {
  it('should show snack bar on success', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 204 },
    })

    const changeEmail = renderuseChangeEmailMutation()

    await act(async () => changeEmail())

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(
      'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.'
    )
  })

  it('should navigate on success', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 204 },
    })

    const changeEmail = renderuseChangeEmailMutation()

    await act(async () => changeEmail())

    expect(replace).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'TrackEmailChange',
    })
  })

  it('should show snack bar on error', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 400 },
    })

    const changeEmail = renderuseChangeEmailMutation()

    await act(async () => changeEmail())

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith(
      'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.'
    )
  })
})

const renderuseChangeEmailMutation = () => {
  const {
    result: {
      current: { changeEmail },
    },
  } = renderHook(() => useChangeEmailMutation(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  return changeEmail
}
