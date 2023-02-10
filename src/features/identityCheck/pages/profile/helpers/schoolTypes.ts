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
  const schoolType = schoolTypes?.find((type) => type.id === schoolTypeId)
  return { label: schoolType?.label, description: schoolType?.description }
}

export const getSchoolTypesIdsFromActivity = (
  activityId: ActivityIdEnum,
  activities: ActivityResponseModel[]
) => {
  return activities.find((activity) => activity.id === activityId)?.associatedSchoolTypesIds
}

export const activityHasSchoolTypes = (
  activityId: ActivityIdEnum,
  activities: ActivityResponseModel[]
) => {
  return !!getSchoolTypesIdsFromActivity(activityId, activities)?.length
}
