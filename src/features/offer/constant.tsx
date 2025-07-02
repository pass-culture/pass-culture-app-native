import React from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { CineClubCertification } from 'ui/svg/CineClubCertification'

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const CineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
}))``

export const BOOK_CLUB_SUBCATEGORIES = [
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
  SubcategoryIdEnum.LIVRE_NUMERIQUE,
  SubcategoryIdEnum.LIVRE_PAPIER,
] as const

export const CINE_CLUB_SUBCATEGORIES = [
  SubcategoryIdEnum.SEANCE_CINE,
  SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM,
  SubcategoryIdEnum.AUTRE_SUPPORT_NUMERIQUE,
  SubcategoryIdEnum.VOD,
  SubcategoryIdEnum.CINE_PLEIN_AIR,
] as const

export const CHRONICLE_VARIANT_CONFIG = [
  {
    subcategories: BOOK_CLUB_SUBCATEGORIES,
    titleSection: 'La reco du Book Club',
    subtitleSection: 'Notre communauté de lecteurs te partagent leurs avis sur ce livre\u00a0!',
    subtitleItem: 'Membre du Book Club',
    Icon: <BookClubIcon />,
  },
  {
    subcategories: CINE_CLUB_SUBCATEGORIES,
    titleSection: 'La reco du Ciné Club',
    subtitleSection: 'Des avis de jeunes passionnés sélectionnés par le pass Culture\u00a0!',
    subtitleItem: 'Membre du Ciné Club',
    Icon: <CineClubIcon />,
  },
] as const
