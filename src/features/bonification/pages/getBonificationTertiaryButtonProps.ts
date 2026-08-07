import { FunctionComponent } from 'react'

import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ButtonProps } from 'ui/pages/GenericInfoPage'
import { AccessibleIcon } from 'ui/svg/icons/types'

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

export const getBonificationTertiaryButtonProps = ({
  button,
  onGoBack,
}: {
  button: TertiaryButtonProps
  onGoBack: () => void
}): ButtonProps => {
  const { icon, wording, navigation } = button

  switch (navigation.type) {
    case 'externalNav':
      return { icon, wording, externalNav: navigation.externalNav }
    case 'goBack':
      return { icon, wording, onPress: onGoBack }
    case 'navigateTo':
      return { icon, wording, navigateTo: navigation.navigateTo }
  }
}
