import {
  CategoryIdEnum,
  GenreType,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnum,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnumv2,
} from 'api/gen'

export const PLACEHOLDER_DATA: SubcategoriesResponseModelv2 = {
  subcategories: [
    {
      id: SubcategoryIdEnumv2.ABO_BIBLIOTHEQUE,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Abonnement (bibliothèques, médiathèques...)',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.BIBLIOTHEQUE_MEDIATHEQUE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_CONCERT,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      appLabel: 'Abonnement concert',
      searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      homepageLabelName: HomepageLabelNameEnumv2.CONCERT,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
    },
    {
      id: SubcategoryIdEnumv2.ABO_JEU_VIDEO,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Abonnement jeux vidéos',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.JEUX_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_LIVRE_NUMERIQUE,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Abonnement livres numériques',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
    },
    {
      id: SubcategoryIdEnumv2.ABO_LUDOTHEQUE,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Abonnement ludothèque',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LUDOTHEQUE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_MEDIATHEQUE,
      categoryId: CategoryIdEnum.FILM,
      appLabel: 'Abonnement médiathèque',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.FILMS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.BIBLIOTHEQUE_MEDIATHEQUE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_PLATEFORME_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'Abonnement plateforme musicale',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_PLATEFORME_VIDEO,
      categoryId: CategoryIdEnum.FILM,
      appLabel: 'Abonnement plateforme streaming',
      searchGroupName: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      homepageLabelName: HomepageLabelNameEnumv2.FILMS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ABO_PLATEFORME_VIDEO,
    },
    {
      id: SubcategoryIdEnumv2.ABO_PRATIQUE_ART,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Abonnement pratique artistique',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
    },
    {
      id: SubcategoryIdEnumv2.ABO_PRESSE_EN_LIGNE,
      categoryId: CategoryIdEnum.MEDIA,
      appLabel: 'Abonnement presse en ligne',
      searchGroupName: SearchGroupNameEnumv2.MEDIA_PRESSE,
      homepageLabelName: HomepageLabelNameEnumv2.MEDIAS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRESSE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.ABO_SPECTACLE,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Abonnement spectacle',
      searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ABONNEMENTS_SPECTACLE,
    },
    {
      id: SubcategoryIdEnumv2.ACHAT_INSTRUMENT,
      categoryId: CategoryIdEnum.INSTRUMENT,
      appLabel: 'Achat instrument',
      searchGroupName: SearchGroupNameEnumv2.MUSIQUE,
      homepageLabelName: HomepageLabelNameEnumv2.INSTRUMENT,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT,
    },
    {
      id: SubcategoryIdEnumv2.ACTIVATION_EVENT,
      categoryId: CategoryIdEnum.TECHNIQUE,
      appLabel: 'Catégorie technique d’évènement d’activation',
      searchGroupName: SearchGroupNameEnumv2.NONE,
      homepageLabelName: HomepageLabelNameEnumv2.NONE,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE_OR_OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.DEPRECIEE,
    },
    {
      id: SubcategoryIdEnumv2.ACTIVATION_THING,
      categoryId: CategoryIdEnum.TECHNIQUE,
      appLabel: 'Catégorie technique de thing d’activation',
      searchGroupName: SearchGroupNameEnumv2.NONE,
      homepageLabelName: HomepageLabelNameEnumv2.NONE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE_OR_OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.DEPRECIEE,
    },
    {
      id: SubcategoryIdEnumv2.APP_CULTURELLE,
      categoryId: CategoryIdEnum.MEDIA,
      appLabel: 'Application culturelle',
      searchGroupName: SearchGroupNameEnumv2.MEDIA_PRESSE,
      homepageLabelName: HomepageLabelNameEnumv2.MEDIAS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.AUTRES_MEDIAS,
    },
    {
      id: SubcategoryIdEnumv2.ATELIER_PRATIQUE_ART,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Atelier, stage de pratique artistique',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
    },
    {
      id: SubcategoryIdEnumv2.AUTRE_SUPPORT_NUMERIQUE,
      categoryId: CategoryIdEnum.FILM,
      appLabel: 'Autre support numérique',
      searchGroupName: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      homepageLabelName: HomepageLabelNameEnumv2.FILMS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VIDEOS_ET_DOCUMENTAIRES,
    },
    {
      id: SubcategoryIdEnumv2.BON_ACHAT_INSTRUMENT,
      categoryId: CategoryIdEnum.INSTRUMENT,
      appLabel: 'Bon d’achat instrument',
      searchGroupName: SearchGroupNameEnumv2.MUSIQUE,
      homepageLabelName: HomepageLabelNameEnumv2.INSTRUMENT,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT,
    },
    {
      id: SubcategoryIdEnumv2.CAPTATION_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'Captation musicale',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.CARTE_CINE_ILLIMITE,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Carte cinéma illimité',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CARTES_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.CARTE_CINE_MULTISEANCES,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Carte cinéma multi-séances',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CARTES_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.CARTE_JEUNES,
      categoryId: CategoryIdEnum.CARTE_JEUNES,
      appLabel: 'Carte jeunes',
      searchGroupName: SearchGroupNameEnumv2.CARTES_JEUNES,
      homepageLabelName: HomepageLabelNameEnumv2.CARTE_JEUNES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.NATIVE_CATEGORY_NONE,
    },
    {
      id: SubcategoryIdEnumv2.CARTE_MUSEE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Abonnement musée, carte ou pass',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.MUSEE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE,
    },
    {
      id: SubcategoryIdEnumv2.CINE_PLEIN_AIR,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Cinéma plein air',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.CINE_VENTE_DISTANCE,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Cinéma',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.CONCERT,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      appLabel: 'Concert',
      searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      homepageLabelName: HomepageLabelNameEnumv2.CONCERT,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
    },
    {
      id: SubcategoryIdEnumv2.CONCOURS,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Concours - jeux',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONCOURS,
    },
    {
      id: SubcategoryIdEnumv2.CONFERENCE,
      categoryId: CategoryIdEnum.CONFERENCE,
      appLabel: 'Conférence',
      searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      homepageLabelName: HomepageLabelNameEnumv2.RENCONTRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONFERENCES,
    },
    {
      id: SubcategoryIdEnumv2.DECOUVERTE_METIERS,
      categoryId: CategoryIdEnum.CONFERENCE,
      appLabel: 'Découverte des métiers',
      searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      homepageLabelName: HomepageLabelNameEnumv2.RENCONTRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SALONS_ET_METIERS,
    },
    {
      id: SubcategoryIdEnumv2.ESCAPE_GAME,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Escape game',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ESCAPE_GAMES,
    },
    {
      id: SubcategoryIdEnumv2.EVENEMENT_CINE,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Évènement cinéma',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.EVENEMENT_JEU,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Évènements - jeux',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.RENCONTRES_EVENEMENTS,
    },
    {
      id: SubcategoryIdEnumv2.EVENEMENT_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      appLabel: 'Autre type d’évènement musical',
      searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      homepageLabelName: HomepageLabelNameEnumv2.CONCERT,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
    },
    {
      id: SubcategoryIdEnumv2.EVENEMENT_PATRIMOINE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Évènement et atelier patrimoine',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.VISITES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE,
    },
    {
      id: SubcategoryIdEnumv2.FESTIVAL_ART_VISUEL,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Festival d’arts visuels / arts numériques',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.FESTIVAL,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ARTS_VISUELS,
    },
    {
      id: SubcategoryIdEnumv2.FESTIVAL_CINE,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Festival de cinéma',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.FESTIVAL_LIVRE,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Festival et salon du livre',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.FESTIVAL_DU_LIVRE,
    },
    {
      id: SubcategoryIdEnumv2.FESTIVAL_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      appLabel: 'Festival de musique',
      searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      homepageLabelName: HomepageLabelNameEnumv2.FESTIVAL,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.FESTIVALS,
    },
    {
      id: SubcategoryIdEnumv2.FESTIVAL_SPECTACLE,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Festival',
      searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS,
    },
    {
      id: SubcategoryIdEnumv2.JEU_EN_LIGNE,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Jeux en ligne',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.JEUX_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.JEU_SUPPORT_PHYSIQUE,
      categoryId: CategoryIdEnum.TECHNIQUE,
      appLabel: 'Catégorie technique Jeu support physique',
      searchGroupName: SearchGroupNameEnumv2.NONE,
      homepageLabelName: HomepageLabelNameEnumv2.NONE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE_OR_OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.JEUX_PHYSIQUES,
    },
    {
      id: SubcategoryIdEnumv2.LIVESTREAM_EVENEMENT,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Live stream d’évènement',
      searchGroupName: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.LIVESTREAM_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      appLabel: 'Livestream musical',
      searchGroupName: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CONCERTS_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.LIVESTREAM_PRATIQUE_ARTISTIQUE,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Pratique artistique - livestream',
      searchGroupName: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.COURS,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.LIVRE_AUDIO_PHYSIQUE,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Livre audio sur support physique',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES,
    },
    {
      id: SubcategoryIdEnumv2.LIVRE_NUMERIQUE,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Livre numérique, e-book',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
    },
    {
      id: SubcategoryIdEnumv2.LIVRE_PAPIER,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Livre',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    },
    {
      id: SubcategoryIdEnumv2.LOCATION_INSTRUMENT,
      categoryId: CategoryIdEnum.INSTRUMENT,
      appLabel: 'Location instrument',
      searchGroupName: SearchGroupNameEnumv2.MUSIQUE,
      homepageLabelName: HomepageLabelNameEnumv2.INSTRUMENT,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT,
    },
    {
      id: SubcategoryIdEnumv2.MATERIEL_ART_CREATIF,
      categoryId: CategoryIdEnum.BEAUX_ARTS,
      appLabel: 'Matériel arts créatifs',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.MATERIELS_CREATIFS,
    },
    {
      id: SubcategoryIdEnumv2.MUSEE_VENTE_DISTANCE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Musée vente à distance',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.MUSEE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VISITES_CULTURELLES,
    },
    {
      id: SubcategoryIdEnumv2.OEUVRE_ART,
      categoryId: CategoryIdEnum.TECHNIQUE,
      appLabel: 'Catégorie technique d’oeuvre d’art',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.NONE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE_OR_OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.ARTS_VISUELS,
    },
    {
      id: SubcategoryIdEnumv2.PARTITION,
      categoryId: CategoryIdEnum.INSTRUMENT,
      appLabel: 'Partition',
      searchGroupName: SearchGroupNameEnumv2.MUSIQUE,
      homepageLabelName: HomepageLabelNameEnumv2.INSTRUMENT,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PARTITIONS_DE_MUSIQUE,
    },
    {
      id: SubcategoryIdEnumv2.PLATEFORME_PRATIQUE_ARTISTIQUE,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Plateforme de pratique artistique',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.PLATEFORME,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.PRATIQUE_ART_VENTE_DISTANCE,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Pratique artistique - vente à distance',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.PODCAST,
      categoryId: CategoryIdEnum.MEDIA,
      appLabel: 'Podcast',
      searchGroupName: SearchGroupNameEnumv2.MEDIA_PRESSE,
      homepageLabelName: HomepageLabelNameEnumv2.MEDIAS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PODCAST,
    },
    {
      id: SubcategoryIdEnumv2.RENCONTRE_EN_LIGNE,
      categoryId: CategoryIdEnum.CONFERENCE,
      appLabel: 'Rencontre en ligne',
      searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      homepageLabelName: HomepageLabelNameEnumv2.RENCONTRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.RENCONTRE_JEU,
      categoryId: CategoryIdEnum.JEU,
      appLabel: 'Rencontres - jeux',
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      homepageLabelName: HomepageLabelNameEnumv2.JEUX,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.RENCONTRES_EVENEMENTS,
    },
    {
      id: SubcategoryIdEnumv2.RENCONTRE,
      categoryId: CategoryIdEnum.CONFERENCE,
      appLabel: 'Rencontre',
      searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      homepageLabelName: HomepageLabelNameEnumv2.RENCONTRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.RENCONTRES,
    },
    {
      id: SubcategoryIdEnumv2.SALON,
      categoryId: CategoryIdEnum.CONFERENCE,
      appLabel: 'Salon, Convention',
      searchGroupName: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      homepageLabelName: HomepageLabelNameEnumv2.RENCONTRES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SALONS_ET_METIERS,
    },
    {
      id: SubcategoryIdEnumv2.SEANCE_CINE,
      categoryId: CategoryIdEnum.CINEMA,
      appLabel: 'Séance de cinéma',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
    },
    {
      id: SubcategoryIdEnumv2.SEANCE_ESSAI_PRATIQUE_ART,
      categoryId: CategoryIdEnum.PRATIQUE_ART,
      appLabel: 'Séance d’essai',
      searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
    },
    {
      id: SubcategoryIdEnumv2.SPECTACLE_ENREGISTRE,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Spectacle enregistré',
      searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SPECTACLES_ENREGISTRES,
    },
    {
      id: SubcategoryIdEnumv2.SPECTACLE_REPRESENTATION,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Spectacle, représentation',
      searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS,
    },
    {
      id: SubcategoryIdEnumv2.SPECTACLE_VENTE_DISTANCE,
      categoryId: CategoryIdEnum.SPECTACLE,
      appLabel: 'Spectacle vivant - vente à distance',
      searchGroupName: SearchGroupNameEnumv2.SPECTACLES,
      homepageLabelName: HomepageLabelNameEnumv2.SPECTACLES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS,
    },
    {
      id: SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_FILM,
      categoryId: CategoryIdEnum.FILM,
      appLabel: 'Support physique (DVD, Blu-ray...)',
      searchGroupName: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      homepageLabelName: HomepageLabelNameEnumv2.FILMS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.DVD_BLU_RAY,
    },
    {
      id: SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_CD,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'CD',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.CD,
    },
    {
      id: SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'Vinyles et autres supports',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VINYLES,
    },
    {
      id: SubcategoryIdEnumv2.TELECHARGEMENT_LIVRE_AUDIO,
      categoryId: CategoryIdEnum.LIVRE,
      appLabel: 'Livre audio à télécharger',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      homepageLabelName: HomepageLabelNameEnumv2.PLATEFORME,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
    },
    {
      id: SubcategoryIdEnumv2.TELECHARGEMENT_MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'Téléchargement de musique',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.VISITE_GUIDEE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Visite guidée',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.VISITES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VISITES_CULTURELLES,
    },
    {
      id: SubcategoryIdEnumv2.VISITE_VIRTUELLE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Visite virtuelle',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.VISITES,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VISITES_CULTURELLES_EN_LIGNE,
    },
    {
      id: SubcategoryIdEnumv2.VISITE,
      categoryId: CategoryIdEnum.MUSEE,
      appLabel: 'Visite',
      searchGroupName: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      homepageLabelName: HomepageLabelNameEnumv2.VISITES,
      isEvent: true,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VISITES_CULTURELLES,
    },
    {
      id: SubcategoryIdEnumv2.VOD,
      categoryId: CategoryIdEnum.FILM,
      appLabel: 'Vidéo à la demande',
      searchGroupName: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      homepageLabelName: HomepageLabelNameEnumv2.FILMS,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VIDEOS_ET_DOCUMENTAIRES,
    },
  ],
  searchGroups: [
    { name: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS, value: 'Arts & loisirs créatifs' },
    { name: SearchGroupNameEnumv2.CARTES_JEUNES, value: 'Cartes jeunes' },
    {
      name: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      value: 'CD, vinyles, musique en ligne',
    },
    {
      name: SearchGroupNameEnumv2.MUSIQUE,
      value: 'Musique',
    },
    { name: SearchGroupNameEnumv2.CONCERTS_FESTIVALS, value: 'Concerts & festivals' },
    { name: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES, value: 'Conférences & rencontres' },
    { name: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE, value: 'Évènements en ligne' },
    { name: SearchGroupNameEnumv2.CINEMA, value: 'Cinéma' },
    {
      name: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      value: 'Films, séries et documentaires',
    },
    { name: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS, value: 'Jeux & jeux vidéos' },
    { name: SearchGroupNameEnumv2.LIVRES, value: 'Livres' },
    { name: SearchGroupNameEnumv2.MEDIA_PRESSE, value: 'Médias & presse' },
    {
      name: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      value: 'Musées & visites culturelles',
    },
    { name: SearchGroupNameEnumv2.SPECTACLES, value: 'Spectacles' },
    { name: SearchGroupNameEnumv2.NONE, value: null },
  ],
  homepageLabels: [
    { name: HomepageLabelNameEnumv2.BEAUX_ARTS, value: 'Beaux-Arts' },
    { name: HomepageLabelNameEnumv2.CARTE_JEUNES, value: 'Carte jeunes' },
    { name: HomepageLabelNameEnumv2.CINEMA, value: 'Cinéma' },
    { name: HomepageLabelNameEnumv2.MUSIQUE, value: 'Musique' },
    { name: HomepageLabelNameEnumv2.CONCERT, value: 'Concert' },
    { name: HomepageLabelNameEnumv2.COURS, value: 'Cours' },
    { name: HomepageLabelNameEnumv2.FESTIVAL, value: 'Festival' },
    { name: HomepageLabelNameEnumv2.FILMS, value: 'Films' },
    { name: HomepageLabelNameEnumv2.INSTRUMENT, value: 'Instrument' },
    { name: HomepageLabelNameEnumv2.JEUX, value: 'Jeux' },
    { name: HomepageLabelNameEnumv2.LIVRES, value: 'Livre' },
    { name: HomepageLabelNameEnumv2.MEDIAS, value: 'Médias' },
    { name: HomepageLabelNameEnumv2.MUSEE, value: 'Musée' },
    { name: HomepageLabelNameEnumv2.MUSIQUE, value: 'Musique' },
    { name: HomepageLabelNameEnumv2.NONE, value: null },
    { name: HomepageLabelNameEnumv2.PLATEFORME, value: 'Plateforme' },
    { name: HomepageLabelNameEnumv2.RENCONTRES, value: 'Rencontres' },
    { name: HomepageLabelNameEnumv2.SPECTACLES, value: 'Spectacle' },
    { name: HomepageLabelNameEnumv2.VISITES, value: 'Visites' },
  ],
  nativeCategories: [
    {
      name: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE,
      value: 'Abonnements mus\u00e9e',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
    },
    {
      name: NativeCategoryIdEnumv2.ABONNEMENTS_SPECTACLE,
      value: 'Abonnements spectacle',
      genreType: GenreType.SHOW,
      parents: [SearchGroupNameEnumv2.SPECTACLES],
    },
    {
      name: NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT,
      value: 'Achat & location d‘instrument',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSIQUE, SearchGroupNameEnumv2.MUSIQUE],
    },
    {
      name: NativeCategoryIdEnumv2.ARTS_VISUELS,
      value: 'Arts visuels',
      genreType: null,
      parents: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
    },
    {
      name: NativeCategoryIdEnumv2.AUTRES_MEDIAS,
      value: 'Autres m\u00e9dias',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MEDIA_PRESSE],
    },
    {
      name: NativeCategoryIdEnumv2.BIBLIOTHEQUE_MEDIATHEQUE,
      value: 'Abonnements aux m\u00e9diath\u00e8ques et biblioth\u00e8ques',
      genreType: null,
      parents: [SearchGroupNameEnumv2.LIVRES],
    },
    {
      name: NativeCategoryIdEnumv2.CARTES_CINEMA,
      value: 'Cartes cin\u00e9ma',
      genreType: null,
      parents: [SearchGroupNameEnumv2.CINEMA],
    },
    {
      name: NativeCategoryIdEnumv2.CD,
      value: 'CD',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE, SearchGroupNameEnumv2.MUSIQUE],
    },
    {
      name: NativeCategoryIdEnumv2.CONCERTS_EN_LIGNE,
      value: 'Concerts en ligne',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
    },
    {
      name: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
      value: 'Concerts, \u00e9v\u00e8nements',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
    },
    {
      name: NativeCategoryIdEnumv2.CONCOURS,
      value: 'Concours',
      genreType: null,
      parents: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
    },
    {
      name: NativeCategoryIdEnumv2.CONFERENCES,
      value: 'Conf\u00e9rences',
      genreType: null,
      parents: [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES],
    },
    {
      name: NativeCategoryIdEnumv2.DEPRECIEE,
      value: 'D\u00e9pr\u00e9ci\u00e9e',
      genreType: null,
      parents: [],
    },
    {
      name: NativeCategoryIdEnumv2.DVD_BLU_RAY,
      value: 'DVD, Blu-Ray',
      genreType: null,
      parents: [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES],
    },
    {
      name: NativeCategoryIdEnumv2.ESCAPE_GAMES,
      value: 'Escape games',
      genreType: null,
      parents: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
    },
    {
      name: NativeCategoryIdEnumv2.EVENEMENTS_CINEMA,
      value: 'Ev\u00e8nements cin\u00e9ma',
      genreType: null,
      parents: [SearchGroupNameEnumv2.CINEMA],
    },
    {
      name: NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE,
      value: 'Ev\u00e8nements patrimoine',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
    },
    {
      name: NativeCategoryIdEnumv2.FESTIVALS,
      value: 'Festivals',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS, SearchGroupNameEnumv2.MUSIQUE],
    },
    {
      name: NativeCategoryIdEnumv2.FESTIVAL_DU_LIVRE,
      value: '\u00c9v\u00e8nements autour du livre',
      genreType: null,
      parents: [SearchGroupNameEnumv2.LIVRES],
    },
    {
      name: NativeCategoryIdEnumv2.JEUX_EN_LIGNE,
      value: 'Jeux en ligne',
      genreType: null,
      parents: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
    },
    {
      name: NativeCategoryIdEnumv2.JEUX_PHYSIQUES,
      value: 'Jeux physiques',
      genreType: null,
      parents: [],
    },
    {
      name: NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES,
      value: 'Livres audio',
      genreType: null,
      parents: [SearchGroupNameEnumv2.LIVRES],
    },
    {
      name: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
      value: 'E-books',
      genreType: null,
      parents: [SearchGroupNameEnumv2.LIVRES],
    },
    {
      name: NativeCategoryIdEnumv2.LIVRES_PAPIER,
      value: 'Livres papier',
      genreType: GenreType.BOOK,
      parents: [SearchGroupNameEnumv2.LIVRES],
    },
    {
      name: NativeCategoryIdEnumv2.LUDOTHEQUE,
      value: 'Ludoth\u00e8que',
      genreType: null,
      parents: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
    },
    {
      name: NativeCategoryIdEnumv2.MATERIELS_CREATIFS,
      value: 'Mat\u00e9riels cr\u00e9atifs',
      genreType: null,
      parents: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
    },
    {
      name: NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE,
      value: 'Musique en ligne',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
    },
    {
      name: NativeCategoryIdEnumv2.NATIVE_CATEGORY_NONE,
      value: 'None',
      genreType: null,
      parents: [],
    },
    {
      name: NativeCategoryIdEnumv2.PARTITIONS_DE_MUSIQUE,
      value: 'Partitions de musique',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSIQUE],
    },
    {
      name: NativeCategoryIdEnumv2.PODCAST,
      value: 'Podcast',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MEDIA_PRESSE],
    },
    {
      name: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
      value: 'Pratiques & ateliers artistiques',
      genreType: null,
      parents: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
    },
    {
      name: NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE,
      value: 'Pratique artistique en ligne',
      genreType: null,
      parents: [
        SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      ],
    },
    {
      name: NativeCategoryIdEnumv2.PRESSE_EN_LIGNE,
      value: 'Presse en ligne',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MEDIA_PRESSE],
    },
    {
      name: NativeCategoryIdEnumv2.RENCONTRES,
      value: 'Rencontres',
      genreType: null,
      parents: [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES],
    },
    {
      name: NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE,
      value: 'Rencontres en ligne',
      genreType: null,
      parents: [
        SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
        SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      ],
    },
    {
      name: NativeCategoryIdEnumv2.RENCONTRES_EVENEMENTS,
      value: 'Rencontres \u00e9v\u00e8nements',
      genreType: null,
      parents: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
    },
    {
      name: NativeCategoryIdEnumv2.SALONS_ET_METIERS,
      value: 'Salons & m\u00e9tiers',
      genreType: null,
      parents: [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES],
    },
    {
      name: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
      value: 'Films à l’affiche',
      genreType: GenreType.MOVIE,
      parents: [SearchGroupNameEnumv2.CINEMA],
    },
    {
      name: NativeCategoryIdEnumv2.SPECTACLES_ENREGISTRES,
      value: 'Spectacles enregistr\u00e9s',
      genreType: GenreType.SHOW,
      parents: [SearchGroupNameEnumv2.SPECTACLES],
    },
    {
      name: NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS,
      value: 'Spectacles & repr\u00e9sentations',
      genreType: GenreType.SHOW,
      parents: [SearchGroupNameEnumv2.SPECTACLES],
    },
    {
      name: NativeCategoryIdEnumv2.VINYLES,
      value: 'Vinyles et autres supports',
      genreType: GenreType.MUSIC,
      parents: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE, SearchGroupNameEnumv2.MUSIQUE],
    },
    {
      name: NativeCategoryIdEnumv2.VISITES_CULTURELLES,
      value: 'Visites culturelles',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
    },
    {
      name: NativeCategoryIdEnumv2.VISITES_CULTURELLES_EN_LIGNE,
      value: 'Visites culturelles en ligne',
      genreType: null,
      parents: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
    },
  ],
  genreTypes: [
    {
      name: GenreType.BOOK,
      values: [
        {
          name: 'Art',
          value: 'Art',
        },
        {
          name: 'Arts Culinaires',
          value: 'Arts Culinaires',
        },
        {
          name: 'Bandes dessinées',
          value: 'Bandes dessinées',
        },
        {
          name: 'Carrière/Concours',
          value: 'Carrière/Concours',
        },
        {
          name: 'Droit',
          value: 'Droit',
        },
        {
          name: 'Economie',
          value: 'Economie',
        },
        {
          name: 'Faits, temoignages',
          value: 'Faits, temoignages',
        },
        {
          name: 'Gestion/entreprise',
          value: 'Gestion/entreprise',
        },
        {
          name: 'Géographie, cartographie',
          value: 'Géographie, cartographie',
        },
        {
          name: 'Histoire',
          value: 'Histoire',
        },
        {
          name: 'Humour',
          value: 'Humour',
        },
        {
          name: 'Informatique',
          value: 'Informatique',
        },
        {
          name: 'Jeunesse',
          value: 'Jeunesse',
        },
        {
          name: 'Jeux',
          value: 'Jeux',
        },
        {
          name: 'Langue',
          value: 'Langue',
        },
        {
          name: 'Littérature Etrangère',
          value: 'Littérature Etrangère',
        },
        {
          name: 'Littérature Europééne',
          value: 'Littérature Europééne',
        },
        {
          name: 'Littérature française',
          value: 'Littérature française',
        },
        {
          name: 'Loisirs',
          value: 'Loisirs',
        },
        {
          name: 'Manga',
          value: 'Manga',
        },
        {
          name: 'Marketing et audio-visuel',
          value: 'Marketing et audio-visuel',
        },
        {
          name: 'Policier',
          value: 'Policier',
        },
        {
          name: 'Poèsie, théâtre et spectacle',
          value: 'Poèsie, théâtre et spectacle',
        },
        {
          name: 'Psychanalyse, psychologie',
          value: 'Psychanalyse, psychologie',
        },
        {
          name: 'Religions, spiritualitées',
          value: 'Religions, spiritualitées',
        },
        {
          name: 'Santé',
          value: 'Santé',
        },
        {
          name: 'Science-fiction, fantastique & terreur',
          value: 'Science-fiction, fantastique & terreur',
        },
        {
          name: 'Sciences Humaines, Encyclopédie, dictionnaire',
          value: 'Sciences Humaines, Encyclopédie, dictionnaire',
        },
        {
          name: 'Sciences, vie & Nature',
          value: 'Sciences, vie & Nature',
        },
        {
          name: 'Scolaire & Parascolaire',
          value: 'Scolaire & Parascolaire',
        },
        {
          name: 'Sexualité',
          value: 'Sexualité',
        },
        {
          name: 'Sociologie',
          value: 'Sociologie',
        },
        {
          name: 'Sport',
          value: 'Sport',
        },
        {
          name: 'Tourisme',
          value: 'Tourisme',
        },
        {
          name: 'Vie pratique',
          value: 'Vie pratique',
        },
      ],
      trees: [
        {
          children: [
            {
              label: 'Romances',
              gtls: [
                {
                  code: '01020600',
                  label: 'Roman sentimental',
                  level: 3,
                },
              ],
              position: 1,
            },
            {
              label: 'Thriller',
              gtls: [
                {
                  code: '01020500',
                  label: 'Thriller',
                  level: 3,
                },
              ],
              position: 2,
            },
            {
              label: 'Fantasy',
              gtls: [
                {
                  code: '01020900',
                  label: 'Fantasy',
                  level: 3,
                },
              ],
              position: 3,
            },
            {
              label: 'Policier',
              gtls: [
                {
                  code: '01020400',
                  label: 'Policier',
                  level: 3,
                },
              ],
              position: 4,
            },
            {
              label: '\u0152uvres classiques',
              gtls: [
                {
                  code: '01030000',
                  label: '\u0152uvres classiques',
                  level: 2,
                },
              ],
              position: 5,
            },
            {
              label: 'Science-fiction',
              gtls: [
                {
                  code: '01020700',
                  label: 'Science-fiction',
                  level: 3,
                },
              ],
              position: 6,
            },
            {
              label: 'Horreur',
              gtls: [
                {
                  code: '01020802',
                  label: 'Horreur / Terreur',
                  level: 4,
                },
              ],
              position: 7,
            },
            {
              label: 'Aventure',
              gtls: [
                {
                  code: '01020200',
                  label: 'Aventure',
                  level: 3,
                },
                {
                  code: '01020300',
                  label: 'Espionnage',
                  level: 3,
                },
              ],
              position: 8,
            },
            {
              label: 'Biographie',
              gtls: [
                {
                  code: '01060000',
                  label: 'Biographie / T\u00e9moignage litt\u00e9raire',
                  level: 2,
                },
              ],
              position: 9,
            },
            {
              label: 'Contes & l\u00e9gendes',
              gtls: [
                {
                  code: '01040000',
                  label: 'Contes / L\u00e9gendes',
                  level: 2,
                },
              ],
              position: 10,
            },
          ],
          gtls: [
            {
              code: '01010000',
              label: 'Romans & Nouvelles',
              level: 2,
            },
            {
              code: '01020000',
              label: 'Romans & Nouvelles de genre',
              level: 2,
            },
            {
              code: '01030000',
              label: '\u0152uvres classiques',
              level: 2,
            },
            {
              code: '02000000',
              label: 'Jeunesse',
              level: 1,
            },
            {
              code: '01060000',
              label: 'Biographie / T\u00e9moignage litt\u00e9raire',
              level: 2,
            },
            {
              code: '01040000',
              label: 'Contes / L\u00e9gendes',
              level: 2,
            },
          ],
          label: 'Romans et litt\u00e9rature',
          position: 1,
        },
        {
          children: [
            {
              label: 'Shonen',
              gtls: [
                {
                  code: '03040500',
                  label: 'Shonen',
                  level: 3,
                },
              ],
              position: 1,
            },
            {
              label: 'Sh\u00f4jo',
              gtls: [
                {
                  code: '03040400',
                  label: 'Sh\u00f4jo',
                  level: 3,
                },
              ],
              position: 2,
            },
            {
              label: 'Yaoi',
              gtls: [
                {
                  code: '03040800',
                  label: 'Yaoi',
                  level: 3,
                },
              ],
              position: 3,
            },
            {
              label: 'Kodomo',
              gtls: [
                {
                  code: '03040300',
                  label: 'Kodomo',
                  level: 3,
                },
              ],
              position: 4,
            },
            {
              label: 'Josei',
              gtls: [
                {
                  code: '03040700',
                  label: 'Josei',
                  level: 3,
                },
              ],
              position: 5,
            },
            {
              label: 'Yuri',
              gtls: [
                {
                  code: '03040900',
                  label: 'Yuri',
                  level: 3,
                },
              ],
              position: 6,
            },
          ],
          gtls: [
            {
              code: '03040300',
              label: 'Kodomo',
              level: 3,
            },
            {
              code: '03040400',
              label: 'Sh\u00f4jo',
              level: 3,
            },
            {
              code: '03040500',
              label: 'Shonen',
              level: 3,
            },
            {
              code: '03040700',
              label: 'Josei',
              level: 3,
            },
            {
              code: '03040800',
              label: 'Yaoi',
              level: 3,
            },
            {
              code: '03040900',
              label: 'Yuri',
              level: 3,
            },
          ],
          label: 'Mangas',
          position: 2,
        },
        {
          children: [
            {
              label: 'Humour',
              gtls: [
                {
                  code: '03020111',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03020211',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03020310',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030210',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030310',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030410',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030510',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030610',
                  label: 'Humour',
                  level: 4,
                },
                {
                  code: '03030710',
                  label: 'Humour',
                  level: 4,
                },
              ],
              position: 1,
            },
            {
              label: 'Action & Aventure',
              gtls: [
                {
                  code: '03020109',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03020209',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03020308',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030208',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030308',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030408',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030508',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030608',
                  label: 'Action / Aventures',
                  level: 4,
                },
                {
                  code: '03030708',
                  label: 'Action / Aventures',
                  level: 4,
                },
              ],
              position: 2,
            },
            {
              label: 'Fantastique & \u00c9pouvante',
              gtls: [
                {
                  code: '03020206',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03020305',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030205',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030305',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030405',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030505',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030605',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
                {
                  code: '03030705',
                  label: 'Fantastique / Epouvante',
                  level: 4,
                },
              ],
              position: 3,
            },
            {
              label: 'Documentaire & Soci\u00e9t\u00e9',
              gtls: [
                {
                  code: '03020103',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03020203',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03020302',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030202',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030302',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030402',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030502',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030602',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
                {
                  code: '03030702',
                  label: 'Documentaire / Soci\u00e9t\u00e9',
                  level: 4,
                },
              ],
              position: 4,
            },
            {
              label: 'Fantasy',
              gtls: [
                {
                  code: '03020105',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03020205',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03020304',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030204',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030304',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030404',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030504',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030604',
                  label: 'Fantasy',
                  level: 4,
                },
                {
                  code: '03030704',
                  label: 'Fantasy',
                  level: 4,
                },
              ],
              position: 5,
            },
            {
              label: 'Histoire',
              gtls: [
                {
                  code: '03020108',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03020208',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03020307',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030207',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030307',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030407',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030507',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030607',
                  label: 'Histoire',
                  level: 4,
                },
                {
                  code: '03030707',
                  label: 'Histoire',
                  level: 4,
                },
              ],
              position: 6,
            },
            {
              label: 'Policier & Thriller',
              gtls: [
                {
                  code: '03020107',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03020207',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03020306',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030206',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030306',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030406',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030506',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030606',
                  label: 'Policier / Thriller',
                  level: 4,
                },
                {
                  code: '03030706',
                  label: 'Policier / Thriller',
                  level: 4,
                },
              ],
              position: 7,
            },
            {
              label: 'Science-fiction',
              gtls: [
                {
                  code: '03020104',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03020204',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03020303',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030203',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030303',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030403',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030503',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030603',
                  label: 'Science-fiction',
                  level: 4,
                },
                {
                  code: '03030703',
                  label: 'Science-fiction',
                  level: 4,
                },
              ],
              position: 8,
            },
            {
              label: 'Adaptation',
              gtls: [
                {
                  code: '03020102',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03020202',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03020301',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03030201',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03030301',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03030401',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03030501',
                  label: 'Adaptation Autre',
                  level: 4,
                },
                {
                  code: '03030601',
                  label: 'Adaptation',
                  level: 4,
                },
                {
                  code: '03030701',
                  label: 'Adaptation',
                  level: 4,
                },
              ],
              position: 9,
            },
            {
              label: 'Western',
              gtls: [
                {
                  code: '03020110',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03020210',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03020309',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030209',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030309',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030409',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030509',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030609',
                  label: 'Western',
                  level: 4,
                },
                {
                  code: '03030709',
                  label: 'Western',
                  level: 4,
                },
              ],
              position: 10,
            },
            {
              label: 'Super H\u00e9ros',
              gtls: [
                {
                  code: '03030400',
                  label: 'Super H\u00e9ros',
                  level: 3,
                },
              ],
              position: 11,
            },
            {
              label: 'Strip',
              gtls: [
                {
                  code: '03030300',
                  label: 'Strip',
                  level: 3,
                },
              ],
              position: 12,
            },
          ],
          gtls: [
            {
              code: '03020000',
              label: 'Bandes dessin\u00e9es',
              level: 2,
            },
            {
              code: '03030000',
              label: 'Comics',
              level: 2,
            },
          ],
          label: 'BD & Comics',
          position: 3,
        },
        {
          children: [
            {
              label: 'Vie quotidienne & Bien-\u00eatre',
              gtls: [
                {
                  code: '04060000',
                  label: 'Vie quotidienne & Bien-\u00eatre',
                  level: 2,
                },
              ],
              position: 1,
            },
            {
              label: 'Cuisine',
              gtls: [
                {
                  code: '04030000',
                  label: 'Arts de la table / Gastronomie',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Activit\u00e9s manuelles',
              gtls: [
                {
                  code: '04050000',
                  label: 'Hobbies',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'Jeux',
              gtls: [
                {
                  code: '04050500',
                  label: 'Jeux',
                  level: 3,
                },
              ],
              position: 4,
            },
            {
              label: 'Sports',
              gtls: [
                {
                  code: '04070000',
                  label: 'Sports',
                  level: 2,
                },
              ],
              position: 5,
            },
            {
              label: 'Animaux',
              gtls: [
                {
                  code: '04020000',
                  label: 'Animaux',
                  level: 2,
                },
              ],
              position: 6,
            },
            {
              label: 'Nature & Plein air',
              gtls: [
                {
                  code: '04010000',
                  label: 'Nature & Plein air',
                  level: 2,
                },
              ],
              position: 7,
            },
            {
              label: 'Habitat & Maison',
              gtls: [
                {
                  code: '04040000',
                  label: 'Habitat / Maison',
                  level: 2,
                },
              ],
              position: 8,
            },
            {
              label: 'Transports',
              gtls: [
                {
                  code: '04050700',
                  label: 'Transports',
                  level: 3,
                },
              ],
              position: 9,
            },
          ],
          gtls: [
            {
              code: '04000000',
              label: 'Vie pratique & Loisirs',
              level: 1,
            },
          ],
          label: 'Loisirs & Bien-\u00eatre',
          position: 4,
        },
        {
          children: [
            {
              label: 'Philosophie',
              gtls: [
                {
                  code: '09080000',
                  label: 'Philosophie',
                  level: 2,
                },
              ],
              position: 1,
            },
            {
              label: 'Sciences politiques',
              gtls: [
                {
                  code: '09110000',
                  label: 'Sciences politiques & Politique',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Sciences sociales & Soci\u00e9t\u00e9',
              gtls: [
                {
                  code: '09120000',
                  label: 'Sciences sociales  / Soci\u00e9t\u00e9',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'Psychologie & Psychanalyse',
              gtls: [
                {
                  code: '09090000',
                  label: 'Psychologie / Psychanalyse',
                  level: 2,
                },
              ],
              position: 4,
            },
            {
              label: 'Actualit\u00e9 & Reportage',
              gtls: [
                {
                  code: '01110000',
                  label: 'Actualit\u00e9s & Reportages',
                  level: 2,
                },
              ],
              position: 5,
            },
            {
              label: 'Anthropologie & Ethnologie',
              gtls: [
                {
                  code: '09010000',
                  label: 'Anthropologie',
                  level: 2,
                },
                {
                  code: '09020000',
                  label: 'Ethnologie',
                  level: 2,
                },
              ],
              position: 6,
            },
          ],
          gtls: [
            {
              code: '09000000',
              label: 'Sciences humaines & sociales',
              level: 1,
            },
            {
              code: '01110000',
              label: 'Actualit\u00e9s & Reportages',
              level: 2,
            },
          ],
          label: 'Soci\u00e9t\u00e9 & Politique',
          position: 5,
        },
        {
          children: [
            {
              label: 'Th\u00e9\u00e2tre',
              gtls: [
                {
                  code: '01080000',
                  label: 'Th\u00e9\u00e2tre',
                  level: 2,
                },
              ],
              position: 1,
            },
            {
              label: 'Po\u00e9sie',
              gtls: [
                {
                  code: '01090000',
                  label: 'Po\u00e9sie',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Essais litt\u00e9raires',
              gtls: [
                {
                  code: '01070000',
                  label: 'Litt\u00e9rature argumentative',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'R\u00e9cit',
              gtls: [
                {
                  code: '01050000',
                  label: 'R\u00e9cit',
                  level: 2,
                },
              ],
              position: 4,
            },
          ],
          gtls: [
            {
              code: '01080000',
              label: 'Th\u00e9\u00e2tre',
              level: 2,
            },
            {
              code: '01090000',
              label: 'Po\u00e9sie',
              level: 2,
            },
            {
              code: '01070000',
              label: 'Litt\u00e9rature argumentative',
              level: 2,
            },
            {
              code: '01050000',
              label: 'R\u00e9cit',
              level: 2,
            },
          ],
          label: 'Th\u00e9\u00e2tre, Po\u00e9sie & Essais',
          position: 6,
        },
        {
          children: [
            {
              label: 'Droit',
              gtls: [
                {
                  code: '08030000',
                  label: 'Droit',
                  level: 2,
                },
              ],
              position: 1,
            },
            {
              label: 'M\u00e9decine',
              gtls: [
                {
                  code: '10080000',
                  label: 'M\u00e9decine',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Entreprise',
              gtls: [
                {
                  code: '08040000',
                  label: 'Entreprise, gestion et management',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'Sciences \u00e9conomiques',
              gtls: [
                {
                  code: '08010000',
                  label: 'Sciences \u00e9conomiques',
                  level: 2,
                },
              ],
              position: 4,
            },
            {
              label: 'Histoire',
              gtls: [
                {
                  code: '09050000',
                  label: 'Histoire',
                  level: 2,
                },
                {
                  code: '09060000',
                  label: 'Histoire du monde',
                  level: 2,
                },
              ],
              position: 5,
            },
            {
              label: 'G\u00e9ographie',
              gtls: [
                {
                  code: '09030000',
                  label: 'G\u00e9ographie',
                  level: 2,
                },
                {
                  code: '09040000',
                  label: 'G\u00e9ographie du monde',
                  level: 2,
                },
              ],
              position: 6,
            },
            {
              label: 'Sciences de la Terre et de l\u2019Univers',
              gtls: [
                {
                  code: '10050000',
                  label: 'Sciences de la Terre et de l’Univers',
                  level: 2,
                },
              ],
              position: 7,
            },
            {
              label: 'Physiques, Math\u00e9matiques & Informatique',
              gtls: [
                {
                  code: '10030000',
                  label: 'Sciences physiques',
                  level: 2,
                },
                {
                  code: '10020000',
                  label: 'Math\u00e9matiques',
                  level: 2,
                },
                {
                  code: '10070000',
                  label: 'Informatique',
                  level: 2,
                },
              ],
              position: 8,
            },
            {
              label: 'Sciences appliqu\u00e9es & Industrie',
              gtls: [
                {
                  code: '10060000',
                  label: 'Sciences appliqu\u00e9es et industrie',
                  level: 2,
                },
              ],
              position: 9,
            },
            {
              label: 'Dictionnaires',
              gtls: [
                {
                  code: '13010000',
                  label: 'Dictionnaires de fran\u00e7ais',
                  level: 2,
                },
              ],
              position: 10,
            },
            {
              label: 'Encyclop\u00e9dies',
              gtls: [
                {
                  code: '13020000',
                  label: 'Encyclop\u00e9dies',
                  level: 2,
                },
              ],
              position: 11,
            },
          ],
          gtls: [
            {
              code: '08030000',
              label: 'Droit',
              level: 2,
            },
            {
              code: '10080000',
              label: 'M\u00e9decine',
              level: 2,
            },
            {
              code: '08040000',
              label: 'Entreprise, gestion et management',
              level: 2,
            },
            {
              code: '08010000',
              label: 'Sciences \u00e9conomiques',
              level: 2,
            },
            {
              code: '09050000',
              label: 'Histoire',
              level: 2,
            },
            {
              code: '09060000',
              label: 'Histoire du monde',
              level: 2,
            },
            {
              code: '09030000',
              label: 'G\u00e9ographie',
              level: 2,
            },
            {
              code: '09040000',
              label: 'G\u00e9ographie du monde',
              level: 2,
            },
            {
              code: '10050000',
              label: 'Sciences de la Terre et de l’Univers',
              level: 2,
            },
            {
              code: '10030000',
              label: 'Sciences physiques',
              level: 2,
            },
            {
              code: '10020000',
              label: 'Math\u00e9matiques',
              level: 2,
            },
            {
              code: '10070000',
              label: 'Informatique',
              level: 2,
            },
            {
              code: '10060000',
              label: 'Sciences appliqu\u00e9es et industrie',
              level: 2,
            },
            {
              code: '13010000',
              label: 'Dictionnaires de fran\u00e7ais',
              level: 2,
            },
            {
              code: '13020000',
              label: 'Encyclop\u00e9dies',
              level: 2,
            },
          ],
          label: 'Comp\u00e9tences g\u00e9n\u00e9rales',
          position: 7,
        },
        {
          children: [
            {
              label: 'Mode',
              gtls: [
                {
                  code: '06100200',
                  label: 'Mode / Parfums / Cosm\u00e9tiques',
                  level: 3,
                },
              ],
              position: 1,
            },
            {
              label: 'Peinture, Sculpture & Arts graphiques',
              gtls: [
                {
                  code: '06100100',
                  label: 'Arts appliqu\u00e9s / Arts d\u00e9coratifs autre',
                  level: 3,
                },
                {
                  code: '06100300',
                  label: 'D\u00e9coration d’int\u00e9rieur',
                  level: 3,
                },
                {
                  code: '06100400',
                  label: 'M\u00e9tiers d’art',
                  level: 3,
                },
                {
                  code: '06100500',
                  label: 'Techniques / Enseignement',
                  level: 3,
                },
                {
                  code: '06050000',
                  label: 'Peinture / Arts graphiques',
                  level: 2,
                },
                {
                  code: '06060000',
                  label: 'Sculpture / Arts plastiques',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Photos & Cin\u00e9ma',
              gtls: [
                {
                  code: '06070000',
                  label: 'Arts de l’image',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'Architecture, Urbanisme & Design',
              gtls: [
                {
                  code: '06040000',
                  label: 'Architecture / Urbanisme',
                  level: 2,
                },
              ],
              position: 4,
            },
            {
              label: 'Musique',
              gtls: [
                {
                  code: '06030000',
                  label: 'Musique',
                  level: 2,
                },
              ],
              position: 5,
            },
          ],
          gtls: [
            {
              code: '06000000',
              label: 'Arts et spectacles',
              level: 1,
            },
          ],
          label: 'Mode et Art',
          position: 8,
        },
        {
          children: [
            {
              label: 'Monde',
              gtls: [
                {
                  code: '05030000',
                  label: 'Tourisme & Voyages Monde',
                  level: 2,
                },
              ],
              position: 1,
            },
            {
              label: 'France',
              gtls: [
                {
                  code: '05020000',
                  label: 'Tourisme & Voyages France',
                  level: 2,
                },
              ],
              position: 2,
            },
            {
              label: 'Europe',
              gtls: [
                {
                  code: '05040000',
                  label: 'Tourisme & Voyages Europe',
                  level: 2,
                },
              ],
              position: 3,
            },
            {
              label: 'Asie',
              gtls: [
                {
                  code: '05100000',
                  label: 'Tourisme & Voyages Asie',
                  level: 2,
                },
              ],
              position: 4,
            },
            {
              label: 'Am\u00e9rique du Nord',
              gtls: [
                {
                  code: '05070000',
                  label: 'Tourisme & Voyages Am\u00e9rique du Nord',
                  level: 2,
                },
              ],
              position: 5,
            },
            {
              label: 'Afrique',
              gtls: [
                {
                  code: '05060000',
                  label: 'Tourisme & Voyages Afrique',
                  level: 2,
                },
              ],
              position: 6,
            },
            {
              label: 'Oc\u00e9anie',
              gtls: [
                {
                  code: '05110000',
                  label: 'Tourisme & Voyages Oc\u00e9anie',
                  level: 2,
                },
              ],
              position: 7,
            },
            {
              label: 'Arctique & Antarctique',
              gtls: [
                {
                  code: '05120000',
                  label: 'Tourisme & Voyages Arctique / Antarctique',
                  level: 2,
                },
              ],
              position: 8,
            },
            {
              label: 'Am\u00e9rique centrale & Cara\u00efbes',
              gtls: [
                {
                  code: '05080000',
                  label: 'Tourisme & Voyages Am\u00e9rique centrale et Cara\u00efbes',
                  level: 2,
                },
              ],
              position: 9,
            },
            {
              label: 'Am\u00e9rique du Sud',
              gtls: [
                {
                  code: '05090000',
                  label: 'Tourisme & Voyages Am\u00e9rique du Sud',
                  level: 2,
                },
              ],
              position: 10,
            },
            {
              label: 'Moyen-Orient',
              gtls: [
                {
                  code: '05050000',
                  label: 'Tourisme & Voyages Moyen-Orient',
                  level: 2,
                },
              ],
              position: 11,
            },
          ],
          gtls: [
            {
              code: '05000000',
              label: 'Tourisme & Voyages',
              level: 1,
            },
          ],
          label: 'Tourisme & Voyages',
          position: 9,
        },
      ],
    },
    {
      name: GenreType.MUSIC,
      values: [
        {
          name: 'ALTERNATIF',
          value: 'Alternatif',
        },
        {
          name: 'AMBIANCE',
          value: 'Ambiance',
        },
        {
          name: 'AUTRES',
          value: 'Autre',
        },
        {
          name: 'BANDES_ORIGINALES',
          value: 'Bandes originales',
        },
        {
          name: 'COMPILATIONS',
          value: 'Compilations',
        },
        {
          name: 'COUNTRY-FOLK',
          value: 'Country / Folk',
        },
        {
          name: 'ELECTRO',
          value: 'Electro',
        },
        {
          name: 'ENFANTS',
          value: 'Enfants',
        },
        {
          name: 'FUNK-SOUL-RNB-DISCO',
          value: 'Funk / Soul / RnB / Disco',
        },
        {
          name: 'JAZZ-BLUES',
          value: 'Jazz / Blues',
        },
        {
          name: 'METAL',
          value: 'Metal',
        },
        {
          name: 'MUSIQUE_CLASSIQUE',
          value: 'Musique Classique',
        },
        {
          name: 'MUSIQUE_DU_MONDE',
          value: 'Musique du monde',
        },
        {
          name: 'POP',
          value: 'Pop',
        },
        {
          name: 'RAP-HIP HOP',
          value: 'Rap / Hip Hop',
        },
        {
          name: 'REGGAE-RAGGA',
          value: 'Reggae / Ragga',
        },
        {
          name: 'ROCK',
          value: 'Rock',
        },
        {
          name: 'VARIETES',
          value: 'Variétés',
        },
        {
          name: 'VIDEOS_MUSICALES',
          value: 'Vidéos musicales',
        },
      ],

      trees: [
        {
          code: 501,
          label: 'Jazz',
          children: [
            {
              code: 502,
              label: 'Acid Jazz',
              slug: 'JAZZ-ACID_JAZZ',
            },
            {
              code: 503,
              label: 'Avant-Garde Jazz',
              slug: 'JAZZ-AVANT_GARDE_JAZZ',
            },
            {
              code: 504,
              label: 'Bebop',
              slug: 'JAZZ-BEBOP',
            },
            {
              code: 505,
              label: 'Big Band',
              slug: 'JAZZ-BIG_BAND',
            },
            {
              code: 506,
              label: 'Blue Note',
              slug: 'JAZZ-BLUE_NOTE',
            },
            {
              code: 507,
              label: 'Cool Jazz',
              slug: 'JAZZ-COOL_JAZZ',
            },
            {
              code: 508,
              label: 'Crossover Jazz',
              slug: 'JAZZ-CROSSOVER_JAZZ',
            },
            {
              code: 509,
              label: 'Dixieland',
              slug: 'JAZZ-DIXIELAND',
            },
            {
              code: 510,
              label: 'Ethio Jazz',
              slug: 'JAZZ-ETHIO_JAZZ',
            },
            {
              code: 511,
              label: 'Fusion',
              slug: 'JAZZ-FUSION',
            },
            {
              code: 512,
              label: 'Jazz Contemporain',
              slug: 'JAZZ-JAZZ_CONTEMPORAIN',
            },
            {
              code: 513,
              label: 'Jazz Funk',
              slug: 'JAZZ-JAZZ_FUNK',
            },
            {
              code: 514,
              label: 'Mainstream',
              slug: 'JAZZ-MAINSTREAM',
            },
            {
              code: 515,
              label: 'Manouche',
              slug: 'JAZZ-MANOUCHE',
            },
            {
              code: 516,
              label: 'Traditionel',
              slug: 'JAZZ-TRADITIONEL',
            },
            {
              code: 517,
              label: 'Vocal Jazz',
              slug: 'JAZZ-VOCAL_JAZZ',
            },
            {
              code: 518,
              label: 'Ragtime',
              slug: 'JAZZ-RAGTIME',
            },
            {
              code: 519,
              label: 'Smooth',
              slug: 'JAZZ-SMOOTH',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'JAZZ-OTHER',
            },
          ],
        },
        {
          code: 520,
          label: 'Blues',
          children: [
            {
              code: 521,
              label: 'Blues Acoustique',
              slug: 'BLUES-BLUES_ACOUSTIQUE',
            },
            {
              code: 522,
              label: 'Blues Contemporain',
              slug: 'BLUES-BLUES_CONTEMPORAIN',
            },
            {
              code: 523,
              label: 'Blues \u00c9lectrique',
              slug: 'BLUES-BLUES_ELECTRIQUE',
            },
            {
              code: 524,
              label: 'Blues Rock',
              slug: 'BLUES-BLUES_ROCK',
            },
            {
              code: 525,
              label: 'Chicago Blues',
              slug: 'BLUES-CHICAGO_BLUES',
            },
            {
              code: 526,
              label: 'Classic Blues',
              slug: 'BLUES-CLASSIC_BLUES',
            },
            {
              code: 527,
              label: 'Country Blues',
              slug: 'BLUES-COUNTRY_BLUES',
            },
            {
              code: 528,
              label: 'Delta Blues',
              slug: 'BLUES-DELTA_BLUES',
            },
            {
              code: 529,
              label: 'Ragtime',
              slug: 'BLUES-RAGTIME',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'BLUES-OTHER',
            },
          ],
        },
        {
          code: 530,
          label: 'Reggae',
          children: [
            {
              code: 531,
              label: '2-Tone',
              slug: 'REGGAE-TWO_TONE',
            },
            {
              code: 532,
              label: 'Dancehall',
              slug: 'REGGAE-DANCEHALL',
            },
            {
              code: 533,
              label: 'Dub',
              slug: 'REGGAE-DUB',
            },
            {
              code: 534,
              label: 'Roots ',
              slug: 'REGGAE-ROOTS',
            },
            {
              code: 535,
              label: 'Ska',
              slug: 'REGGAE-SKA',
            },
            {
              code: 536,
              label: 'Zouk ',
              slug: 'REGGAE-ZOUK',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'REGGAE-OTHER',
            },
          ],
        },
        {
          code: 600,
          label: 'Classique',
          children: [
            {
              code: 601,
              label: 'Avant-garde',
              slug: 'CLASSIQUE-AVANT_GARDE',
            },
            {
              code: 602,
              label: 'Baroque',
              slug: 'CLASSIQUE-BAROQUE',
            },
            {
              code: 603,
              label: 'Chant',
              slug: 'CLASSIQUE-CHANT',
            },
            {
              code: 604,
              label: 'Chorale',
              slug: 'CLASSIQUE-CHORALE',
            },
            {
              code: 605,
              label: 'Contemporain',
              slug: 'CLASSIQUE-CONTEMPORAIN',
            },
            {
              code: 606,
              label: 'Expressioniste',
              slug: 'CLASSIQUE-EXPRESSIONISTE',
            },
            {
              code: 607,
              label: 'Impressioniste',
              slug: 'CLASSIQUE-IMPRESSIONISTE',
            },
            {
              code: 608,
              label: 'M\u00e9dievale',
              slug: 'CLASSIQUE-MEDIEVALE',
            },
            {
              code: 609,
              label: 'Minimaliste',
              slug: 'CLASSIQUE-MINIMALISTE',
            },
            {
              code: 610,
              label: 'Moderne ',
              slug: 'CLASSIQUE-MODERNE',
            },
            {
              code: 611,
              label: 'Oratorio',
              slug: 'CLASSIQUE-ORATORIO',
            },
            {
              code: 612,
              label: 'Op\u00e9ra',
              slug: 'CLASSIQUE-OPERA',
            },
            {
              code: 613,
              label: 'Renaissance',
              slug: 'CLASSIQUE-RENAISSANCE',
            },
            {
              code: 614,
              label: 'Romantique',
              slug: 'CLASSIQUE-ROMANTIQUE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'CLASSIQUE-OTHER',
            },
          ],
        },
        {
          code: 700,
          label: 'Musique du Monde',
          children: [
            {
              code: 701,
              label: 'Africaine',
              slug: 'MUSIQUE_DU_MONDE-AFRICAINE',
            },
            {
              code: 702,
              label: 'Afro Beat',
              slug: 'MUSIQUE_DU_MONDE-AFRO_BEAT',
            },
            {
              code: 703,
              label: 'Afro Pop',
              slug: 'MUSIQUE_DU_MONDE-AFRO_POP',
            },
            {
              code: 704,
              label: 'Alternativo ',
              slug: 'MUSIQUE_DU_MONDE-ALTERNATIVO',
            },
            {
              code: 705,
              label: 'Am\u00e9rique du Nord',
              slug: 'MUSIQUE_DU_MONDE-AMERIQUE_DU_NORD',
            },
            {
              code: 706,
              label: 'Am\u00e9rique du Sud',
              slug: 'MUSIQUE_DU_MONDE-AMERIQUE_DU_SUD',
            },
            {
              code: 707,
              label: 'Asiatique',
              slug: 'MUSIQUE_DU_MONDE-ASIATIQUE',
            },
            {
              code: 708,
              label: 'Baladas y Boleros',
              slug: 'MUSIQUE_DU_MONDE-BALADAS_Y_BOLEROS',
            },
            {
              code: 709,
              label: 'Bossa Nova',
              slug: 'MUSIQUE_DU_MONDE-BOSSA_NOVA',
            },
            {
              code: 710,
              label: 'Br\u00e9silienne',
              slug: 'MUSIQUE_DU_MONDE-BRESILIENNE',
            },
            {
              code: 711,
              label: 'Cajun',
              slug: 'MUSIQUE_DU_MONDE-CAJUN',
            },
            {
              code: 712,
              label: 'Calypso',
              slug: 'MUSIQUE_DU_MONDE-CALYPSO',
            },
            {
              code: 713,
              label: 'Carib\u00e9enne',
              slug: 'MUSIQUE_DU_MONDE-CARIBEENNE',
            },
            {
              code: 714,
              label: 'Celtique',
              slug: 'MUSIQUE_DU_MONDE-CELTIQUE',
            },
            {
              code: 715,
              label: 'Cumbia ',
              slug: 'MUSIQUE_DU_MONDE-CUMBIA',
            },
            {
              code: 716,
              label: 'Flamenco',
              slug: 'MUSIQUE_DU_MONDE-FLAMENCO',
            },
            {
              code: 717,
              label: 'Gr\u00e8cque',
              slug: 'MUSIQUE_DU_MONDE-GRECQUE',
            },
            {
              code: 718,
              label: 'Indienne',
              slug: 'MUSIQUE_DU_MONDE-INDIENNE',
            },
            {
              code: 719,
              label: 'Latin Jazz',
              slug: 'MUSIQUE_DU_MONDE-LATIN_JAZZ',
            },
            {
              code: 720,
              label: 'Moyen-Orient',
              slug: 'MUSIQUE_DU_MONDE-MOYEN_ORIENT',
            },
            {
              code: 721,
              label: 'Musique Latine Contemporaine',
              slug: 'MUSIQUE_DU_MONDE-LATINE_CONTEMPORAINE',
            },
            {
              code: 722,
              label: 'Nuevo Flamenco',
              slug: 'MUSIQUE_DU_MONDE-NUEVO_FLAMENCO',
            },
            {
              code: 723,
              label: 'Pop Latino',
              slug: 'MUSIQUE_DU_MONDE-POP_LATINO',
            },
            {
              code: 724,
              label: 'Portuguese fado ',
              slug: 'MUSIQUE_DU_MONDE-PORTUGUESE_FADO',
            },
            {
              code: 725,
              label: 'Rai',
              slug: 'MUSIQUE_DU_MONDE-RAI',
            },
            {
              code: 726,
              label: 'Salsa',
              slug: 'MUSIQUE_DU_MONDE-SALSA',
            },
            {
              code: 727,
              label: 'Tango Argentin',
              slug: 'MUSIQUE_DU_MONDE-TANGO_ARGENTIN',
            },
            {
              code: 728,
              label: 'Yiddish',
              slug: 'MUSIQUE_DU_MONDE-YIDDISH',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'MUSIQUE_DU_MONDE-OTHER',
            },
          ],
        },
        {
          code: 800,
          label: 'Pop',
          children: [
            {
              code: 801,
              label: 'Britpop',
              slug: 'POP-BRITPOP',
            },
            {
              code: 802,
              label: 'Bubblegum ',
              slug: 'POP-BUBBLEGUM',
            },
            {
              code: 803,
              label: 'Dance Pop',
              slug: 'POP-DANCE_POP',
            },
            {
              code: 804,
              label: 'Dream Pop\u00a0',
              slug: 'POP-DREAM_POP',
            },
            {
              code: 805,
              label: 'Electro Pop',
              slug: 'POP-ELECTRO_POP',
            },
            {
              code: 806,
              label: 'Indie Pop',
              slug: 'POP-INDIE_POP',
            },
            {
              code: 808,
              label: 'J-Pop',
              slug: 'POP-J_POP',
            },
            {
              code: 809,
              label: 'K-Pop',
              slug: 'POP-K_POP',
            },
            {
              code: 810,
              label: 'Pop Punk ',
              slug: 'POP-POP_PUNK',
            },
            {
              code: 811,
              label: 'Pop/Rock',
              slug: 'POP-POP_ROCK',
            },
            {
              code: 812,
              label: 'Power Pop\u00a0',
              slug: 'POP-POWER_POP',
            },
            {
              code: 813,
              label: 'Soft Rock',
              slug: 'POP-SOFT_ROCK',
            },
            {
              code: 814,
              label: 'Synthpop\u00a0',
              slug: 'POP-SYNTHPOP',
            },
            {
              code: 815,
              label: 'Teen Pop',
              slug: 'POP-TEEN_POP',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'POP-OTHER',
            },
          ],
        },
        {
          code: 820,
          label: 'Rock',
          children: [
            {
              code: 821,
              label: 'Acid Rock ',
              slug: 'ROCK-ACID_ROCK',
            },
            {
              code: 822,
              label: 'Arena Rock',
              slug: 'ROCK-ARENA_ROCK',
            },
            {
              code: 823,
              label: 'Art Rock',
              slug: 'ROCK-ART_ROCK',
            },
            {
              code: 824,
              label: 'College Rock',
              slug: 'ROCK-COLLEGE_ROCK',
            },
            {
              code: 825,
              label: 'Glam Rock',
              slug: 'ROCK-GLAM_ROCK',
            },
            {
              code: 826,
              label: 'Grunge',
              slug: 'ROCK-GRUNGE',
            },
            {
              code: 827,
              label: 'Hard Rock',
              slug: 'ROCK-HARD_ROCK',
            },
            {
              code: 828,
              label: 'Indie Rock',
              slug: 'ROCK-INDIE_ROCK',
            },
            {
              code: 829,
              label: 'Lo-fi',
              slug: 'ROCK-LO_FI',
            },
            {
              code: 830,
              label: 'Prog-Rock',
              slug: 'ROCK-PROG_ROCK',
            },
            {
              code: 831,
              label: 'Psychedelic',
              slug: 'ROCK-PSYCHEDELIC',
            },
            {
              code: 832,
              label: 'Rock & Roll',
              slug: 'ROCK-ROCK_N_ROLL',
            },
            {
              code: 833,
              label: 'Rock Experimental',
              slug: 'ROCK-EXPERIMENTAL',
            },
            {
              code: 834,
              label: 'Rockabilly',
              slug: 'ROCK-ROCKABILLY',
            },
            {
              code: 835,
              label: 'Shoegaze',
              slug: 'ROCK-SHOEGAZE',
            },
            {
              code: 836,
              label: 'Rock Electro',
              slug: 'ROCK-ELECTRO',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'ROCK-OTHER',
            },
          ],
        },
        {
          code: 840,
          label: 'Metal',
          children: [
            {
              code: 841,
              label: 'Black Metal',
              slug: 'METAL-BLACK_METAL',
            },
            {
              code: 842,
              label: 'Death Metal ',
              slug: 'METAL-DEATH_METAL',
            },
            {
              code: 843,
              label: 'Doom Metal',
              slug: 'METAL-DOOM_METAL',
            },
            {
              code: 844,
              label: 'Gothic ',
              slug: 'METAL-GOTHIC',
            },
            {
              code: 845,
              label: 'Metal Core',
              slug: 'METAL-METAL_CORE',
            },
            {
              code: 846,
              label: 'Metal\u00a0Progressif',
              slug: 'METAL-METAL_PROGRESSIF',
            },
            {
              code: 847,
              label: 'Trash Metal',
              slug: 'METAL-TRASH_METAL',
            },
            {
              code: 848,
              label: 'Metal Industriel',
              slug: 'METAL-METAL_INDUSTRIEL',
            },
            {
              code: 849,
              label: 'Fusion',
              slug: 'METAL-FUSION',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'METAL-OTHER',
            },
          ],
        },
        {
          code: 850,
          label: 'Punk',
          children: [
            {
              code: 851,
              label: 'Post Punk ',
              slug: 'PUNK-POST_PUNK',
            },
            {
              code: 852,
              label: 'Hardcore Punk',
              slug: 'PUNK-HARDCORE_PUNK',
            },
            {
              code: 853,
              label: 'Afro\u00a0Punk',
              slug: 'PUNK-AFRO_PUNK',
            },
            {
              code: 854,
              label: 'Grindcore',
              slug: 'PUNK-GRINDCORE',
            },
            {
              code: 855,
              label: 'Noise Rock ',
              slug: 'PUNK-NOISE_ROCK',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'PUNK-OTHER',
            },
          ],
        },
        {
          code: 860,
          label: 'Folk',
          children: [
            {
              code: 861,
              label: 'Folk Contemporaine',
              slug: 'FOLK-FOLK_CONTEMPORAINE',
            },
            {
              code: 862,
              label: 'Indie Folk',
              slug: 'FOLK-INDIE_FOLK',
            },
            {
              code: 863,
              label: 'Folk Rock',
              slug: 'FOLK-FOLK_ROCK',
            },
            {
              code: 864,
              label: 'New Acoustic',
              slug: 'FOLK-NEW_ACOUSTIC',
            },
            {
              code: 865,
              label: 'Folk Traditionelle',
              slug: 'FOLK-FOLK_TRADITIONELLE',
            },
            {
              code: 866,
              label: 'Tex-Mex',
              slug: 'FOLK-TEX_MEX',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'FOLK-OTHER',
            },
          ],
        },
        {
          code: 870,
          label: 'Country',
          children: [
            {
              code: 871,
              label: 'Country Alternative',
              slug: 'COUNTRY-COUNTRY_ALTERNATIVE',
            },
            {
              code: 872,
              label: 'Americana',
              slug: 'COUNTRY-AMERICANA',
            },
            {
              code: 873,
              label: 'Bluegrass',
              slug: 'COUNTRY-BLUEGRASS',
            },
            {
              code: 874,
              label: 'Country Contemporaine',
              slug: 'COUNTRY-COUNTRY_CONTEMPORAINE',
            },
            {
              code: 875,
              label: 'Gospel Country',
              slug: 'COUNTRY-GOSPEL_COUNTRY',
            },
            {
              code: 876,
              label: 'Country Pop',
              slug: 'COUNTRY-COUNTRY_POP',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'COUNTRY-OTHER',
            },
          ],
        },
        {
          code: 880,
          label: 'Electro',
          children: [
            {
              code: 881,
              label: 'Bitpop',
              slug: 'ELECTRO-BITPOP',
            },
            {
              code: 882,
              label: 'Breakbeat ',
              slug: 'ELECTRO-BREAKBEAT',
            },
            {
              code: 883,
              label: 'Chillwave',
              slug: 'ELECTRO-CHILLWAVE',
            },
            {
              code: 884,
              label: 'Dance',
              slug: 'ELECTRO-DANCE',
            },
            {
              code: 885,
              label: 'Downtempo',
              slug: 'ELECTRO-DOWNTEMPO',
            },
            {
              code: 886,
              label: 'Drum & Bass ',
              slug: 'ELECTRO-DRUM_AND_BASS',
            },
            {
              code: 887,
              label: 'Dubstep',
              slug: 'ELECTRO-DUBSTEP',
            },
            {
              code: 888,
              label: 'Electro Experimental',
              slug: 'ELECTRO-EXPERIMENTAL',
            },
            {
              code: 889,
              label: 'Electronica',
              slug: 'ELECTRO-ELECTRONICA',
            },
            {
              code: 890,
              label: 'Garage',
              slug: 'ELECTRO-GARAGE',
            },
            {
              code: 891,
              label: 'Grime',
              slug: 'ELECTRO-GRIME',
            },
            {
              code: 892,
              label: 'Hard Dance',
              slug: 'ELECTRO-HARD_DANCE',
            },
            {
              code: 893,
              label: 'Hardcore',
              slug: 'ELECTRO-HARDCORE',
            },
            {
              code: 894,
              label: 'House',
              slug: 'ELECTRO-HOUSE',
            },
            {
              code: 895,
              label: 'Industriel',
              slug: 'ELECTRO-INDUSTRIEL',
            },
            {
              code: 896,
              label: 'Lounge',
              slug: 'ELECTRO-LOUNGE',
            },
            {
              code: 897,
              label: 'Techno',
              slug: 'ELECTRO-TECHNO',
            },
            {
              code: 898,
              label: 'Trance',
              slug: 'ELECTRO-TRANCE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'ELECTRO-OTHER',
            },
          ],
        },
        {
          code: 900,
          label: 'Hip-Hop/Rap',
          children: [
            {
              code: 901,
              label: 'Bounce',
              slug: 'HIP_HOP_RAP-BOUNCE',
            },
            {
              code: 902,
              label: 'Hip Hop',
              slug: 'HIP_HOP_RAP-HIP_HOP',
            },
            {
              code: 903,
              label: 'Rap Alternatif',
              slug: 'HIP_HOP_RAP-RAP_ALTERNATIF',
            },
            {
              code: 905,
              label: 'Rap East Coast',
              slug: 'HIP_HOP_RAP-RAP_EAST_COAST',
            },
            {
              code: 906,
              label: 'Rap Fran\u00e7ais',
              slug: 'HIP_HOP_RAP-RAP_FRANCAIS',
            },
            {
              code: 907,
              label: 'Rap Gangsta',
              slug: 'HIP_HOP_RAP-RAP_GANGSTA',
            },
            {
              code: 908,
              label: 'Rap Hardcore',
              slug: 'HIP_HOP_RAP-RAP_HARDCORE',
            },
            {
              code: 909,
              label: 'Rap Latino',
              slug: 'HIP_HOP_RAP-RAP_LATINO',
            },
            {
              code: 910,
              label: 'Rap Old School',
              slug: 'HIP_HOP_RAP-RAP_OLD_SCHOOL',
            },
            {
              code: 911,
              label: 'Rap Underground',
              slug: 'HIP_HOP_RAP-RAP_UNDERGROUND',
            },
            {
              code: 912,
              label: 'Rap West Coast',
              slug: 'HIP_HOP_RAP-RAP_WEST_COAST',
            },
            {
              code: 913,
              label: 'Trap',
              slug: 'HIP_HOP_RAP-TRAP',
            },
            {
              code: 914,
              label: 'Trip Hop',
              slug: 'HIP_HOP_RAP-TRIP_HOP',
            },
            {
              code: 921,
              label: 'R&B Contemporain',
              slug: 'HIP_HOP_RAP-R&B_CONTEMPORAIN',
            },
            {
              code: 922,
              label: 'Disco',
              slug: 'HIP_HOP_RAP-DISCO',
            },
            {
              code: 923,
              label: 'Doo Wop',
              slug: 'HIP_HOP_RAP-DOO_WOP',
            },
            {
              code: 924,
              label: 'Funk',
              slug: 'HIP_HOP_RAP-FUNK',
            },
            {
              code: 925,
              label: 'Soul',
              slug: 'HIP_HOP_RAP-SOUL',
            },
            {
              code: 926,
              label: 'Motown',
              slug: 'HIP_HOP_RAP-MOTOWN',
            },
            {
              code: 927,
              label: 'Neo Soul',
              slug: 'HIP_HOP_RAP-NEO_SOUL',
            },
            {
              code: 928,
              label: 'Soul Psychedelique',
              slug: 'HIP_HOP_RAP-SOUL_PSYCHEDELIQUE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'HIP_HOP_RAP-OTHER',
            },
          ],
        },
        {
          code: 930,
          label: 'Gospel',
          children: [
            {
              code: 931,
              label: 'Spiritual Gospel',
              slug: 'GOSPEL-SPIRITUAL_GOSPEL',
            },
            {
              code: 932,
              label: 'Traditional Gospel',
              slug: 'GOSPEL-TRADITIONAL_GOSPEL',
            },
            {
              code: 933,
              label: 'Southern Gospel',
              slug: 'GOSPEL-SOUTHERN_GOSPEL',
            },
            {
              code: 934,
              label: 'Contemporary Gospel',
              slug: 'GOSPEL-CONTEMPORARY_GOSPEL',
            },
            {
              code: 935,
              label: 'Bluegrass Gospel',
              slug: 'GOSPEL-BLUEGRASS_GOSPEL',
            },
            {
              code: 936,
              label: 'Blues Gospel',
              slug: 'GOSPEL-BLUES_GOSPEL',
            },
            {
              code: 937,
              label: 'Country Gospel',
              slug: 'GOSPEL-COUNTRY_GOSPEL',
            },
            {
              code: 938,
              label: 'Hybrid Gospel',
              slug: 'GOSPEL-HYBRID_GOSPEL',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'GOSPEL-OTHER',
            },
          ],
        },
        {
          code: 1000,
          label: 'Chansons / Vari\u00e9t\u00e9s',
          children: [
            {
              code: 1001,
              label: 'Musette',
              slug: 'CHANSON_VARIETE-MUSETTE',
            },
            {
              code: 1002,
              label: 'Chanson Fran\u00e7aise',
              slug: 'CHANSON_VARIETE-CHANSON_FRANCAISE',
            },
            {
              code: 1003,
              label: 'Music Hall',
              slug: 'CHANSON_VARIETE-MUSIC_HALL',
            },
            {
              code: 1004,
              label: 'Folklore fran\u00e7ais',
              slug: 'CHANSON_VARIETE-FOLKLORE_FRANCAIS',
            },
            {
              code: 1005,
              label: 'Chanson \u00e0 texte',
              slug: 'CHANSON_VARIETE-CHANSON_\u00c0_TEXTE',
            },
            {
              code: 1006,
              label: 'Slam',
              slug: 'CHANSON_VARIETE-SLAM',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'CHANSON_VARIETE-OTHER',
            },
          ],
        },
        {
          code: -1,
          label: 'Autre',
          children: [
            {
              code: -1,
              label: 'Autre',
              slug: 'OTHER',
            },
          ],
        },
      ],
    },
    {
      name: GenreType.SHOW,
      values: [
        {
          name: 'Arts de la rue',
          value: 'Arts de la rue',
        },
        {
          name: 'Autre',
          value: 'Autre',
        },
        {
          name: 'Autre (spectacle sur glace, historique, aquatique, …)  ',
          value: 'Autre (spectacle sur glace, historique, aquatique, …)  ',
        },
        {
          name: 'Cirque',
          value: 'Cirque',
        },
        {
          name: 'Danse',
          value: 'Danse',
        },
        {
          name: 'Humour / Café-théâtre',
          value: 'Humour / Café-théâtre',
        },
        {
          name: 'Opéra',
          value: 'Opéra',
        },
        {
          name: 'Pluridisciplinaire',
          value: 'Pluridisciplinaire',
        },
        {
          name: 'Spectacle Jeunesse',
          value: 'Spectacle Jeunesse',
        },
        {
          name: 'Spectacle Musical / Cabaret / Opérette',
          value: 'Spectacle Musical / Cabaret / Opérette',
        },
        {
          name: 'Théâtre',
          value: 'Théâtre',
        },
      ],
      trees: [
        {
          children: [
            {
              code: 101,
              label: 'Carnaval',
              slug: 'ART_DE_LA_RUE-CARNAVAL',
            },
            {
              code: 102,
              label: 'Fanfare',
              slug: 'ART_DE_LA_RUE-FANFARE',
            },
            {
              code: 103,
              label: 'Mime',
              slug: 'ART_DE_LA_RUE-MIME',
            },
            {
              code: 104,
              label: 'Parade',
              slug: 'ART_DE_LA_RUE-PARADE',
            },
            {
              code: 105,
              label: 'Th\u00e9\u00e2tre de Rue',
              slug: 'ART_DE_LA_RUE-THEATRE_DE_RUE',
            },
            {
              code: 106,
              label: 'Th\u00e9\u00e2tre Promenade',
              slug: 'ART_DE_LA_RUE-THEATRE_PROMENADE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'ART_DE_LA_RUE-OTHER',
            },
          ],
          code: 100,
          label: 'Arts de la rue',
        },
        {
          children: [
            {
              code: 201,
              label: 'Cirque Contemporain',
              slug: 'CIRQUE-CIRQUE_CONTEMPORAIN',
            },
            {
              code: 202,
              label: 'Cirque Hors les murs',
              slug: 'CIRQUE-CIRQUE_HORS_LES_MURS',
            },
            {
              code: 203,
              label: 'Cirque Traditionel',
              slug: 'CIRQUE-CIRQUE_TRADITIONNEL',
            },
            {
              code: 204,
              label: 'Cirque Voyageur',
              slug: 'CIRQUE-CIRQUE_VOYAGEUR',
            },
            {
              code: 205,
              label: 'Clown',
              slug: 'CIRQUE-CLOWN',
            },
            {
              code: 206,
              label: 'Hypnose',
              slug: 'CIRQUE-HYPNOSE',
            },
            {
              code: 207,
              label: 'Mentaliste',
              slug: 'CIRQUE-MENTALISTE',
            },
            {
              code: 208,
              label: 'Spectacle de Magie',
              slug: 'CIRQUE-SPECTACLE_DE_MAGIE',
            },
            {
              code: 209,
              label: 'Spectacle \u00c9questre',
              slug: 'CIRQUE-SPECTACLE_EQUESTRE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'CIRQUE-OTHER',
            },
          ],
          code: 200,
          label: 'Cirque',
        },
        {
          children: [
            {
              code: 302,
              label: 'Ballet',
              slug: 'DANSE-BALLET',
            },
            {
              code: 303,
              label: 'Cancan',
              slug: 'DANSE-CANCAN',
            },
            {
              code: 304,
              label: 'Claquette',
              slug: 'DANSE-CLAQUETTE',
            },
            {
              code: 305,
              label: 'Classique',
              slug: 'DANSE-CLASSIQUE',
            },
            {
              code: 306,
              label: 'Contemporaine',
              slug: 'DANSE-CONTEMPORAINE',
            },
            {
              code: 307,
              label: 'Danse du Monde',
              slug: 'DANSE-DANSE_DU_MONDE',
            },
            {
              code: 308,
              label: 'Flamenco',
              slug: 'DANSE-FLAMENCO',
            },
            {
              code: 309,
              label: 'Moderne Jazz',
              slug: 'DANSE-MODERNE_JAZZ',
            },
            {
              code: 311,
              label: 'Salsa',
              slug: 'DANSE-SALSA',
            },
            {
              code: 312,
              label: 'Swing',
              slug: 'DANSE-SWING',
            },
            {
              code: 313,
              label: 'Tango',
              slug: 'DANSE-TANGO',
            },
            {
              code: 314,
              label: 'Urbaine',
              slug: 'DANSE-URBAINE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'DANSE-OTHER',
            },
          ],
          code: 300,
          label: 'Danse',
        },
        {
          children: [
            {
              code: 401,
              label: 'Caf\u00e9 Th\u00e9\u00e2tre',
              slug: 'HUMOUR-CAFE_THEATRE',
            },
            {
              code: 402,
              label: 'Improvisation',
              slug: 'HUMOUR-IMPROVISATION',
            },
            {
              code: 403,
              label: 'Seul.e en sc\u00e8ne',
              slug: 'HUMOUR-SEUL_EN_SCENE',
            },
            {
              code: 404,
              label: 'Sketch',
              slug: 'HUMOUR-SKETCH',
            },
            {
              code: 405,
              label: 'Stand Up',
              slug: 'HUMOUR-STAND_UP',
            },
            {
              code: 406,
              label: 'Ventriloque',
              slug: 'HUMOUR-VENTRILOQUE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'HUMOUR-OTHER',
            },
          ],
          code: 400,
          label: 'Humour / Caf\u00e9-th\u00e9\u00e2tre',
        },
        {
          children: [
            {
              code: 1101,
              label: 'Cabaret',
              slug: 'SPECTACLE_MUSICAL-CABARET',
            },
            {
              code: 1102,
              label: 'Caf\u00e9 Concert',
              slug: 'SPECTACLE_MUSICAL-CAFE_CONCERT',
            },
            {
              code: 1103,
              label: 'Claquette',
              slug: 'SPECTACLE_MUSICAL-CLAQUETTE',
            },
            {
              code: 1104,
              label: 'Com\u00e9die Musicale',
              slug: 'SPECTACLE_MUSICAL-COMEDIE_MUSICALE',
            },
            {
              code: 1105,
              label: 'Op\u00e9ra Bouffe',
              slug: 'SPECTACLE_MUSICAL-OPERA_BOUFFE',
            },
            {
              code: 1108,
              label: 'Op\u00e9rette',
              slug: 'SPECTACLE_MUSICAL-OPERETTE',
            },
            {
              code: 1109,
              label: 'Revue',
              slug: 'SPECTACLE_MUSICAL-REVUE',
            },
            {
              code: 1111,
              label: 'Burlesque',
              slug: 'SPECTACLE_MUSICAL-BURLESQUE',
            },
            {
              code: 1112,
              label: 'Com\u00e9die-Ballet',
              slug: 'SPECTACLE_MUSICAL-COMEDIE_BALLET',
            },
            {
              code: 1113,
              label: 'Op\u00e9ra Comique',
              slug: 'SPECTACLE_MUSICAL-OPERA_COMIQUE',
            },
            {
              code: 1114,
              label: 'Op\u00e9ra-Ballet',
              slug: 'SPECTACLE_MUSICAL-OPERA_BALLET',
            },
            {
              code: 1115,
              label: 'Th\u00e9\u00e2tre musical',
              slug: 'SPECTACLE_MUSICAL-THEATRE_MUSICAL',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'SPECTACLE_MUSICAL-OTHER',
            },
          ],
          code: 1100,
          label: 'Spectacle Musical / Cabaret / Op\u00e9rette',
        },
        {
          children: [
            {
              code: 1201,
              label: 'Conte',
              slug: 'SPECTACLE_JEUNESSE-CONTE',
            },
            {
              code: 1202,
              label: 'Th\u00e9\u00e2tre jeunesse',
              slug: 'SPECTACLE_JEUNESSE-THEATRE_JEUNESSE',
            },
            {
              code: 1203,
              label: 'Spectacle Petite Enfance',
              slug: 'SPECTACLE_JEUNESSE-SPECTACLE_PETITE_ENFANCE',
            },
            {
              code: 1204,
              label: 'Magie Enfance',
              slug: 'SPECTACLE_JEUNESSE-MAGIE_ENFANCE',
            },
            {
              code: 1205,
              label: 'Spectacle p\u00e9dagogique',
              slug: 'SPECTACLE_JEUNESSE-SPECTACLE_PEDAGOGIQUE',
            },
            {
              code: 1206,
              label: 'Marionettes',
              slug: 'SPECTACLE_JEUNESSE-MARIONETTES',
            },
            {
              code: 1207,
              label: 'Com\u00e9die musicale jeunesse',
              slug: 'SPECTACLE_JEUNESSE-COMEDIE_MUSICALE_JEUNESSE',
            },
            {
              code: 1208,
              label: 'Th\u00e9\u00e2tre d’Ombres',
              slug: 'SPECTACLE_JEUNESSE-THEATRE_D_OMBRES',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'SPECTACLE_JEUNESSE-OTHER',
            },
          ],
          code: 1200,
          label: 'Spectacle Jeunesse',
        },
        {
          children: [
            {
              code: 1301,
              label: 'Boulevard',
              slug: 'THEATRE-BOULEVARD',
            },
            {
              code: 1302,
              label: 'Classique',
              slug: 'THEATRE-CLASSIQUE',
            },
            {
              code: 1303,
              label: 'Com\u00e9die',
              slug: 'THEATRE-COMEDIE',
            },
            {
              code: 1304,
              label: 'Contemporain',
              slug: 'THEATRE-CONTEMPORAIN',
            },
            {
              code: 1305,
              label: 'Lecture',
              slug: 'THEATRE-LECTURE',
            },
            {
              code: 1306,
              label: 'Spectacle Sc\u00e9nographique',
              slug: 'THEATRE-SPECTACLE_SCENOGRAPHIQUE',
            },
            {
              code: 1307,
              label: 'Th\u00e9\u00e2tre Experimental',
              slug: 'THEATRE-THEATRE_EXPERIMENTAL',
            },
            {
              code: 1308,
              label: 'Th\u00e9\u00e2tre d’Objet',
              slug: 'THEATRE-THEATRE_D_OBJET',
            },
            {
              code: 1309,
              label: 'Trag\u00e9die',
              slug: 'THEATRE-TRAGEDIE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'THEATRE-OTHER',
            },
          ],
          code: 1300,
          label: 'Th\u00e9\u00e2tre',
        },
        {
          children: [
            {
              code: 1401,
              label: 'Performance',
              slug: 'PLURIDISCIPLINAIRE-PERFORMANCE',
            },
            {
              code: 1402,
              label: 'Po\u00e9sie',
              slug: 'PLURIDISCIPLINAIRE-POESIE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'PLURIDISCIPLINAIRE-OTHER',
            },
          ],
          code: 1400,
          label: 'Pluridisciplinaire',
        },
        {
          children: [
            {
              code: 1501,
              label: 'Son et lumi\u00e8re',
              slug: 'OTHER-SON_ET_LUMIERE',
            },
            {
              code: 1502,
              label: 'Spectacle sur glace',
              slug: 'OTHER-SPECTACLE_SUR_GLACE',
            },
            {
              code: 1503,
              label: 'Spectacle historique',
              slug: 'OTHER-SPECTACLE_HISTORIQUE',
            },
            {
              code: 1504,
              label: 'Spectacle aquatique',
              slug: 'OTHER-SPECTACLE_AQUATIQUE',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'OTHER-OTHER',
            },
          ],
          code: 1500,
          label: 'Autre (spectacle sur glace, historique, aquatique, \u2026)  ',
        },
        {
          children: [
            {
              code: 1511,
              label: 'Op\u00e9ra s\u00e9rie',
              slug: 'OPERA-OPERA_SERIE',
            },
            {
              code: 1512,
              label: 'Grand op\u00e9ra',
              slug: 'OPERA-GRAND_OPERA',
            },
            {
              code: 1513,
              label: 'Op\u00e9ra bouffe',
              slug: 'OPERA-OPERA_BOUFFE',
            },
            {
              code: 1514,
              label: 'Op\u00e9ra comique',
              slug: 'OPERA-OPERA_COMIQUE',
            },
            {
              code: 1515,
              label: 'Op\u00e9ra-ballet',
              slug: 'OPERA-OPERA_BALLET',
            },
            {
              code: 1516,
              label: 'Singspiel',
              slug: 'OPERA-SINGSPIEL',
            },
            {
              code: -1,
              label: 'Autre',
              slug: 'OPERA-OTHER',
            },
          ],
          code: 1510,
          label: 'Op\u00e9ra',
        },
        {
          children: [
            {
              code: -1,
              label: 'Autre',
              slug: 'OTHER',
            },
          ],
          code: -1,
          label: 'Autre',
        },
      ],
    },
    {
      name: GenreType.MOVIE,
      values: [
        {
          name: 'ACTION',
          value: 'Action',
        },
        {
          name: 'ANIMATION',
          value: 'Animation',
        },
        {
          name: 'MARTIAL_ARTS',
          value: 'Arts martiaux',
        },
        {
          name: 'ADVENTURE',
          value: 'Aventure',
        },
        {
          name: 'BIOPIC',
          value: 'Biopic',
        },
        {
          name: 'BOLLYWOOD',
          value: 'Bollywood',
        },
        {
          name: 'COMEDY',
          value: 'Comédie',
        },
        {
          name: 'COMEDY_DRAMA',
          value: 'Comédie dramatique',
        },
        {
          name: 'MUSICAL',
          value: 'Comédie musicale',
        },
        {
          name: 'CONCERT',
          value: 'Concert',
        },
        {
          name: 'DIVERS',
          value: 'Divers',
        },
        {
          name: 'DOCUMENTARY',
          value: 'Documentaire',
        },
        {
          name: 'DRAMA',
          value: 'Drame',
        },
        {
          name: 'KOREAN_DRAMA',
          value: 'Drame coréen',
        },
        {
          name: 'SPY',
          value: 'Espionnage',
        },
        {
          name: 'EXPERIMENTAL',
          value: 'Expérimental',
        },
        {
          name: 'FAMILY',
          value: 'Familial',
        },
        {
          name: 'FANTASY',
          value: 'Fantastique',
        },
        {
          name: 'WARMOVIE',
          value: 'Guerre',
        },
        {
          name: 'HISTORICAL',
          value: 'Historique',
        },
        {
          name: 'HISTORICAL_EPIC',
          value: 'Historique-épique',
        },
        {
          name: 'HORROR',
          value: 'Horreur',
        },
        {
          name: 'JUDICIAL',
          value: 'Judiciaire',
        },
        {
          name: 'MUSIC',
          value: 'Musique',
        },
        {
          name: 'OPERA',
          value: 'Opéra',
        },
        {
          name: 'PERFORMANCE',
          value: 'Performance',
        },
        {
          name: 'DETECTIVE',
          value: 'Policier',
        },
        {
          name: 'ROMANCE',
          value: 'Romance',
        },
        {
          name: 'SCIENCE_FICTION',
          value: 'Science-fiction',
        },
        {
          name: 'SPORT_EVENT',
          value: 'Sport',
        },
        {
          name: 'THRILLER',
          value: 'Thriller',
        },
        {
          name: 'WESTERN',
          value: 'Western',
        },
        {
          name: 'EROTIC',
          value: 'Érotique',
        },
      ],
      trees: [
        {
          label: 'Action',
          name: 'ACTION',
        },
        {
          label: 'Aventure',
          name: 'ADVENTURE',
        },
        {
          label: 'Animation',
          name: 'ANIMATION',
        },
        {
          label: 'Biopic',
          name: 'BIOPIC',
        },
        {
          label: 'Bollywood',
          name: 'BOLLYWOOD',
        },
        {
          label: 'Com\u00e9die',
          name: 'COMEDY',
        },
        {
          label: 'Com\u00e9die dramatique',
          name: 'COMEDY_DRAMA',
        },
        {
          label: 'Concert',
          name: 'CONCERTS_FESTIVALS',
        },
        {
          label: 'Policier',
          name: 'DETECTIVE',
        },
        {
          label: 'Divers',
          name: 'DIVERS',
        },
        {
          label: 'Documentaire',
          name: 'DOCUMENTARY',
        },
        {
          label: 'Drame',
          name: 'DRAMA',
        },
        {
          label: '\u00c9rotique',
          name: 'EROTIC',
        },
        {
          label: 'Exp\u00e9rimental',
          name: 'EXPERIMENTAL',
        },
        {
          label: 'Familial',
          name: 'FAMILY',
        },
        {
          label: 'Fantastique',
          name: 'FANTASY',
        },
        {
          label: 'Historique',
          name: 'HISTORICAL',
        },
        {
          label: 'Historique-\u00e9pique',
          name: 'HISTORICAL_EPIC',
        },
        {
          label: 'Horreur',
          name: 'HORROR',
        },
        {
          label: 'Judiciaire',
          name: 'JUDICIAL',
        },
        {
          label: 'Drame cor\u00e9en',
          name: 'KOREAN_DRAMA',
        },
        {
          label: 'Arts martiaux',
          name: 'MARTIAL_ARTS',
        },
        {
          label: 'Musique',
          name: 'MUSIC',
        },
        {
          label: 'Com\u00e9die musicale',
          name: 'MUSICAL',
        },
        {
          label: 'Op\u00e9ra',
          name: 'OPERA',
        },
        {
          label: 'Performance',
          name: 'PERFORMANCE',
        },
        {
          label: 'Romance',
          name: 'ROMANCE',
        },
        {
          label: 'Science-fiction',
          name: 'SCIENCE_FICTION',
        },
        {
          label: 'Sport',
          name: 'SPORT_EVENT',
        },
        {
          label: 'Espionnage',
          name: 'SPY',
        },
        {
          label: 'Thriller',
          name: 'THRILLER',
        },
        {
          label: 'Guerre',
          name: 'WARMOVIE',
        },
        {
          label: 'Western',
          name: 'WESTERN',
        },
      ],
    },
  ],
}
