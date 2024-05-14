import { defaultSettings } from 'features/auth/fixtures/fixtures'

import { useSettingsContext as actualUseSettingsContext } from '../SettingsContext'

export const useSettingsContext = jest.fn().mockReturnValue({
  data: defaultSettings,
  isLoading: false,
}) as jest.MockedFunction<typeof actualUseSettingsContext>
