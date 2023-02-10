import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import {
  activityHasSchoolTypes,
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabelAndDescription,
} from 'features/identityCheck/pages/profile/helpers/schoolTypes'

const schoolTypes = SchoolTypesSnap.school_types
const activities = SchoolTypesSnap.activities

describe('mapSchoolTypeIdToLabel', () => {
  it('should return the associated label and description', () => {
    expect(
      mapSchoolTypeIdToLabelAndDescription(SchoolTypesIdEnum.AGRICULTURAL_HIGH_SCHOOL, schoolTypes)
    ).toEqual({ description: null, label: 'Lycée agricole' })
    expect(
      mapSchoolTypeIdToLabelAndDescription(SchoolTypesIdEnum.HOME_OR_REMOTE_SCHOOLING, schoolTypes)
    ).toEqual({
      description: 'À domicile, CNED, institut de santé, etc.',
      label: 'Accompagnement spécialisé',
    })
  })
})

describe('getSchoolTypesIdsFromActivity', () => {
  it('should return the associated types ids', () => {
    expect(getSchoolTypesIdsFromActivity(ActivityIdEnum.HIGH_SCHOOL_STUDENT, activities)).toEqual([
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
    expect(activityHasSchoolTypes(ActivityIdEnum.MIDDLE_SCHOOL_STUDENT, activities)).toEqual(true)
  })
  it('should return false for APPRENTICE', () => {
    expect(activityHasSchoolTypes(ActivityIdEnum.APPRENTICE, activities)).toEqual(false)
  })
})
