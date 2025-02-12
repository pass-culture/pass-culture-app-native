import { defaultSettings } from 'features/auth/fixtures/fixtures'

export const useSettings = jest.fn().mockReturnValue({
  data: defaultSettings,
  isLoading: false,
})
