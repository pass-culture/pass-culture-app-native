import { SnackBarProps } from './SnackBar'

export type SnackBarSettings = Omit<SnackBarProps, 'visible' | 'refresher'>
export type SnackBarHelperSettings = Omit<
  SnackBarSettings,
  'icon' | 'color' | 'backgroundColor' | 'progressBarColor'
>
