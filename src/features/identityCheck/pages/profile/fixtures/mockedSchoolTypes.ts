import { ActivityIdEnum, SchoolTypesIdEnum, ProfileOptionsResponse } from 'api/gen'

export const SchoolTypesSnap: ProfileOptionsResponse = {
  activities: [
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.PRIVATESECONDARYSCHOOL,
        SchoolTypesIdEnum.PUBLICSECONDARYSCHOOL,
        SchoolTypesIdEnum.HOMEORREMOTESCHOOLING,
      ],
      description: null,
      id: ActivityIdEnum.MIDDLESCHOOLSTUDENT,
      label: 'Collégien',
    },
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.AGRICULTURALHIGHSCHOOL,
        SchoolTypesIdEnum.MILITARYHIGHSCHOOL,
        SchoolTypesIdEnum.NAVALHIGHSCHOOL,
        SchoolTypesIdEnum.PRIVATEHIGHSCHOOL,
        SchoolTypesIdEnum.PUBLICHIGHSCHOOL,
        SchoolTypesIdEnum.HOMEORREMOTESCHOOLING,
        SchoolTypesIdEnum.APPRENTICEFORMATIONCENTER,
      ],
      description: null,
      id: ActivityIdEnum.HIGHSCHOOLSTUDENT,
      label: 'Lycéen',
    },
    {
      associatedSchoolTypesIds: [],
      description: null,
      id: ActivityIdEnum.STUDENT,
      label: 'Étudiant',
    },
    {
      associatedSchoolTypesIds: [],
      description: null,
      id: ActivityIdEnum.EMPLOYEE,
      label: 'Employé',
    },
    {
      associatedSchoolTypesIds: [],
      description: null,
      id: ActivityIdEnum.APPRENTICE,
      label: 'Apprenti',
    },
    {
      associatedSchoolTypesIds: [],
      description: null,
      id: ActivityIdEnum.APPRENTICESTUDENT,
      label: 'Alternant',
    },
    {
      associatedSchoolTypesIds: [],
      description: 'En service civique',
      id: ActivityIdEnum.VOLUNTEER,
      label: 'Volontaire',
    },
    {
      associatedSchoolTypesIds: [],
      description: 'En incapacité de travailler',
      id: ActivityIdEnum.INACTIVE,
      label: 'Inactif',
    },
    {
      associatedSchoolTypesIds: [],
      description: "En recherche d'emploi",
      id: ActivityIdEnum.UNEMPLOYED,
      label: 'Chômeur',
    },
  ],
  school_types: [
    { id: SchoolTypesIdEnum.AGRICULTURALHIGHSCHOOL, label: 'Lycée agricole', description: null },
    { id: SchoolTypesIdEnum.APPRENTICEFORMATIONCENTER, label: "Centre de formation d'apprentis" },
    { id: SchoolTypesIdEnum.PRIVATESECONDARYSCHOOL, label: 'Collège privé' },
    { id: SchoolTypesIdEnum.PUBLICSECONDARYSCHOOL, label: 'Collège public' },
    {
      id: SchoolTypesIdEnum.HOMEORREMOTESCHOOLING,
      description: 'À domicile, CNED, institut de santé, etc.',
      label: 'Accompagnement spécialisé',
    },
  ],
}
