import React from 'react'
import styled from 'styled-components/native'

import { ArtistType, SubcategoryIdEnum } from 'api/gen'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
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
    labelReaction: 'book club',
    titleSection: 'Les avis du book club',
    subtitleSection: 'Notre communauté de lecteurs te partage leur avis sur ce livre\u00a0!',
    subtitleItem: 'Membre du book club',
    Icon: <BookClubIcon testID="bookClubIcon" />,
    SmallIcon: <SmallBookClubIcon />,
    modalTitle: 'Qui écrit les avis du book club\u00a0?',
    modalWording:
      'C’est un groupe de jeunes passionnés de lecture choisi par le pass Culture. \n\nChaque mois, ils lisent, donnent leur avis, partagent leurs coups de cœur... pour t’aider à choisir ton prochain livre\u00a0!',
    tag: <Tag variant={TagVariant.BOOKCLUB} label="membre du book club" />,
  },
  {
    subcategories: CINE_CLUB_SUBCATEGORIES,
    labelReaction: 'ciné club',
    titleSection: 'Les avis du ciné club',
    subtitleSection: 'Notre communauté de cinéphiles te partage leur avis sur ce film\u00a0!',
    subtitleItem: 'Membre du ciné club',
    Icon: <CineClubIcon testID="cineClubIcon" />,
    SmallIcon: <SmallCineClubIcon />,
    modalTitle: 'Qui écrit les avis du ciné club\u00a0?',
    modalWording:
      'C’est un groupe de jeunes cinéphiles choisi par le pass Culture. \n\nChaque mois, ils regardent des films, donnent leur avis et partagent ceux qui les ont fait vibrer… pour t’inspirer ta prochaine séance\u00a0!',
    tag: <Tag variant={TagVariant.CINECLUB} label="membre du ciné club" />,
  },
] as const

export const MAX_WIDTH_VIDEO = 540

export const OF_ROLES = [ArtistType.author, ArtistType.stage_director]

export const WITH_ROLES = [ArtistType.performer]
