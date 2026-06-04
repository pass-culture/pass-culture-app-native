import { CategoryIdEnum, SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'

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
  searchGroupName: SearchGroupNameEnumv2
  label: string
  includedSubcategoryIds: readonly SubcategoryIdEnumv2[]
}
