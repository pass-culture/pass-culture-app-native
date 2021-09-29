1. Replace CategoryNameEnum by CategoryIdEnum

```typescript
// 12 categories
export enum CategoryNameEnum {
  CINEMA = 'CINEMA', // ok
  CONFERENCE = 'CONFERENCE', // ok
  INSTRUMENT = 'INSTRUMENT', // ok
  JEUXVIDEO = 'JEUX_VIDEO', // JEU
  FILM = 'FILM', // ok
  LECON = 'LECON', // PRATIQUEART
  LIVRE = 'LIVRE', // ok
  MUSIQUE = 'MUSIQUE', // MUSIQUELIVE
  PRESSE = 'PRESSE', // MEDIA
  SPECTACLE = 'SPECTACLE', // ok
  VISITE = 'VISITE', // MUSEE
  MATERIELARTCREA = 'MATERIEL_ART_CREA', // BEAUXARTS
}
```

```typescript
// 14 subcategoryId
export enum CategoryIdEnum {
  BEAUXARTS = 'BEAUX_ARTS',
  CINEMA = 'CINEMA',
  CONFERENCE = 'CONFERENCE',
  FILM = 'FILM',
  INSTRUMENT = 'INSTRUMENT',
  JEU = 'JEU',
  LIVRE = 'LIVRE',
  MEDIA = 'MEDIA',
  MUSEE = 'MUSEE',
  MUSIQUEENREGISTREE = 'MUSIQUE_ENREGISTREE',
  MUSIQUELIVE = 'MUSIQUE_LIVE',
  PRATIQUEART = 'PRATIQUE_ART',
  SPECTACLE = 'SPECTACLE',
  TECHNIQUE = 'TECHNIQUE',
}
```

2. Do not fetch category from algolia/app search
3. Use Search group names for search, filters and favorites.

```typescript
// 12 categories
export enum CategoryNameEnum {
  CINEMA = 'CINEMA', // CINEMA
  CONFERENCE = 'CONFERENCE', // CONFERENCE
  INSTRUMENT = 'INSTRUMENT', // INSTRUMENT
  JEUXVIDEO = 'JEUX_VIDEO', // JEU
  FILM = 'FILM', // FILM
  LECON = 'LECON', // COURS
  LIVRE = 'LIVRE', // LIVRE
  MUSIQUE = 'MUSIQUE', // MUSIQUE
  PRESSE = 'PRESSE', // PRESSE
  SPECTACLE = 'SPECTACLE', // SPECTACLE
  VISITE = 'VISITE', // VISITE
  MATERIELARTCREA = 'MATERIEL_ART_CREA', // MATERIEL
}

// 12 + 1 search groups
export enum SearchGroupNameEnum {
  FILM = 'FILM',
  CINEMA = 'CINEMA',
  CONFERENCE = 'CONFERENCE',
  JEU = 'JEU',
  LIVRE = 'LIVRE',
  VISITE = 'VISITE',
  MUSIQUE = 'MUSIQUE',
  COURS = 'COURS',
  PRESSE = 'PRESSE',
  SPECTACLE = 'SPECTACLE',
  INSTRUMENT = 'INSTRUMENT',
  MATERIEL = 'MATERIEL',
  NONE = 'NONE',
}

const LABEL_MAPPING = {
  [SearchGroupNameEnum.CINEMA]: 'Cinéma',
  [SearchGroupNameEnum.FILM]: 'Films, séries',
  [SearchGroupNameEnum.CONFERENCE]: 'Conférences, rencontres',
  [SearchGroupNameEnum.JEU]: 'Jeux',
  [SearchGroupNameEnum.LIVRE]: 'Livre',
  [SearchGroupNameEnum.VISITE]: 'Visite, exposition',
  [SearchGroupNameEnum.MUSIQUE]: 'Musique',
  [SearchGroupNameEnum.COURS]: 'Cours, ateliers',
  [SearchGroupNameEnum.PRESSE]: 'Presse, médias',
  [SearchGroupNameEnum.SPECTACLE]: 'Spectacles',
  [SearchGroupNameEnum.INSTRUMENT]: 'Instruments de musique',
  [SearchGroupNameEnum.MATERIEL]: 'Beaux-Arts',
  [SearchGroupNameEnum.NONE]: null,
}
```
