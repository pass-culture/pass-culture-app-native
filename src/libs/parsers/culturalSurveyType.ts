import { CulturalSurveyAnswerEnum } from 'api/gen'
import { culturalSurveyIcons } from 'ui/svg/icons/exports/culturalSurveyIcons'
import { AccessibleIcon } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyAnswerEnum]: React.FC<AccessibleIcon>
} = {
  [CulturalSurveyAnswerEnum.BIBLIOTHEQUE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.MUSEE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.CONCERT]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.COURS]: culturalSurveyIcons.Brush,
  [CulturalSurveyAnswerEnum.CONFERENCE]: culturalSurveyIcons.Micro,
  [CulturalSurveyAnswerEnum.EVENEMENT_JEU]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.FILM_DOMICILE]: culturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.MATERIEL_ART_CREATIF]: culturalSurveyIcons.PencilTip,
  [CulturalSurveyAnswerEnum.PODCAST]: culturalSurveyIcons.Microphone,
  [CulturalSurveyAnswerEnum.LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.JOUE_INSTRUMENT]: culturalSurveyIcons.Piano,
  [CulturalSurveyAnswerEnum.JEU_VIDEO]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.PRESSE_EN_LIGNE]: culturalSurveyIcons.Press,
  [CulturalSurveyAnswerEnum.FESTIVAL]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.FESTIVAL_AUTRE]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.FESTIVAL_CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.FESTIVAL_MUSIQUE]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.FESTIVAL_AVANT_PREMIERE]: culturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.FESTIVAL_LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.FESTIVAL_SPECTACLE]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.SPECTACLE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_AUTRE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_CIRQUE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_DANSE]: culturalSurveyIcons.DanceFeet,
  [CulturalSurveyAnswerEnum.SPECTACLE_HUMOUR]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.SPECTACLE_OPERA]: culturalSurveyIcons.Opera,
  [CulturalSurveyAnswerEnum.SPECTACLE_RUE]: culturalSurveyIcons.Accordion,
  [CulturalSurveyAnswerEnum.SPECTACLE_THEATRE]: culturalSurveyIcons.Theater,
  [CulturalSurveyAnswerEnum.SANS_ACTIVITES]: culturalSurveyIcons.All,
  [CulturalSurveyAnswerEnum.SANS_SORTIES]: culturalSurveyIcons.All,
  [CulturalSurveyAnswerEnum.PROJECTION_FESTIVAL]: culturalSurveyIcons.Festival,
  [CulturalSurveyAnswerEnum.PROJECTION_CINEMA]: culturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.PROJECTION_VISITE]: culturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.PROJECTION_CONCERT]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.PROJECTION_CD_VINYLE]: culturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.PROJECTION_SPECTACLE]: culturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.PROJECTION_ACTIVITE_ARTISTIQUE]: culturalSurveyIcons.Brush,
  [CulturalSurveyAnswerEnum.PROJECTION_LIVRE]: culturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.PROJECTION_CONFERENCE]: culturalSurveyIcons.Micro,
  [CulturalSurveyAnswerEnum.PROJECTION_JEU]: culturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.PROJECTION_AUTRE]: culturalSurveyIcons.All,
}

export const mapCulturalSurveyTypeToIcon = (
  types: CulturalSurveyAnswerEnum
): React.FC<AccessibleIcon> => {
  if (types && types in MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON)
    return MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON[types]
  return culturalSurveyIcons.All
}
