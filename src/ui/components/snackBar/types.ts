import { SnackBarProps } from './SnackBar'

export enum SnackBarType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type SnackBarSettings = Omit<SnackBarProps, 'visible' | 'refresher'>
export type SnackBarHelperSettings = Omit<
  SnackBarSettings,
  'icon' | 'color' | 'backgroundColor' | 'progressBarColor'
> & { type: SnackBarType }
