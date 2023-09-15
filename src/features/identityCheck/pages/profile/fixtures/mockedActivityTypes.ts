import { ActivityIdEnum, ActivityTypesResponse } from 'api/gen'

export const ActivityTypesSnap: ActivityTypesResponse = {
  activities: [
    {
      description: null,
      id: ActivityIdEnum.MIDDLE_SCHOOL_STUDENT,
      label: 'Collégien',
    },
    {
      description: null,
      id: ActivityIdEnum.HIGH_SCHOOL_STUDENT,
      label: 'Lycéen',
    },
    {
      description: null,
      id: ActivityIdEnum.STUDENT,
      label: 'Étudiant',
    },
    {
      description: null,
      id: ActivityIdEnum.EMPLOYEE,
      label: 'Employé',
    },
    {
      description: null,
      id: ActivityIdEnum.APPRENTICE,
      label: 'Apprenti',
    },
    {
      description: null,
      id: ActivityIdEnum.APPRENTICE_STUDENT,
      label: 'Alternant',
    },
    {
      description: 'En service civique',
      id: ActivityIdEnum.VOLUNTEER,
      label: 'Volontaire',
    },
    {
      description: 'En incapacité de travailler',
      id: ActivityIdEnum.INACTIVE,
      label: 'Inactif',
    },
    {
      description: 'En recherche d’emploi',
      id: ActivityIdEnum.UNEMPLOYED,
      label: 'Chômeur',
    },
  ],
}
