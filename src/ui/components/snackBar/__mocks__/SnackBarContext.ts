import { useSnackBarContext as actualuseSnackBarContext } from '../SnackBarContext'

export const showSnackBar = jest.fn()

export const hideSnackBar = jest.fn()

export const useSnackBarContext = jest.fn().mockReturnValue({
  showSnackBar,
  hideSnackBar,
}) as jest.MockedFunction<typeof actualuseSnackBarContext>
