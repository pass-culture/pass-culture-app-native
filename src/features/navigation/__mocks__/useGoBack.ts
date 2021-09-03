export const mockGoBack = jest.fn()
export const mockCanGoBack = jest.fn(() => true)
export function useGoBack() {
  return {
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }
}
