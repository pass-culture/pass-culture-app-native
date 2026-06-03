import { CategoryIdEnum } from 'api/gen'

type RoleLabels = {
  singular: string
  plural: string
}

export type ArtistRoleLabelConfig = RoleLabels | Partial<Record<CategoryIdEnum, RoleLabels>>

export type ArtistSectionTitle = {
  singular: string
  plural: string
}
