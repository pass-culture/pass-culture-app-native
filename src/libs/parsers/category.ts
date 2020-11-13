// Map the facetFilter (in algolia) to the label displayed in the front
const MAP_CATEGORY_TO_LABEL: { [k: string]: string } = {
  CINEMA: 'Cinéma',
  VISITE: 'Visite, exposition',
  MUSIQUE: 'Musique',
  SPECTACLE: 'Spectacle',
  LECON: 'Cours, atelier',
  LIVRE: 'Livre',
  FILM: 'Film, série, podcast',
  PRESSE: 'Presse',
  JEUX_VIDEO: 'Jeu vidéo',
  CONFERENCE: 'Conférence, rencontre',
  INSTRUMENT: 'Instrument',
}

export const parseCategory = (category: string | null, label?: string): string => {
  if (category && category in MAP_CATEGORY_TO_LABEL) return MAP_CATEGORY_TO_LABEL[category]
  return label || ''
}
