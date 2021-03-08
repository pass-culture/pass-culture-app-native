import { useSnackBarContext as actualuseSnackBarContext } from '../SnackBarContext'

export const showInfoSnackBar = jest.fn()
export const showSuccessSnackBar = jest.fn()
export const showErrorSnackBar = jest.fn()

export const hideSnackBar = jest.fn()

export const useSnackBarContext = jest.fn().mockReturnValue({
  showInfoSnackBar,
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
}) as jest.MockedFunction<typeof actualuseSnackBarContext>
