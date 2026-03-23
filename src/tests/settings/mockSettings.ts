import { SettingsResponse } from 'api/gen'
import { useSettingsQuery } from 'queries/settings/settingsQuery'
import { SettingsFixture } from 'tests/settings/settingsFixture'

export const setSettingsMock = ({
  patchSettingsWith = {},
  areSettingsUndefined = false,
  areSettingsLoading = false,
}: {
  patchSettingsWith?: Partial<SettingsResponse>
  areSettingsUndefined?: boolean
  areSettingsLoading?: boolean
} = {}) => {
  const mockUseSettingsQuery = useSettingsQuery as jest.Mock

  mockUseSettingsQuery.mockImplementation((options?: { select? }) => ({
    data: areSettingsUndefined
      ? undefined
      : options?.select
        ? options.select({ ...SettingsFixture, ...patchSettingsWith })
        : { ...SettingsFixture, ...patchSettingsWith },
    isLoading: areSettingsLoading,
  }))
}
