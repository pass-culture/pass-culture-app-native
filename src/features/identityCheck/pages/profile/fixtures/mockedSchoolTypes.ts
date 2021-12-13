import { ActivityIdEnum, SchoolTypesIdEnum, SchoolTypesResponse } from 'api/gen'

export const SchoolTypesSnap: SchoolTypesResponse = {
  activities: [
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.AGRICULTURALHIGHSCHOOL,
        SchoolTypesIdEnum.APPRENTICEFORMATIONCENTER,
      ],
      id: ActivityIdEnum.HIGHSCHOOLSTUDENT,
      label: 'Lycéen',
    },
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.PRIVATESECONDARYSCHOOL,
        SchoolTypesIdEnum.PUBLICSECONDARYSCHOOL,
      ],
      id: ActivityIdEnum.MIDDLESCHOOLSTUDENT,
      label: 'Collégien',
    },
    {
      associatedSchoolTypesIds: [],
      id: ActivityIdEnum.UNEMPLOYED,
      label: 'Chômeur',
    },
  ],
  school_types: [
    { id: SchoolTypesIdEnum.AGRICULTURALHIGHSCHOOL, label: 'Lycée agricole' },
    { id: SchoolTypesIdEnum.APPRENTICEFORMATIONCENTER, label: "Centre de formation d'apprentis" },
    { id: SchoolTypesIdEnum.PRIVATESECONDARYSCHOOL, label: 'Collège privé' },
    { id: SchoolTypesIdEnum.PUBLICSECONDARYSCHOOL, label: 'Collège public' },
  ],
}
