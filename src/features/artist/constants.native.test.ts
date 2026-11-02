import { SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'
import { ARTIST_CATEGORY_LABELS, ARTIST_CATEGORY_PLAYLISTS } from 'features/artist/constants'

describe('artist category playlists constants', () => {
  it('should expose playlists in display order', () => {
    expect(ARTIST_CATEGORY_PLAYLISTS.map(({ searchGroupName }) => searchGroupName)).toEqual([
      SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      SearchGroupNameEnumv2.SPECTACLES,
      SearchGroupNameEnumv2.LIVRES,
      SearchGroupNameEnumv2.LIVRES,
      SearchGroupNameEnumv2.MUSIQUE,
      SearchGroupNameEnumv2.CINEMA,
      SearchGroupNameEnumv2.CINEMA,
      SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      SearchGroupNameEnumv2.MEDIA_PRESSE,
    ])
  })

  it('should expose playlist labels by search group', () => {
    expect(ARTIST_CATEGORY_LABELS).toEqual({
      [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: ['Prochains concerts et festivals'],
      [SearchGroupNameEnumv2.SPECTACLES]: ['Prochains spectacles'],
      [SearchGroupNameEnumv2.LIVRES]: ['Livres', 'Prochains festivals et salons du livre'],
      [SearchGroupNameEnumv2.MUSIQUE]: ['Musique'],
      [SearchGroupNameEnumv2.CINEMA]: ['Films à l’affiche', 'Prochains évènements de cinéma'],
      [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: ['Films, séries et documentaires'],
      [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: ['Arts et loisirs créatifs'],
      [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: [
        'Musées et visites',
        'Prochains évènements culturels',
      ],
      [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: ['Prochaines conférences et rencontres'],
      [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: ['Prochains évènements en ligne'],
      [SearchGroupNameEnumv2.MEDIA_PRESSE]: ['Médias et presse'],
      [SearchGroupNameEnumv2.NONE]: ['Offres disponibles'],
    })
  })

  it('should not expose excluded categories and subcategories in artist playlists', () => {
    expect(ARTIST_CATEGORY_LABELS).not.toHaveProperty(SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS)
    expect(ARTIST_CATEGORY_LABELS).not.toHaveProperty(SearchGroupNameEnumv2.CARTES_JEUNES)

    const includedSubcategoryIds = ARTIST_CATEGORY_PLAYLISTS.flatMap(
      ({ includedSubcategoryIds }) => includedSubcategoryIds
    )

    expect(includedSubcategoryIds).not.toContain(SubcategoryIdEnumv2.ABO_CONCERT)
    expect(includedSubcategoryIds).not.toContain(SubcategoryIdEnumv2.SPECTACLE_VENTE_DISTANCE)
    expect(includedSubcategoryIds).not.toContain(SubcategoryIdEnumv2.ACTIVATION_EVENT)
    expect(includedSubcategoryIds).not.toContain(SubcategoryIdEnumv2.CARTE_JEUNES)
  })
})
