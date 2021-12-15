import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'

export const useProfileOptions = jest.fn(() => {
  return {
    schoolTypes: [{}],
    activities: SchoolTypesSnap.activities,
  }
})
