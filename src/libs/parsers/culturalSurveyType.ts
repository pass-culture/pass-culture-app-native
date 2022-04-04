import { CulturalSurveyAnswerEnum } from 'api/gen'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'
import { IconInterface } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
export const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyAnswerEnum]: React.FC<IconInterface> | null
} = {
  [CulturalSurveyAnswerEnum.BIBLIOTHEQUE]: CulturalSurveyIcons.MuseumIcon,
  [CulturalSurveyAnswerEnum.MUSEE]: CulturalSurveyIcons.MuseumIcon,
  [CulturalSurveyAnswerEnum.CINEMA]: CulturalSurveyIcons.CinemaIcon,
  [CulturalSurveyAnswerEnum.CONCERT]: CulturalSurveyIcons.MusicIcon,
  [CulturalSurveyAnswerEnum.COURS]: CulturalSurveyIcons.BrushIcon,
  [CulturalSurveyAnswerEnum.CONFERENCE]: CulturalSurveyIcons.ConferenceIcon,
  [CulturalSurveyAnswerEnum.EVENEMENT_JEU]: CulturalSurveyIcons.VideoGameIcon,
  [CulturalSurveyAnswerEnum.FILM_DOMICILE]: CulturalSurveyIcons.VideoIcon,
  [CulturalSurveyAnswerEnum.MATERIEL_ART_CREATIF]: CulturalSurveyIcons.PencilTipIcon,
  [CulturalSurveyAnswerEnum.PODCAST]: CulturalSurveyIcons.MicrophoneIcon,
  [CulturalSurveyAnswerEnum.LIVRE]: CulturalSurveyIcons.BookIcon,
  [CulturalSurveyAnswerEnum.JOUE_INSTRUMENT]: CulturalSurveyIcons.PianoIcon,
  [CulturalSurveyAnswerEnum.JEU_VIDEO]: CulturalSurveyIcons.VideoGameIcon,
  [CulturalSurveyAnswerEnum.PRESSE_EN_LIGNE]: CulturalSurveyIcons.PressIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_AUTRE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_CINEMA]: CulturalSurveyIcons.CinemaIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_MUSIQUE]: CulturalSurveyIcons.MusicIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_AVANT_PREMIERE]: CulturalSurveyIcons.VideoIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_LIVRE]: CulturalSurveyIcons.BookIcon,
  [CulturalSurveyAnswerEnum.FESTIVAL_SPECTACLE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_AUTRE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_CIRQUE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_DANSE]: CulturalSurveyIcons.DanceFeetIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_HUMOUR]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_OPERA]: CulturalSurveyIcons.OperaIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_RUE]: CulturalSurveyIcons.ReversedHatIcon,
  [CulturalSurveyAnswerEnum.SPECTACLE_THEATRE]: CulturalSurveyIcons.TheaterIcon,
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
