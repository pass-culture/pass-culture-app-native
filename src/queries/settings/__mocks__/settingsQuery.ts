import { SettingsFixture } from 'tests/settings/settingsFixture'

export const useSettingsQuery = jest.fn((options?: { select? }) => ({
  data: options?.select ? options.select(SettingsFixture) : SettingsFixture,
  isLoading: false,
}))
