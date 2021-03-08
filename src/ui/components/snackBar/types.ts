import { SnackBarProps } from './SnackBar'

export enum SnackBarType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
}

export type SnackBarSettings = Omit<SnackBarProps, 'visible' | 'refresher'>
export type SnackBarHelperSettings = Omit<
  SnackBarSettings,
  'icon' | 'color' | 'backgroundColor' | 'progressBarColor'
>
