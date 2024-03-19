import { IconsContainer as Illustrations } from 'features/internal/cheatcodes/pages/AppComponents/IconsContainer'
import {
  BicolorIllustrations,
  UniqueColorIllustrations,
} from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { SearchCategoriesIllustrations } from 'features/search/enums'

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
