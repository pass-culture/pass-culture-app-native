import { ArtistType, CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { ArtistRoleLabelConfig, ArtistSectionTitle } from 'features/artist/types'

export const artistRoleLabelMapping: Record<ArtistType, ArtistRoleLabelConfig> = {
  [ArtistType.author]: 'Auteur',
  [ArtistType.film_actor]: 'Acteur',
  [ArtistType.film_director]: 'Réalisateur',
  [ArtistType.performer]: {
    [CategoryIdEnum.SPECTACLE]: 'Interprète',
    [CategoryIdEnum.MUSIQUE_LIVE]: 'Artiste',
    [CategoryIdEnum.MUSIQUE_ENREGISTREE]: 'Artiste',
  },
  [ArtistType.stage_director]: 'Metteur en scène',
}

export const ARTIST_SECTION_TITLES = {
  artist: { singular: 'Artiste', plural: 'Artistes' },
  distribution: { singular: 'Distribution', plural: 'Distribution' },
  programming: { singular: 'Programmation', plural: 'Programmation' },
  speaker: { singular: 'Intervenant', plural: 'Intervenants' },
  writer: { singular: 'Écrivain', plural: 'Écrivains' },
} as const satisfies Record<string, ArtistSectionTitle>

export const artistSectionTitleMapping: Partial<Record<SubcategoryIdEnum, ArtistSectionTitle>> = {
  [SubcategoryIdEnum.CINE_PLEIN_AIR]: ARTIST_SECTION_TITLES.distribution,
  [SubcategoryIdEnum.CONCERT]: ARTIST_SECTION_TITLES.programming,
  [SubcategoryIdEnum.CONCOURS]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.CONFERENCE]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.DECOUVERTE_METIERS]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.EVENEMENT_MUSIQUE]: ARTIST_SECTION_TITLES.programming,
  [SubcategoryIdEnum.FESTIVAL_LIVRE]: ARTIST_SECTION_TITLES.writer,
  [SubcategoryIdEnum.FESTIVAL_MUSIQUE]: ARTIST_SECTION_TITLES.programming,
  [SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE]: ARTIST_SECTION_TITLES.writer,
  [SubcategoryIdEnum.LIVRE_NUMERIQUE]: ARTIST_SECTION_TITLES.writer,
  [SubcategoryIdEnum.LIVRE_PAPIER]: ARTIST_SECTION_TITLES.writer,
  [SubcategoryIdEnum.RENCONTRE]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.RENCONTRE_JEU]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.SALON]: ARTIST_SECTION_TITLES.speaker,
  [SubcategoryIdEnum.SEANCE_CINE]: ARTIST_SECTION_TITLES.distribution,
  [SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM]: ARTIST_SECTION_TITLES.distribution,
  [SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO]: ARTIST_SECTION_TITLES.writer,
  [SubcategoryIdEnum.VOD]: ARTIST_SECTION_TITLES.distribution,
}
