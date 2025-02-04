import { defaultSettings } from 'features/auth/fixtures/fixtures'

import { useSettings as actualUseSettingsContext } from '../useSettings'

export const useSettingsContext = jest.fn().mockReturnValue({
  data: defaultSettings,
  isLoading: false,
}) as jest.MockedFunction<typeof actualUseSettingsContext>
