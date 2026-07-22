import React from 'react'
import { styled } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { CineClubCertification } from 'ui/svg/CineClubCertification'
import { SceneClubCertification } from 'ui/svg/SceneClubCertification'

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const SmallBookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
  size: theme.designSystem.size.icon.m,
}))``

const CineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
}))``

const SmallCineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
  size: theme.designSystem.size.icon.m,
}))``

const SceneClubIcon = styled(SceneClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.sceneClub,
}))``

const SmallSceneClubIcon = styled(SceneClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.sceneClub,
  size: theme.designSystem.size.icon.m,
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

export const SCENE_CLUB_SUBCATEGORIES = [
  SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
  SubcategoryIdEnum.SPECTACLE_ENREGISTRE,
  SubcategoryIdEnum.SPECTACLE_VENTE_DISTANCE,
  SubcategoryIdEnum.CONFERENCE,
  SubcategoryIdEnum.VISITE_GUIDEE,
  SubcategoryIdEnum.RENCONTRE,
  SubcategoryIdEnum.SALON,
  SubcategoryIdEnum.FESTIVAL_SPECTACLE,
  SubcategoryIdEnum.LIVESTREAM_PRATIQUE_ARTISTIQUE,
  SubcategoryIdEnum.ABO_SPECTACLE,
] as const

export const PRO_ADVICE_VARIANT_CONFIG = {
  subcategories: [],
  labelReaction: 'avis des pros',
  titleSection: 'Les avis des pros',
  subtitleSection: 'Les professionnels qui proposent cette offre te partagent leurs avis\u00a0!',
  subtitleItem: 'Avis du pro',
  modalTitle: 'Qui écrit les avis des pros\u00a0?',
  modalWording:
    'Les avis des pros sont rédigés par nos partenaires culturels du pass\u00a0: libraires, disquaires, organisateurs de spectacles...\nCes experts partagent leurs coups de cœur pour t’aider à découvrir des œuvres qui pourraient te plaire.',
  sectionTag: <Tag variant={TagVariant.NEW} label="Nouveau" />,
  buttonWording: 'Voir tous les avis des pros',
} as const

const BOOK_CLUB_VARIANT_CONFIG = {
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
  buttonWording: 'Voir tous les avis des clubs',
} as const

const CINE_CLUB_VARIANT_CONFIG = {
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
  buttonWording: 'Voir tous les avis des clubs',
} as const

const SCENE_CLUB_VARIANT_CONFIG = {
  subcategories: SCENE_CLUB_SUBCATEGORIES,
  labelReaction: 'scène club',
  titleSection: 'Les avis de la scène club',
  subtitleSection: 'La communauté de jeunes passionnés te partage leur avis\u00a0!',
  subtitleItem: 'Membre de la scène club',
  Icon: <SceneClubIcon testID="sceneClubIcon" />,
  SmallIcon: <SmallSceneClubIcon />,
  modalTitle: 'Qui écrit les avis de la scène club\u00a0?',
  modalWording:
    'La scène club, c’est une équipe de jeunes passionnés de spectacle vivant réunis par le pass Culture. \n\nChaque mois, ils vont voir des spectacles et donnent leur avis pour t’aider à trouver ta prochaine sortie\u00a0!',
  tag: <Tag variant={TagVariant.SCENECLUB} label="membre de la scène club" />,
  buttonWording: 'Voir tous les avis des clubs',
} as const

export const CLUB_ADVICE_VARIANT_CONFIG = [
  BOOK_CLUB_VARIANT_CONFIG,
  CINE_CLUB_VARIANT_CONFIG,
  SCENE_CLUB_VARIANT_CONFIG,
  PRO_ADVICE_VARIANT_CONFIG,
] as const
