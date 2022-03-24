import { IconsContainer as Icons } from 'features/cheatcodes/pages/AppComponents/IconsContainer'
import {
  SecondaryAndBiggerIcons,
  SocialNetworkIcons,
  TertiaryAndSmallerIcons,
  UnconventionalIcons,
} from 'features/cheatcodes/pages/AppComponents/iconsExports'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { SMALLER_ICON_SIZE, STANDARD_ICON_SIZE } from 'ui/theme/constants'

export default {
  title: 'ui/icons',
}

export const SocialNetwork = Icons.bind({})
SocialNetwork.args = {
  icons: SocialNetworkIcons,
}

export const Categories = Icons.bind({})
Categories.args = {
  icons: CategoryIcon,
}

export const SecondaryAndBigger = Icons.bind({})
SecondaryAndBigger.args = {
  title: `Secondary and bigger Icons ( > 20x20 ) should have a standard size of ${STANDARD_ICON_SIZE}`,
  icons: SecondaryAndBiggerIcons,
}

export const TertiaryAndSmaller = Icons.bind({})
TertiaryAndSmaller.args = {
  title: `Tertiary and smaller plain Icons ( <= 20x20 ) should have a standard size of ${SMALLER_ICON_SIZE}`,
  icons: TertiaryAndSmallerIcons,
}

export const Unconventional = Icons.bind({})
Unconventional.args = {
  title: `Icônes à uniformiser (conversion en illustrations)`,
  icons: UnconventionalIcons,
}
