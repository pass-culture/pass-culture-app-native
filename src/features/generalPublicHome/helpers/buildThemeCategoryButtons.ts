import { THEMES } from 'features/generalPublicHome/constants'
import { buildFreeEventsModule } from 'features/generalPublicHome/helpers/buildFreeEventsModule'
import { DateFilter } from 'features/generalPublicHome/types'
import { CategoryCriteria, NewCategoryCriteria } from 'features/search/enums'
import { MappingOutput } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

type Params = {
  availableCategories: CategoryCriteria[] | NewCategoryCriteria[]
  dateFilter: DateFilter
  now: Date
  aroundRadius?: number
}

// Search category buttons leading each theme to its playlist of free events
export const buildThemeCategoryButtons = ({
  availableCategories,
  dateFilter,
  now,
  aroundRadius,
}: Params): MappingOutput[] =>
  THEMES.flatMap((theme) => {
    const category = availableCategories.find(
      ({ facetFilter }) => facetFilter === theme.searchGroup
    )
    if (!category) return []

    return {
      label: theme.label,
      navigateTo: {
        screen: 'VerticalPlaylistOffers',
        params: {
          type: VerticalPlaylist.ModuleOffers,
          module: buildFreeEventsModule({ dateFilter, themeId: theme.id, now, aroundRadius }),
        },
      },
      searchLandingPosition: undefined,
      fillColor: category.fillColor,
      borderColor: category.borderColor,
      illustrationUrl: category.illustrationUrl,
    }
  })
