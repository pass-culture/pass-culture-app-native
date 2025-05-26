import { ActivityIdEnum } from 'api/gen'

const ACTIVITIES: Record<ActivityIdEnum, string> = {
  [ActivityIdEnum.MIDDLE_SCHOOL_STUDENT]: 'Collégien',
  [ActivityIdEnum.HIGH_SCHOOL_STUDENT]: 'Lycéen',
  [ActivityIdEnum.STUDENT]: 'Étudiant',
  [ActivityIdEnum.EMPLOYEE]: 'Employé',
  [ActivityIdEnum.APPRENTICE]: 'Apprenti',
  [ActivityIdEnum.APPRENTICE_STUDENT]: 'Alternant',
  [ActivityIdEnum.VOLUNTEER]: 'Volontaire',
  [ActivityIdEnum.INACTIVE]: 'Inactif',
  [ActivityIdEnum.UNEMPLOYED]: 'Demandeur d’emploi',
}

export function getActivityLabel(activityId?: ActivityIdEnum | null): string | undefined {
  if (!activityId) return undefined
  return ACTIVITIES[activityId]
}
