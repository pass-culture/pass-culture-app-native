import { SettingsResponse } from 'api/gen'
import { useSettingsQuery } from 'queries/settings/settingsQuery'
import { SettingsFixture } from 'tests/settings/settingsFixture'

export const setSettingsMock = (settings: Partial<SettingsResponse> = {}) => {
  const mockUseSettingsQuery = useSettingsQuery as jest.Mock

  mockUseSettingsQuery.mockImplementation((options?: { select? }) => ({
    data: options?.select
      ? options.select({ ...SettingsFixture, ...settings })
      : { ...SettingsFixture, ...settings },
    isLoading: false,
  }))
}
