import { CategoryIdEnum } from 'api/gen'

export type ArtistRoleLabelConfig = string | Partial<Record<CategoryIdEnum, string>>

export type ArtistSectionTitle = {
  singular: string
  plural: string
}
