import { CulturalSurveyTypeCodeKey } from 'api/gen'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'
import { IconInterface } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the category Icon
export const MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON: {
  [k in CulturalSurveyTypeCodeKey]: React.FC<IconInterface> | null
} = {
  [CulturalSurveyTypeCodeKey.BIBLIOTHEQUE]: CulturalSurveyIcons.MuseumIcon,
  [CulturalSurveyTypeCodeKey.MUSEE]: CulturalSurveyIcons.MuseumIcon,
  [CulturalSurveyTypeCodeKey.CINEMA]: CulturalSurveyIcons.CinemaIcon,
  [CulturalSurveyTypeCodeKey.CONCERT]: CulturalSurveyIcons.MusicIcon,
  [CulturalSurveyTypeCodeKey.COURS]: CulturalSurveyIcons.BrushIcon,
  [CulturalSurveyTypeCodeKey.CONFERENCE]: CulturalSurveyIcons.ConferenceIcon,
  [CulturalSurveyTypeCodeKey.EVENEMENT_JEU]: CulturalSurveyIcons.VideoGameIcon,
  [CulturalSurveyTypeCodeKey.FILM_DOMICILE]: CulturalSurveyIcons.VideoIcon,
  [CulturalSurveyTypeCodeKey.MATERIEL_ART_CREATIF]: CulturalSurveyIcons.PencilTipIcon,
  [CulturalSurveyTypeCodeKey.PODCAST]: CulturalSurveyIcons.MicrophoneIcon,
  [CulturalSurveyTypeCodeKey.LIVRE]: CulturalSurveyIcons.BookIcon,
  [CulturalSurveyTypeCodeKey.JOUE_INSTRUMENT]: CulturalSurveyIcons.PianoIcon,
  [CulturalSurveyTypeCodeKey.JEU_VIDEO]: CulturalSurveyIcons.VideoGameIcon,
  [CulturalSurveyTypeCodeKey.PRESSE_EN_LIGNE]: CulturalSurveyIcons.PressIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_AUTRE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_CINEMA]: CulturalSurveyIcons.CinemaIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_MUSIQUE]: CulturalSurveyIcons.MusicIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_AVANT_PREMIERE]: CulturalSurveyIcons.VideoIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_LIVRE]: CulturalSurveyIcons.BookIcon,
  [CulturalSurveyTypeCodeKey.FESTIVAL_SPECTACLE]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_AUTRE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_CIRQUE]: CulturalSurveyIcons.ShowIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_DANSE]: CulturalSurveyIcons.DanceFeetIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_HUMOUR]: CulturalSurveyIcons.FestivalIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_OPERA]: CulturalSurveyIcons.OperaIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_RUE]: CulturalSurveyIcons.ReversedHatIcon,
  [CulturalSurveyTypeCodeKey.SPECTACLE_THEATRE]: CulturalSurveyIcons.TheaterIcon,
  [CulturalSurveyTypeCodeKey.SANS_ACTIVITES]: null,
  [CulturalSurveyTypeCodeKey.SANS_SORTIES]: null,
}

export const mapCulturalSurveyTypeToIcon = (
  types: CulturalSurveyTypeCodeKey
): React.FC<IconInterface> | null => {
  if (types && types in MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON)
    return MAP_CULTURAL_SURVEY_ANSWER_ID_TO_ICON[types]
  return CulturalSurveyIcons.FestivalIcon
}
