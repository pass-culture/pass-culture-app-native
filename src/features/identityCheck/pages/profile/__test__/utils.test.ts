import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import {
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabel,
} from 'features/identityCheck/pages/profile/utils'

const schoolTypes = SchoolTypesSnap.school_types
const activities = SchoolTypesSnap.activities

describe('mapSchoolTypeIdToLabel', () => {
  it('should return the associated label', () => {
    expect(mapSchoolTypeIdToLabel(SchoolTypesIdEnum.AGRICULTURALHIGHSCHOOL, schoolTypes)).toEqual(
      'Lycée agricole'
    )
  })
})

describe('getSchoolTypesIdsFromActivity', () => {
  it('should return the associated types ids', () => {
    expect(getSchoolTypesIdsFromActivity(ActivityIdEnum.HIGHSCHOOLSTUDENT, activities)).toEqual([
      'AGRICULTURAL_HIGH_SCHOOL',
      'APPRENTICE_FORMATION_CENTER',
    ])
  })
  it('should return an empty array if the activity Id is not in the response model', () => {
    expect(getSchoolTypesIdsFromActivity(ActivityIdEnum.UNEMPLOYED, activities)).toEqual([])
  })
})
