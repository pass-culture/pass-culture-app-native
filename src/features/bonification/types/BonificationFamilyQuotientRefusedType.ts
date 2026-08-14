import { FunctionComponent } from 'react'

import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { BannerLink } from 'ui/designSystem/Banner/Banner'
import { AccessibleIcon, AccessibleRectangleIcon } from 'ui/svg/icons/types'

type TertiaryButtonNavigation =
  | {
      type: 'externalNav'
      externalNav: ExternalNavigationProps['externalNav']
    }
  | {
      type: 'goBack'
    }
  | {
      type: 'navigateTo'
      navigateTo: InternalNavigationProps['navigateTo']
    }

export type TertiaryButtonProps = {
  icon: FunctionComponent<AccessibleIcon>
  wording: string
  navigation: TertiaryButtonNavigation
}

type PrimaryButtonConfig = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
}
type TertiaryButtonEntry = {
  button?: TertiaryButtonProps
}
export type PageConfigEntry = {
  Illustration: React.FC<AccessibleIcon | AccessibleRectangleIcon>
  title: string
  firstText: React.ReactNode
  secondText?: string
  bannerText?: string
  bannerLinks?: BannerLink[]
  primaryButton: PrimaryButtonConfig
  tertiaryButton: TertiaryButtonEntry
}
export type PageConfigMap = Record<BonificationQFRefusedType, PageConfigEntry>
