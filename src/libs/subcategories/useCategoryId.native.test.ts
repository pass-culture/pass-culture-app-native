import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { useCategoryId } from 'libs/subcategories'

describe('useCategoryId', () => {
  it.each`
    subcategory                                         | category
    ${SubcategoryIdEnum.ABO_BIBLIOTHEQUE}               | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.ABO_CONCERT}                    | ${CategoryIdEnum.MUSIQUE_LIVE}
    ${SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE}            | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.ABO_LUDOTHEQUE}                 | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.ABO_MEDIATHEQUE}                | ${CategoryIdEnum.FILM}
    ${SubcategoryIdEnum.ABO_MUSEE}                      | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE}         | ${CategoryIdEnum.MUSIQUE_ENREGISTREE}
    ${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}           | ${CategoryIdEnum.FILM}
    ${SubcategoryIdEnum.ABO_PRATIQUE_ART}               | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.ABO_PRESSE_EN_LIGNE}            | ${CategoryIdEnum.MEDIA}
    ${SubcategoryIdEnum.ABO_SPECTACLE}                  | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.ACHAT_INSTRUMENT}               | ${CategoryIdEnum.INSTRUMENT}
    ${SubcategoryIdEnum.ACTIVATION_EVENT}               | ${CategoryIdEnum.TECHNIQUE}
    ${SubcategoryIdEnum.ACTIVATION_THING}               | ${CategoryIdEnum.TECHNIQUE}
    ${SubcategoryIdEnum.APP_CULTURELLE}                 | ${CategoryIdEnum.MEDIA}
    ${SubcategoryIdEnum.ATELIER_PRATIQUE_ART}           | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.AUTRE_SUPPORT_NUMERIQUE}        | ${CategoryIdEnum.FILM}
    ${SubcategoryIdEnum.BON_ACHAT_INSTRUMENT}           | ${CategoryIdEnum.INSTRUMENT}
    ${SubcategoryIdEnum.CAPTATION_MUSIQUE}              | ${CategoryIdEnum.MUSIQUE_ENREGISTREE}
    ${SubcategoryIdEnum.CARTE_CINE_ILLIMITE}            | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}        | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.CARTE_JEUNES}                   | ${CategoryIdEnum.CARTE_JEUNES}
    ${SubcategoryIdEnum.CARTE_MUSEE}                    | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.CINE_PLEIN_AIR}                 | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.CINE_VENTE_DISTANCE}            | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.CONCERT}                        | ${CategoryIdEnum.MUSIQUE_LIVE}
    ${SubcategoryIdEnum.CONCOURS}                       | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.CONFERENCE}                     | ${CategoryIdEnum.CONFERENCE}
    ${SubcategoryIdEnum.DECOUVERTE_METIERS}             | ${CategoryIdEnum.CONFERENCE}
    ${SubcategoryIdEnum.ESCAPE_GAME}                    | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.EVENEMENT_CINE}                 | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.EVENEMENT_JEU}                  | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.EVENEMENT_MUSIQUE}              | ${CategoryIdEnum.MUSIQUE_LIVE}
    ${SubcategoryIdEnum.EVENEMENT_PATRIMOINE}           | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.FESTIVAL_CINE}                  | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.FESTIVAL_LIVRE}                 | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.FESTIVAL_MUSIQUE}               | ${CategoryIdEnum.MUSIQUE_LIVE}
    ${SubcategoryIdEnum.FESTIVAL_SPECTACLE}             | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.JEU_EN_LIGNE}                   | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE}           | ${CategoryIdEnum.TECHNIQUE}
    ${SubcategoryIdEnum.LIVESTREAM_EVENEMENT}           | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.LIVESTREAM_MUSIQUE}             | ${CategoryIdEnum.MUSIQUE_LIVE}
    ${SubcategoryIdEnum.LIVESTREAM_PRATIQUE_ARTISTIQUE} | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE}           | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.LIVRE_NUMERIQUE}                | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.LIVRE_PAPIER}                   | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.LOCATION_INSTRUMENT}            | ${CategoryIdEnum.INSTRUMENT}
    ${SubcategoryIdEnum.MATERIEL_ART_CREATIF}           | ${CategoryIdEnum.BEAUX_ARTS}
    ${SubcategoryIdEnum.MUSEE_VENTE_DISTANCE}           | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.OEUVRE_ART}                     | ${CategoryIdEnum.TECHNIQUE}
    ${SubcategoryIdEnum.PARTITION}                      | ${CategoryIdEnum.INSTRUMENT}
    ${SubcategoryIdEnum.PLATEFORME_PRATIQUE_ARTISTIQUE} | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.PODCAST}                        | ${CategoryIdEnum.MEDIA}
    ${SubcategoryIdEnum.PRATIQUE_ART_VENTE_DISTANCE}    | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.RENCONTRE}                      | ${CategoryIdEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_EN_LIGNE}             | ${CategoryIdEnum.CONFERENCE}
    ${SubcategoryIdEnum.RENCONTRE_JEU}                  | ${CategoryIdEnum.JEU}
    ${SubcategoryIdEnum.SALON}                          | ${CategoryIdEnum.CONFERENCE}
    ${SubcategoryIdEnum.SEANCE_CINE}                    | ${CategoryIdEnum.CINEMA}
    ${SubcategoryIdEnum.SEANCE_ESSAI_PRATIQUE_ART}      | ${CategoryIdEnum.PRATIQUE_ART}
    ${SubcategoryIdEnum.SPECTACLE_ENREGISTRE}           | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.SPECTACLE_REPRESENTATION}       | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.SPECTACLE_VENTE_DISTANCE}       | ${CategoryIdEnum.SPECTACLE}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}          | ${CategoryIdEnum.FILM}
    ${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE}       | ${CategoryIdEnum.MUSIQUE_ENREGISTREE}
    ${SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO}     | ${CategoryIdEnum.LIVRE}
    ${SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE}         | ${CategoryIdEnum.MUSIQUE_ENREGISTREE}
    ${SubcategoryIdEnum.VISITE}                         | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.VISITE_GUIDEE}                  | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.VISITE_VIRTUELLE}               | ${CategoryIdEnum.MUSEE}
    ${SubcategoryIdEnum.VOD}                            | ${CategoryIdEnum.FILM}
  `('useCategoryId($subcategory) = $category', ({ subcategory, category }) => {
    expect(useCategoryId(subcategory)).toBe(category)
  })
})
