import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'

export const useProfileOptions = jest.fn(() => {
  return {
    schoolTypes: SchoolTypesSnap.school_types,
    activities: SchoolTypesSnap.activities,
  }
})
