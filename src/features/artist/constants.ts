import {
  ArtistType,
  CategoryIdEnum,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
  SubcategoryIdEnumv2,
} from 'api/gen'
import {
  ArtistCategoryPlaylist,
  ArtistRoleLabelConfig,
  ArtistSectionTitle,
} from 'features/artist/types'

export const artistRoleLabelMapping: Record<ArtistType, ArtistRoleLabelConfig> = {
  [ArtistType.author]: {
    singular: 'Auteur',
    plural: 'Auteurs',
  },
  [ArtistType.film_actor]: {
    singular: 'Acteur',
    plural: 'Acteurs',
  },
  [ArtistType.film_director]: {
    singular: 'Réalisateur',
    plural: 'Réalisateurs',
  },
  [ArtistType.stage_director]: {
    singular: 'Metteur en scène',
    plural: 'Metteurs en scène',
  },
  [ArtistType.performer]: {
    [CategoryIdEnum.SPECTACLE]: {
      singular: 'Interprète',
      plural: 'Interprètes',
    },
    [CategoryIdEnum.MUSIQUE_LIVE]: {
      singular: 'Artiste',
      plural: 'Artistes',
    },
    [CategoryIdEnum.MUSIQUE_ENREGISTREE]: {
      singular: 'Artiste',
      plural: 'Artistes',
    },
  },
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

export const ARTIST_CATEGORY_PLAYLISTS = [
  {
    searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
    label: 'Prochains concerts et festivals',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.CONCERT,
      SubcategoryIdEnumv2.FESTIVAL_MUSIQUE,
      SubcategoryIdEnumv2.EVENEMENT_MUSIQUE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
    label: 'Prochains spectacles',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.SPECTACLE_REPRESENTATION,
      SubcategoryIdEnumv2.FESTIVAL_SPECTACLE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.LIVRES,
    label: 'Livres',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.LIVRE_PAPIER,
      SubcategoryIdEnumv2.LIVRE_NUMERIQUE,
      SubcategoryIdEnumv2.LIVRE_AUDIO_PHYSIQUE,
      SubcategoryIdEnumv2.TELECHARGEMENT_LIVRE_AUDIO,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.LIVRES,
    label: 'Prochains festivals et salons du livre',
    includedSubcategoryIds: [SubcategoryIdEnumv2.FESTIVAL_LIVRE],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.MUSIQUE,
    label: 'Musique',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_CD,
      SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      SubcategoryIdEnumv2.TELECHARGEMENT_MUSIQUE,
      SubcategoryIdEnumv2.CAPTATION_MUSIQUE,
      SubcategoryIdEnumv2.PARTITION,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.CINEMA,
    label: 'Films à l’affiche',
    includedSubcategoryIds: [SubcategoryIdEnumv2.SEANCE_CINE, SubcategoryIdEnumv2.CINE_PLEIN_AIR],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.CINEMA,
    label: 'Prochains évènements de cinéma',
    includedSubcategoryIds: [SubcategoryIdEnumv2.EVENEMENT_CINE, SubcategoryIdEnumv2.FESTIVAL_CINE],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
    label: 'Films, séries et documentaires',
    includedSubcategoryIds: [SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_FILM, SubcategoryIdEnumv2.VOD],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
    label: 'Arts et loisirs créatifs',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.ATELIER_PRATIQUE_ART,
      SubcategoryIdEnumv2.OEUVRE_ART,
      SubcategoryIdEnumv2.SEANCE_ESSAI_PRATIQUE_ART,
      SubcategoryIdEnumv2.PRATIQUE_ART_VENTE_DISTANCE,
      SubcategoryIdEnumv2.PLATEFORME_PRATIQUE_ARTISTIQUE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'Musées et visites',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.VISITE_GUIDEE,
      SubcategoryIdEnumv2.VISITE,
      SubcategoryIdEnumv2.VISITE_VIRTUELLE,
      SubcategoryIdEnumv2.MUSEE_VENTE_DISTANCE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'Prochains évènements culturels',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.FESTIVAL_ART_VISUEL,
      SubcategoryIdEnumv2.EVENEMENT_PATRIMOINE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
    label: 'Prochaines conférences et rencontres',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.RENCONTRE,
      SubcategoryIdEnumv2.CONFERENCE,
      SubcategoryIdEnumv2.SALON,
      SubcategoryIdEnumv2.CONCOURS,
      SubcategoryIdEnumv2.DECOUVERTE_METIERS,
      SubcategoryIdEnumv2.RENCONTRE_JEU,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
    label: 'Prochains évènements en ligne',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.LIVESTREAM_MUSIQUE,
      SubcategoryIdEnumv2.LIVESTREAM_EVENEMENT,
      SubcategoryIdEnumv2.LIVESTREAM_PRATIQUE_ARTISTIQUE,
      SubcategoryIdEnumv2.RENCONTRE_EN_LIGNE,
    ],
  },
  {
    searchGroupName: SearchGroupNameEnumv2.MEDIA_PRESSE,
    label: 'Médias et presse',
    includedSubcategoryIds: [
      SubcategoryIdEnumv2.PODCAST,
      SubcategoryIdEnumv2.ABO_PRESSE_EN_LIGNE,
      SubcategoryIdEnumv2.APP_CULTURELLE,
      SubcategoryIdEnumv2.AUTRE_SUPPORT_NUMERIQUE,
    ],
  },
] as const satisfies readonly ArtistCategoryPlaylist[]

export const ARTIST_CATEGORY_LABELS = {
  ...ARTIST_CATEGORY_PLAYLISTS.reduce<Partial<Record<SearchGroupNameEnumv2, string[]>>>(
    (categoryLabels, { searchGroupName, label }) => ({
      ...categoryLabels,
      [searchGroupName]: [...(categoryLabels[searchGroupName] ?? []), label],
    }),
    {}
  ),
  [SearchGroupNameEnumv2.NONE]: ['Offres disponibles'],
} satisfies Partial<Record<SearchGroupNameEnumv2, readonly string[]>>
