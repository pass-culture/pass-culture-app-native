import { CulturalSurveyAnswerEnum } from 'api/gen'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

describe('culturalSurveyType', () => {
  it('should have default icon as Festival', () => {
    const result = mapCulturalSurveyTypeToIcon('__unknown_key__' as CulturalSurveyAnswerEnum)
    expect(result).toBe(culturalSurveyIcons.Festival)
  })
})
