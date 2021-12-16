import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import {
  activityHasSchoolTypes,
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
      'MILITARY_HIGH_SCHOOL',
      'NAVAL_HIGH_SCHOOL',
      'PRIVATE_HIGH_SCHOOL',
      'PUBLIC_HIGH_SCHOOL',
      'HOME_OR_REMOTE_SCHOOLING',
      'APPRENTICE_FORMATION_CENTER',
    ])
  })
  it('should return an empty array if the activity Id is not in the response model', () => {
    expect(getSchoolTypesIdsFromActivity(ActivityIdEnum.UNEMPLOYED, activities)).toEqual([])
  })
})

describe('activityHasSchoolTypes', () => {
  it('should return true for MIDDLE_SCHOOL', () => {
    expect(activityHasSchoolTypes(ActivityIdEnum.MIDDLESCHOOLSTUDENT, activities)).toEqual(true)
  })
  it('should return false for APPRENTICE', () => {
    expect(activityHasSchoolTypes(ActivityIdEnum.APPRENTICE, activities)).toEqual(false)
  })
})
