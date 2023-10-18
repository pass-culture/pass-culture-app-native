import { SubcategoryIdEnum } from 'api/gen'

export function getVenueSectionTitle(subcategoryId: SubcategoryIdEnum, isEvent: boolean) {
  if (subcategoryId === SubcategoryIdEnum.SEANCE_CINE) return 'Lieu de projection'
  if (isEvent) return 'Lieu de l’évènement'
  return 'Lieu de retrait'
}
