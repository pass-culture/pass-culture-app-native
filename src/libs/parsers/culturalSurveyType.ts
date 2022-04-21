import { CulturalSurveyAnswerEnum } from 'api/gen'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'
import { IconInterface } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
export const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyAnswerEnum]: React.FC<IconInterface> | null
} = {
  [CulturalSurveyAnswerEnum.BIBLIOTHEQUE]: CulturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.MUSEE]: CulturalSurveyIcons.Museum,
  [CulturalSurveyAnswerEnum.CINEMA]: CulturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.CONCERT]: CulturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.COURS]: CulturalSurveyIcons.Brush,
  [CulturalSurveyAnswerEnum.CONFERENCE]: CulturalSurveyIcons.Conference,
  [CulturalSurveyAnswerEnum.EVENEMENT_JEU]: CulturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.FILM_DOMICILE]: CulturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.MATERIEL_ART_CREATIF]: CulturalSurveyIcons.PencilTip,
  [CulturalSurveyAnswerEnum.PODCAST]: CulturalSurveyIcons.Microphone,
  [CulturalSurveyAnswerEnum.LIVRE]: CulturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.JOUE_INSTRUMENT]: CulturalSurveyIcons.Piano,
  [CulturalSurveyAnswerEnum.JEU_VIDEO]: CulturalSurveyIcons.VideoGame,
  [CulturalSurveyAnswerEnum.PRESSE_EN_LIGNE]: CulturalSurveyIcons.Press,
  [CulturalSurveyAnswerEnum.FESTIVAL]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_AUTRE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_CINEMA]: CulturalSurveyIcons.Cinema,
  [CulturalSurveyAnswerEnum.FESTIVAL_MUSIQUE]: CulturalSurveyIcons.Music,
  [CulturalSurveyAnswerEnum.FESTIVAL_AVANT_PREMIERE]: CulturalSurveyIcons.Video,
  [CulturalSurveyAnswerEnum.FESTIVAL_LIVRE]: CulturalSurveyIcons.Book,
  [CulturalSurveyAnswerEnum.FESTIVAL_SPECTACLE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE]: CulturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_AUTRE]: CulturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_CIRQUE]: CulturalSurveyIcons.Show,
  [CulturalSurveyAnswerEnum.SPECTACLE_DANSE]: CulturalSurveyIcons.DanceFeet,
  [CulturalSurveyAnswerEnum.SPECTACLE_HUMOUR]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_OPERA]: CulturalSurveyIcons.Opera,
  [CulturalSurveyAnswerEnum.SPECTACLE_RUE]: CulturalSurveyIcons.ReversedHat,
  [CulturalSurveyAnswerEnum.SPECTACLE_THEATRE]: CulturalSurveyIcons.Theater,
  [CulturalSurveyAnswerEnum.SANS_ACTIVITES]: null,
  [CulturalSurveyAnswerEnum.SANS_SORTIES]: null,
}

export const mapCulturalSurveyTypeToIcon = (
  types: CulturalSurveyAnswerEnum
): React.FC<IconInterface> | null => {
  if (types && types in MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON)
    return MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON[types]
  return CulturalSurveyIcons.FestivalIcon
}
