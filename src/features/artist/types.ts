import { CategoryIdEnum, SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'

export type ArtistRoleLabelConfig = string | Partial<Record<CategoryIdEnum, string>>

export type ArtistSectionTitle = {
  singular: string
  plural: string
}

export type ArtistCategoryPlaylist = {
  searchGroupName: SearchGroupNameEnumv2
  label: string
  includedSubcategoryIds: readonly SubcategoryIdEnumv2[]
}
