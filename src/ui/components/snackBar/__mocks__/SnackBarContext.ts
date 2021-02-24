import { useSnackBarContext as actualuseSnackBarContext } from '../SnackBarContext'

export const displaySuccessSnackBar = jest.fn()

export const displayInfosSnackBar = jest.fn()

export const hideSnackBar = jest.fn()

export const useSnackBarContext = jest.fn().mockReturnValue({
  displaySuccessSnackBar,
  displayInfosSnackBar,
  hideSnackBar,
}) as jest.MockedFunction<typeof actualuseSnackBarContext>
