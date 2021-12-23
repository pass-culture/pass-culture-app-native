import {
  ActivityIdEnum,
  ActivityResponseModel,
  SchoolTypeResponseModel,
  SchoolTypesIdEnum,
} from 'api/gen'

export const mapSchoolTypeIdToLabelAndDescription = (
  schoolTypeId: SchoolTypesIdEnum,
  schoolTypes: SchoolTypeResponseModel[]
) => {
  const schoolType = schoolTypes?.find((schoolType) => schoolType.id === schoolTypeId)
  return { label: schoolType?.label, description: schoolType?.description }
}

export const getSchoolTypesIdsFromActivity = (
  activityId: ActivityIdEnum,
  activities: ActivityResponseModel[]
) => {
  const activitySchoolTypes = activities.find(
    (activity) => activity.id === activityId
  )?.associatedSchoolTypesIds

  return activitySchoolTypes
}

export const activityHasSchoolTypes = (
  activityId: ActivityIdEnum,
  activities: ActivityResponseModel[]
) => {
  return !!getSchoolTypesIdsFromActivity(activityId, activities)?.length
}
