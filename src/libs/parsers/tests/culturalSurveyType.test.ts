import { CulturalSurveyAnswerEnum } from 'api/gen'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'

describe('culturalSurveyType', () => {
  it('should have default icon as Festival', () => {
    const result = mapCulturalSurveyTypeToIcon('__unknown_key__' as CulturalSurveyAnswerEnum)
    expect(result).toBe(CulturalSurveyIcons.Festival)
  })
})
