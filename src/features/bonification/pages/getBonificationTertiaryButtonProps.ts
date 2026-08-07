import { TertiaryButtonProps } from 'features/bonification/types/BonificationFamilyQuotientRefusedType'
import { ButtonProps } from 'ui/pages/GenericInfoPage'

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
