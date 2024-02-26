import { navigate } from '__mocks__/@react-navigation/native'
import { useChangeEmailMutationV2 } from 'features/profile/helpers/useChangeEmailMutationV2'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()

jest.spyOn(SnackBarContextModule, 'useSnackBarContext').mockReturnValue({
  showSuccessSnackBar: mockShowSuccessSnackBar,
  showErrorSnackBar: mockShowErrorSnackBar,
  showInfoSnackBar: jest.fn(),
  hideSnackBar: jest.fn(),
})

describe('useChangeEmailMutationV2', () => {
  it('should show snack bar on success', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 204 },
    })

    const changeEmail = renderUseChangeEmailMutationV2()

    await act(async () => changeEmail())

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message:
        'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT_LONG,
    })
  })

  it('should navigate on success', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 204 },
    })

    const changeEmail = renderUseChangeEmailMutationV2()

    await act(async () => changeEmail())

    expect(navigate).toHaveBeenCalledWith('TrackEmailChange')
  })

  it('should show snack bar on error', async () => {
    mockServer.postApi('/v2/profile/update_email', {
      responseOptions: { statusCode: 400 },
    })

    const changeEmail = renderUseChangeEmailMutationV2()

    await act(async () => changeEmail())

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message:
        'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
  })
})

const renderUseChangeEmailMutationV2 = () => {
  const {
    result: {
      current: { changeEmail },
    },
  } = renderHook(() => useChangeEmailMutationV2(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  return changeEmail
}
