import { IconsContainer as Illustrations } from 'features/cheatcodes/pages/AppComponents/IconsContainer'
import {
  BicolorIllustrations,
  UniqueColorIllustrations,
} from 'features/cheatcodes/pages/AppComponents/illustrationsExports'

export default {
  title: 'Fondations/Illustrations',
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}

export const Bicolors = Illustrations.bind({})
Bicolors.args = {
  title: 'Illustration icons should have a standard size of 140',
  icons: BicolorIllustrations,
}

export const UniqueColor = Illustrations.bind({})
UniqueColor.args = {
  title: 'Illustration icons should have a standard size of 140',
  icons: UniqueColorIllustrations,
}
