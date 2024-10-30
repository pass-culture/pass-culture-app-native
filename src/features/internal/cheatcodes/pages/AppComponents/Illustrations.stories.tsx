import { FunctionComponent } from 'react'

import { IconsContainer as Illustrations } from 'features/internal/cheatcodes/pages/AppComponents/IconsContainer'
import {
  BicolorIllustrations,
  UniqueColorIllustrations,
} from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { SearchCategoriesIllustrations } from 'features/search/enums'
import { BadgeBook, BadgeBookDisabled } from 'ui/svg/icons/BadgeBook'
import { AccessibleIcon } from 'ui/svg/icons/types'

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

export const SearchCategories = Illustrations.bind({})
SearchCategories.args = {
  title: 'Illustration icons should have a standard size of 140',
  icons: SearchCategoriesIllustrations,
}

const BadgesIllustrations: Record<string, FunctionComponent<AccessibleIcon>> = {
  BadgeBook: BadgeBook as FunctionComponent<AccessibleIcon>,
  BadgeBookDisabled: BadgeBookDisabled as FunctionComponent<AccessibleIcon>,
}

export const BadgeIllustration = Illustrations.bind({})
BadgeIllustration.args = {
  title: 'Exemple de conversion d’illustration pour les badges',
  icons: BadgesIllustrations,
}
