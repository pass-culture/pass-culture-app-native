import { ActivityIdEnum, SchoolTypesIdEnum, ProfileOptionsResponse } from 'api/gen'

export const SchoolTypesSnap: ProfileOptionsResponse = {
  activities: [
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.PRIVATE_SECONDARY_SCHOOL,
        SchoolTypesIdEnum.PUBLIC_SECONDARY_SCHOOL,
        SchoolTypesIdEnum.HOME_OR_REMOTE_SCHOOLING,
      ],
      description: null,
      id: ActivityIdEnum.MIDDLE_SCHOOL_STUDENT,
      label: 'Collégien',
    },
    {
      associatedSchoolTypesIds: [
        SchoolTypesIdEnum.AGRICULTURAL_HIGH_SCHOOL,
        SchoolTypesIdEnum.MILITARY_HIGH_SCHOOL,
        SchoolTypesIdEnum.NAVAL_HIGH_SCHOOL,
        SchoolTypesIdEnum.PRIVATE_HIGH_SCHOOL,
        SchoolTypesIdEnum.PUBLIC_HIGH_SCHOOL,
        SchoolTypesIdEnum.HOME_OR_REMOTE_SCHOOLING,
        SchoolTypesIdEnum.APPRENTICE_FORMATION_CENTER,
      ],
      description: null,
      id: ActivityIdEnum.HIGH_SCHOOL_STUDENT,
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
      id: ActivityIdEnum.APPRENTICE_STUDENT,
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
      description: 'En recherche d’emploi',
      id: ActivityIdEnum.UNEMPLOYED,
      label: 'Chômeur',
    },
  ],
  school_types: [
    { id: SchoolTypesIdEnum.AGRICULTURAL_HIGH_SCHOOL, label: 'Lycée agricole', description: null },
    { id: SchoolTypesIdEnum.APPRENTICE_FORMATION_CENTER, label: 'Centre de formation d’apprentis' },
    { id: SchoolTypesIdEnum.PRIVATE_SECONDARY_SCHOOL, label: 'Collège privé' },
    { id: SchoolTypesIdEnum.PUBLIC_SECONDARY_SCHOOL, label: 'Collège public' },
    {
      id: SchoolTypesIdEnum.HOME_OR_REMOTE_SCHOOLING,
      description: 'À domicile, CNED, institut de santé, etc.',
      label: 'Accompagnement spécialisé',
    },
  ],
}
