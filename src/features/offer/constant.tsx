import React from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { CineClubCertification } from 'ui/svg/CineClubCertification'

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const SmallBookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
  size: theme.icons.sizes.small,
}))``

const CineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
}))``

const SmallCineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
  size: theme.icons.sizes.small,
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
    labelReaction: 'Book Club',
    titleSection: 'La reco du Book Club',
    subtitleSection: 'Notre communauté de lecteurs te partagent leurs avis sur ce livre\u00a0!',
    subtitleItem: 'Membre du Book Club',
    Icon: <BookClubIcon testID="bookClubIcon" />,
    SmallIcon: <SmallBookClubIcon />,
    modalWording: 'Les avis du Book Club sont écrits par des jeunes passionnés de lecture.',
    modalButtonLabel: 'Voir toutes les recos du Book Club',
  },
  {
    subcategories: CINE_CLUB_SUBCATEGORIES,
    labelReaction: 'Ciné Club',
    titleSection: 'La reco du Ciné Club',
    subtitleSection: 'Notre communauté de cinéphiles te partage leur avis sur ce film\u00a0!',
    subtitleItem: 'Membre du Ciné Club',
    Icon: <CineClubIcon testID="cineClubIcon" />,
    SmallIcon: <SmallCineClubIcon />,
    modalWording: 'Les avis du Ciné Club sont écrits par des jeunes passionnés de cinéma.',
    modalButtonLabel: 'Voir toutes les recos du Ciné Club',
  },
] as const

export const MAX_WIDTH_VIDEO = 540
