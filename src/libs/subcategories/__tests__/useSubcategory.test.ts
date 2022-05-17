import { renderHook } from '@testing-library/react-hooks'

import { SubcategoryIdEnum, CategoryIdEnum, SearchGroupNameEnum } from 'api/gen'
import { useSubcategory } from 'libs/subcategories'

describe('useSubcategory', () => {
  it.each`
    subcategory                                         | isEvent  | categoryId                            | searchGroupName
    ${SubcategoryIdEnum.ABO_BIBLIOTHEQUE}               | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.ABO_CONCERT}                    | ${false} | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE}            | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.ABO_LUDOTHEQUE}                 | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.ABO_MEDIATHEQUE}                | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILM}
    ${SubcategoryIdEnum.ABO_MUSEE}                      | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}           | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILM}
    ${SubcategoryIdEnum.ABO_PRATIQUE_ART}               | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.ABO_PRESSE_EN_LIGNE}            | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.PRESSE}
    ${SubcategoryIdEnum.ABO_SPECTACLE}                  | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.ACHAT_INSTRUMENT}               | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.ACTIVATION_EVENT}               | ${true}  | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.ACTIVATION_THING}               | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.APP_CULTURELLE}                 | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.PRESSE}
    ${SubcategoryIdEnum.ATELIER_PRATIQUE_ART}           | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.AUTRE_SUPPORT_NUMERIQUE}        | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILM}
    ${SubcategoryIdEnum.BON_ACHAT_INSTRUMENT}           | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.CAPTATION_MUSIQUE}              | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.CARTE_CINE_ILLIMITE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}        | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.CARTE_JEUNES}                   | ${false} | ${CategoryIdEnum.CARTE_JEUNES}        | ${SearchGroupNameEnum.CARTE_JEUNES}
    ${SubcategoryIdEnum.CARTE_MUSEE}                    | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.CINE_PLEIN_AIR}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.CINE_VENTE_DISTANCE}            | ${false} | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.CONCERT}                        | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.CONCOURS}                       | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.CONFERENCE}                     | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.DECOUVERTE_METIERS}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.ESCAPE_GAME}                    | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.EVENEMENT_CINE}                 | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.EVENEMENT_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.EVENEMENT_MUSIQUE}              | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.EVENEMENT_PATRIMOINE}           | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.FESTIVAL_CINE}                  | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.FESTIVAL_LIVRE}                 | ${true}  | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.FESTIVAL_MUSIQUE}               | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.FESTIVAL_SPECTACLE}             | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.JEU_EN_LIGNE}                   | ${false} | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE}           | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.LIVESTREAM_EVENEMENT}           | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.LIVESTREAM_MUSIQUE}             | ${true}  | ${CategoryIdEnum.MUSIQUE_LIVE}        | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.LIVESTREAM_PRATIQUE_ARTISTIQUE} | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE}           | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.LIVRE_NUMERIQUE}                | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.LIVRE_PAPIER}                   | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.LOCATION_INSTRUMENT}            | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.MATERIEL_ART_CREATIF}           | ${false} | ${CategoryIdEnum.BEAUX_ARTS}          | ${SearchGroupNameEnum.MATERIEL}
    ${SubcategoryIdEnum.MUSEE_VENTE_DISTANCE}           | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.OEUVRE_ART}                     | ${false} | ${CategoryIdEnum.TECHNIQUE}           | ${SearchGroupNameEnum.NONE}
    ${SubcategoryIdEnum.PARTITION}                      | ${false} | ${CategoryIdEnum.INSTRUMENT}          | ${SearchGroupNameEnum.INSTRUMENT}
    ${SubcategoryIdEnum.PLATEFORME_PRATIQUE_ARTISTIQUE} | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.PODCAST}                        | ${false} | ${CategoryIdEnum.MEDIA}               | ${SearchGroupNameEnum.PRESSE}
    ${SubcategoryIdEnum.PRATIQUE_ART_VENTE_DISTANCE}    | ${false} | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.RENCONTRE}                      | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_EN_LIGNE}             | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_JEU}                  | ${true}  | ${CategoryIdEnum.JEU}                 | ${SearchGroupNameEnum.JEU}
    ${SubcategoryIdEnum.SALON}                          | ${true}  | ${CategoryIdEnum.CONFERENCE}          | ${SearchGroupNameEnum.CONFERENCE}
    ${SubcategoryIdEnum.SEANCE_CINE}                    | ${true}  | ${CategoryIdEnum.CINEMA}              | ${SearchGroupNameEnum.CINEMA}
    ${SubcategoryIdEnum.SEANCE_ESSAI_PRATIQUE_ART}      | ${true}  | ${CategoryIdEnum.PRATIQUE_ART}        | ${SearchGroupNameEnum.COURS}
    ${SubcategoryIdEnum.SPECTACLE_ENREGISTRE}           | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.SPECTACLE_REPRESENTATION}       | ${true}  | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.SPECTACLE_VENTE_DISTANCE}       | ${false} | ${CategoryIdEnum.SPECTACLE}           | ${SearchGroupNameEnum.SPECTACLE}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}          | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILM}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE}       | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO}     | ${false} | ${CategoryIdEnum.LIVRE}               | ${SearchGroupNameEnum.LIVRE}
    ${SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE}         | ${false} | ${CategoryIdEnum.MUSIQUE_ENREGISTREE} | ${SearchGroupNameEnum.MUSIQUE}
    ${SubcategoryIdEnum.VISITE}                         | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.VISITE_GUIDEE}                  | ${true}  | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.VISITE_VIRTUELLE}               | ${false} | ${CategoryIdEnum.MUSEE}               | ${SearchGroupNameEnum.VISITE}
    ${SubcategoryIdEnum.VOD}                            | ${false} | ${CategoryIdEnum.FILM}                | ${SearchGroupNameEnum.FILM}
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
