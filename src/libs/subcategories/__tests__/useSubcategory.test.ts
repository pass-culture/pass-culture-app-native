import { renderHook } from '@testing-library/react-hooks'

import { SubcategoryIdEnum, CategoryIdEnum, SearchGroupNameEnum } from 'api/gen'
import { useSubcategory } from 'libs/subcategories'

describe('useSubcategory', () => {
  it.each`
    subcategory                                         | isEvent  | categoryId                            | searchGroupName
    ${SubcategoryIdEnum.ABO_BIBLIOTHEQUE}               | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.ABO_CONCERT}                    | ${false} | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE}            | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.ABO_LUDOTHEQUE}                 | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.ABO_MEDIATHEQUE}                | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.ABO_MUSEE}                      | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}           | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.ABO_PRATIQUE_ART}               | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.ABO_PRESSE_EN_LIGNE}            | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.MEDIA_PRESSE}
    ${SubcategoryIdEnum.ABO_SPECTACLE}                  | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.ACHAT_INSTRUMENT}               | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.ACTIVATION_EVENT}               | ${true}  | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.ACTIVATION_THING}               | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.APP_CULTURELLE}                 | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.MEDIA_PRESSE}
    ${SubcategoryIdEnum.ATELIER_PRATIQUE_ART}           | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.AUTRE_SUPPORT_NUMERIQUE}        | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.BON_ACHAT_INSTRUMENT}           | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.CAPTATION_MUSIQUE}              | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.CARTE_CINE_ILLIMITE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}        | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CARTE_JEUNES}                   | ${false} | ${CategoryIdEnum.CARTE_JEUNES}        | ${SearchGroupNameEnum.CARTES_JEUNES}
    ${SubcategoryIdEnum.CARTE_MUSEE}                    | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.CINE_PLEIN_AIR}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CINE_VENTE_DISTANCE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.CONCERT}                        | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.CONCOURS}                       | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.CONFERENCE}                     | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.DECOUVERTE_METIERS}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.ESCAPE_GAME}                    | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.EVENEMENT_CINE}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.EVENEMENT_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.EVENEMENT_MUSIQUE}              | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.EVENEMENT_PATRIMOINE}           | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.FESTIVAL_CINE}                  | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.FESTIVAL_LIVRE}                 | ${true}  | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.FESTIVAL_MUSIQUE}               | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.FESTIVAL_SPECTACLE}             | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.JEU_EN_LIGNE}                   | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE}           | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.LIVESTREAM_EVENEMENT}           | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.LIVESTREAM_MUSIQUE}             | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.LIVESTREAM_PRATIQUE_ARTISTIQUE} | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE}           | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.LIVRE_NUMERIQUE}                | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.LIVRE_PAPIER}                   | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.LOCATION_INSTRUMENT}            | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.MATERIEL_ART_CREATIF}           | ${false} | ${CategoryIdEnum.BEAUX_ARTS}          | ${SearchGroupNameEnum.MATERIEL}
    ${SubcategoryIdEnum.MUSEE_VENTE_DISTANCE}           | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.OEUVRE_ART}                     | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.PARTITION}                      | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.PLATEFORME_PRATIQUE_ARTISTIQUE} | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.PODCAST}                        | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.MEDIA_PRESSE}
    ${SubcategoryIdEnum.PRATIQUE_ART_VENTE_DISTANCE}    | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.RENCONTRE}                      | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_EN_LIGNE}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEUX_JEUX_VIDEOS}
    ${SubcategoryIdEnum.SALON}                          | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.SEANCE_CINE}                    | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.SEANCE_ESSAI_PRATIQUE_ART}      | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}
    ${SubcategoryIdEnum.SPECTACLE_ENREGISTRE}           | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.SPECTACLE_REPRESENTATION}       | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.SPECTACLE_VENTE_DISTANCE}       | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.CONCERTS_FESTIVALS}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}          | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE}       | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO}     | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRES}
    ${SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE}
    ${SubcategoryIdEnum.VISITE}                         | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VISITE_GUIDEE}                  | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VISITE_VIRTUELLE}               | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES}
    ${SubcategoryIdEnum.VOD}                            | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}
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
