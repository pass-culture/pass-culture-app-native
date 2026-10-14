import { SearchGroupNameEnumv2 } from 'api/gen'
import { ContentfulLabelCategories } from 'libs/contentful/types'

export type DatePreset = 'today' | 'thisWeek' | 'thisMonth'

export type DateFilter =
  { type: 'preset'; preset: DatePreset } | { type: 'day'; date: string /* yyyy-MM-dd */ } | null

export type DateRange = { beginningDatetime?: string; endingDatetime?: string }

export type ThemeId = 'shows' | 'outings' | 'visits' | 'cinema'

export type Theme = {
  id: ThemeId
  label: string
  categories: ContentfulLabelCategories[]
  // Search category whose block colors and illustration the theme borrows
  searchGroup: SearchGroupNameEnumv2
}

export type FreeDigitalPlaylistId = 'podcasts' | 'videos'

export type FreeDigitalPlaylist = {
  title: string
  subtitle: string
  // Subcategory labels, as Contentful playlists filter on them
  subcategories: string[]
}
