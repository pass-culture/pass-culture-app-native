import { renderHook } from "@testing-library/react-hooks"

export const navigate = jest.fn()
export const reset = jest.fn()
export const goBack = jest.fn()

export const useNavigation = () => ({
  navigate,
  reset,
  goBack,
})

export const useRoute = jest.fn()
