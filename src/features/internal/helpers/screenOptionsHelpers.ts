import {
  SCREENS_CONFIG,
  ScreensUsedByMarketing,
} from 'features/internal/config/deeplinksExportConfig'

type ScreenOption = {
  key: string
  label: string
  value: ScreensUsedByMarketing
}

const isScreenUsedByMarketing = (name: string): name is ScreensUsedByMarketing =>
  name in SCREENS_CONFIG

export const SCREEN_OPTIONS: ScreenOption[] = Object.keys(SCREENS_CONFIG)
  .filter(isScreenUsedByMarketing)
  .map((screenName) => ({
    key: screenName,
    label: screenName,
    value: screenName,
  }))

export const getScreenForLabel = (label: string): ScreensUsedByMarketing | undefined =>
  SCREEN_OPTIONS.find((option) => option.label === label)?.value
