import { FunctionComponent } from 'react'

import { ContentfulLabelCategories } from 'libs/contentful/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type DatePreset = 'today' | 'tomorrow' | 'thisWeek'

export type DateFilter =
  { type: 'preset'; preset: DatePreset } | { type: 'day'; date: string /* yyyy-MM-dd */ } | null

export type DateRange = { beginningDatetime?: string; endingDatetime?: string }

export type ThemeId = 'shows' | 'outings' | 'visits' | 'cinema'

export type Theme = {
  id: ThemeId
  label: string
  Icon: FunctionComponent<AccessibleIcon>
  // Offer categories of the free events playlist the theme leads to
  categories: ContentfulLabelCategories[]
}

export type DatePresetItem = {
  label: string
  isSelected: boolean
  onPress: () => void
}

export type FreeDigitalPlaylistId = 'podcasts' | 'videos'

export type FreeDigitalPlaylist = {
  title: string
  subtitle: string
  // Subcategory labels, as Contentful playlists filter on them
  subcategories: string[]
}
