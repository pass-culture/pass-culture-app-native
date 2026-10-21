import { CategoryIdEnum, SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'
import { ArtistCategoryPlaylistId } from 'libs/analytics/helpers/logViewItem'

type RoleLabels = {
  singular: string
  plural: string
}

export type ArtistRoleLabelConfig = RoleLabels | Partial<Record<CategoryIdEnum, RoleLabels>>

export type ArtistSectionTitle = {
  singular: string
  plural: string
}

export type ArtistCategoryPlaylist = {
  playlistId: ArtistCategoryPlaylistId
  searchGroupName: SearchGroupNameEnumv2
  label: string
  includedSubcategoryIds: readonly SubcategoryIdEnumv2[]
}
