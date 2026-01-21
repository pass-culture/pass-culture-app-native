import { SubcategoryIdEnum } from 'api/gen'

export const getIsMusicSupport = (subcategoryId?: SubcategoryIdEnum): boolean => {
  if (!subcategoryId) return false
  return [
    SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
  ].includes(subcategoryId)
}
