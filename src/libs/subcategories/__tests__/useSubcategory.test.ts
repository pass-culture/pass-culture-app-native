import { SubcategoryIdEnum, CategoryIdEnum, SearchGroupNameEnumv2 } from 'api/gen'
import { useSubcategory } from 'libs/subcategories'
import { renderHook } from 'tests/utils'

describe('useSubcategory', () => {
  it.each`
    subcategory                                         | isEvent  | categoryId                            | searchGroupName
    ${SubcategoryIdEnum.ABO_BIBLIOTHEQUE}               | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE}
    ${SubcategoryIdEnum.ABO_CONCERT}                    | ${false} | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE}            | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.LIVRES}
    ${SubcategoryIdEnum.ABO_LUDOTHEQUE}                 | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.ABO_MEDIATHEQUE}                | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE}
    ${SubcategoryIdEnum.ABO_MUSEE}                      | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}           | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.ABO_PRATIQUE_ART}               | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.ABO_PRESSE_EN_LIGNE}            | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnumv2.MEDIA_PRESSE}
    ${SubcategoryIdEnum.ABO_SPECTACLE}                  | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.SPECTACLES}
    ${SubcategoryIdEnum.ACHAT_INSTRUMENT}               | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnumv2.INSTRUMENTS}
    ${SubcategoryIdEnum.ACTIVATION_EVENT}               | ${true}  | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnumv2.NONE}
    ${SubcategoryIdEnum.ACTIVATION_THING}               | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnumv2.NONE}
    ${SubcategoryIdEnum.APP_CULTURELLE}                 | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnumv2.MEDIA_PRESSE}
    ${SubcategoryIdEnum.ATELIER_PRATIQUE_ART}           | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.AUTRE_SUPPORT_NUMERIQUE}        | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.BON_ACHAT_INSTRUMENT}           | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnumv2.INSTRUMENTS}
    ${SubcategoryIdEnum.CAPTATION_MUSIQUE}              | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.CARTE_CINE_ILLIMITE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}        | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CARTE_JEUNES}                   | ${false} | ${CategoryIdEnum.CARTE_JEUNES}        | ${SearchGroupNameEnumv2.CARTES_JEUNES}
    ${SubcategoryIdEnum.CARTE_MUSEE}                    | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.CINE_PLEIN_AIR}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CINE_VENTE_DISTANCE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CONCERT}                        | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.CONCOURS}                       | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.CONFERENCE}                     | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
    ${SubcategoryIdEnum.DECOUVERTE_METIERS}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
    ${SubcategoryIdEnum.ESCAPE_GAME}                    | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.EVENEMENT_CINE}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.EVENEMENT_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.EVENEMENT_MUSIQUE}              | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.EVENEMENT_PATRIMOINE}           | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.FESTIVAL_ART_VISUEL}            | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.FESTIVAL_CINE}                  | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.FESTIVAL_LIVRE}                 | ${true}  | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.LIVRES}
    ${SubcategoryIdEnum.FESTIVAL_MUSIQUE}               | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.FESTIVAL_SPECTACLE}             | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.SPECTACLES}
    ${SubcategoryIdEnum.JEU_EN_LIGNE}                   | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE}           | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnumv2.NONE}
    ${SubcategoryIdEnum.LIVESTREAM_EVENEMENT}           | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE}
    ${SubcategoryIdEnum.LIVESTREAM_MUSIQUE}             | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE}
    ${SubcategoryIdEnum.LIVESTREAM_PRATIQUE_ARTISTIQUE} | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE}
    ${SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE}           | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.LIVRES}
    ${SubcategoryIdEnum.LIVRE_NUMERIQUE}                | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.LIVRES}
    ${SubcategoryIdEnum.LIVRE_PAPIER}                   | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.LIVRES}
    ${SubcategoryIdEnum.LOCATION_INSTRUMENT}            | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnumv2.INSTRUMENTS}
    ${SubcategoryIdEnum.MATERIEL_ART_CREATIF}           | ${false} | ${CategoryIdEnum.BEAUX_ARTS}          | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.MUSEE_VENTE_DISTANCE}           | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.OEUVRE_ART}                     | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.PARTITION}                      | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnumv2.INSTRUMENTS}
    ${SubcategoryIdEnum.PLATEFORME_PRATIQUE_ARTISTIQUE} | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.PODCAST}                        | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnumv2.MEDIA_PRESSE}
    ${SubcategoryIdEnum.PRATIQUE_ART_VENTE_DISTANCE}    | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.RENCONTRE}                      | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
    ${SubcategoryIdEnum.RENCONTRE_EN_LIGNE}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
    ${SubcategoryIdEnum.RENCONTRE_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.SALON}                          | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
    ${SubcategoryIdEnum.SEANCE_CINE}                    | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.SEANCE_ESSAI_PRATIQUE_ART}      | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.SPECTACLE_ENREGISTRE}           | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.SPECTACLES}
    ${SubcategoryIdEnum.SPECTACLE_REPRESENTATION}       | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.SPECTACLES}
    ${SubcategoryIdEnum.SPECTACLE_VENTE_DISTANCE}       | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnumv2.SPECTACLES}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}          | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE}       | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO}     | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE}
    ${SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.VISITE}                         | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VISITE_GUIDEE}                  | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VISITE_VIRTUELLE}               | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VOD}                            | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}
  `(
    'useSubcategory($subcategory) = { isEvent: $isEvent, categoryId: $categoryId, searchGroupName: $searchGroupName }',
    ({ subcategory, isEvent, categoryId, searchGroupName }) => {
      const { result } = renderHook(() => useSubcategory(subcategory))
      expect(result.current.isEvent).toBe(isEvent)
      expect(result.current.categoryId).toBe(categoryId)
      expect(result.current.searchGroupName).toBe(searchGroupName)
    }
  )
})
