import { SubcategoryIdEnum, UserProfileResponse } from 'api/gen'
import { env } from 'libs/environment'
import { getAge } from 'shared/user/getAge'

export const buildBookingSurveyUrl = ({
  isDuo,
  numberOfBookings,
  subcategoryId,
  user,
}: {
  isDuo: boolean
  numberOfBookings: number
  subcategoryId: SubcategoryIdEnum
  user?: UserProfileResponse
}) => {
  const userAge = getAge(user?.birthDate)

  const surveyUrl = new URL(env.BOOKING_FEEDBACK_LINK)
  surveyUrl.searchParams.set('BookingType', isDuo ? 'duo' : 'solo')
  surveyUrl.searchParams.set('BookingCategory', subcategoryId)
  surveyUrl.searchParams.set('IsFirstBooking', (numberOfBookings === 1).toString())
  userAge && surveyUrl.searchParams.set('UserAge', userAge.toString())
  user?.depositActivationDate &&
    surveyUrl.searchParams.set('DepositActivationDate', user.depositActivationDate)

  return surveyUrl
}
