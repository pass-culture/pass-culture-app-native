import { CulturalSurveyAnswerEnum } from 'api/gen'
import { culturalSurveyIcons } from 'ui/svg/icons/exports/culturalSurveyIcons'
import { AccessibleIcon } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyAnswerEnum]: React.FC<AccessibleIcon>
} = {
  [CulturalSurveyAnswerEnum.BIBLIOTHEQUE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.CLASSIQUE]: culturalSurveyIcons.Piano,
  [CulturalSurveyAnswerEnum.CONCERT]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.CONFERENCE]: culturalSurveyIcons.Micro,
  [CulturalSurveyAnswerEnum.COURS]: culturalSurveyIcons.Brush,
  [CulturalSurveyAnswerEnum.CULTURE]: culturalSurveyIcons.Palette,
  [CulturalSurveyAnswerEnum.ELECTRO]: culturalSurveyIcons.Electro,
  [CulturalSurveyAnswerEnum.EVENEMENT_JEU]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.FANTASY]: culturalSurveyIcons.Fantasy,
  [CulturalSurveyAnswerEnum.FESTIVAL_AUTRE]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.FESTIVAL_AVANT_PREMIERE]: culturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.FESTIVAL_CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.FESTIVAL_LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.FESTIVAL_MUSIQUE]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.FESTIVAL_SPECTACLE]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.FESTIVAL]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.FILM_DOMICILE]: culturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.FILMS]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.HISTOIRE]: culturalSurveyIcons.Earth,
  [CulturalSurveyAnswerEnum.JAZZ]: culturalSurveyIcons.Jazz,
  [CulturalSurveyAnswerEnum.JEU_VIDEO]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.JOUE_INSTRUMENT]: culturalSurveyIcons.Piano,
  [CulturalSurveyAnswerEnum.LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.LIVRES_AUCUN]: culturalSurveyIcons.None,
  [CulturalSurveyAnswerEnum.MANGAS]: culturalSurveyIcons.Comics,
  [CulturalSurveyAnswerEnum.MATERIEL_ART_CREATIF]: culturalSurveyIcons.PencilTip,
  [CulturalSurveyAnswerEnum.METAL]: culturalSurveyIcons.Rock,
  [CulturalSurveyAnswerEnum.MUSEE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.MUSIQUES_AUCUN]: culturalSurveyIcons.None,
  [CulturalSurveyAnswerEnum.PHILOSOPHIE]: culturalSurveyIcons.Philosophy,
  [CulturalSurveyAnswerEnum.PODCAST]: culturalSurveyIcons.Microphone,
  [CulturalSurveyAnswerEnum.POP]: culturalSurveyIcons.Turntable,
  [CulturalSurveyAnswerEnum.PRESSE_EN_LIGNE]: culturalSurveyIcons.Press,
  [CulturalSurveyAnswerEnum.PROJECTION_ACTIVITE_ARTISTIQUE]: culturalSurveyIcons.Brush,
  [CulturalSurveyAnswerEnum.PROJECTION_AUTRE]: culturalSurveyIcons.None,
  [CulturalSurveyAnswerEnum.PROJECTION_CD_VINYLE]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.PROJECTION_CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.PROJECTION_CONCERT]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.PROJECTION_CONFERENCE]: culturalSurveyIcons.Micro,
  [CulturalSurveyAnswerEnum.PROJECTION_FESTIVAL]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.PROJECTION_JEU]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.PROJECTION_LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.PROJECTION_SPECTACLE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.PROJECTION_VISITE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.RAP]: culturalSurveyIcons.Rap,
  [CulturalSurveyAnswerEnum.ROMANCE]: culturalSurveyIcons.Romance,
  [CulturalSurveyAnswerEnum.ROMANS]: culturalSurveyIcons.Litterature,
  [CulturalSurveyAnswerEnum.SANS_ACTIVITES]: culturalSurveyIcons.None,
  [CulturalSurveyAnswerEnum.SANS_SORTIES]: culturalSurveyIcons.None,
  [CulturalSurveyAnswerEnum.SOCIETE]: culturalSurveyIcons.Press,
  [CulturalSurveyAnswerEnum.SPECTACLE_AUTRE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_CIRQUE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_DANSE]: culturalSurveyIcons.DanceFeet,
  [CulturalSurveyAnswerEnum.SPECTACLE_HUMOUR]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.SPECTACLE_OPERA]: culturalSurveyIcons.Opera,
  [CulturalSurveyAnswerEnum.SPECTACLE_RUE]: culturalSurveyIcons.Accordion,
  [CulturalSurveyAnswerEnum.SPECTACLE_THEATRE]: culturalSurveyIcons.Theater,
  [CulturalSurveyAnswerEnum.SPECTACLE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.THRILLER]: culturalSurveyIcons.Detective,
}

export const mapCulturalSurveyTypeToIcon = (
  types: CulturalSurveyAnswerEnum
): React.FC<AccessibleIcon> => {
  if (types && types in MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON)
    return MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON[types]
  return culturalSurveyIcons.All
}
