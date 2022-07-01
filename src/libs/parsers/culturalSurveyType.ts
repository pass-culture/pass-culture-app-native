import { CulturalSurveyAnswerEnum } from 'api/gen'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'
import { IconInterface } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
export const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyAnswerEnum]: React.FC<IconInterface> | null
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
  [CulturalSurveyAnswerEnum.SANS_ACTIVITES]: null,
  [CulturalSurveyAnswerEnum.SANS_SORTIES]: null,
}

export const mapCulturalSurveyTypeToIcon = (
  types: CulturalSurveyAnswerEnum
): React.FC<IconInterface> | null => {
  if (types && types in MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON)
    return MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON[types]
  return culturalSurveyIcons.Festival
}
