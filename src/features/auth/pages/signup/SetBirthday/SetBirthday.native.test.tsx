import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
} from 'features/auth/fixtures/fixtures'
import { NonEligible } from 'features/onboarding/enums'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { storage } from 'libs/storage'
import { act, fireEvent, renderAsync, screen, userEvent } from 'tests/utils'

import { SetBirthday } from './SetBirthday'

jest.mock('libs/firebase/analytics/analytics')

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  isSSOSubscription: false,
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
  onSSOEmailNotFoundError: jest.fn(),
  onDefaultEmailSignup: jest.fn(),
}

const specificUserAges = [15, 16, 17, 18]
// null is the return value of storage when there is no value corresponding to the key
const nonSpecificUserAges = [null, NonEligible.UNDER_15, NonEligible.OVER_18]

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const USER_AGE_KEY = 'user_age'
const GENERAL_PUBLIC_MESSAGE =
  'Ta date de naissance nous aidera à te proposer des offres adaptées et à personnaliser ton expérience.'
const ELIGIBLE_MESSAGE =
  'Assure-toi que ta date de naissance est exacte. Elle ne pourra plus être modifiée par la suite et nous vérifions tes informations.'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SetBirthday />', () => {
  beforeEach(async () => {
    mockdate.set(CURRENT_DATE)
    await storage.clear(USER_AGE_KEY)
  })

  it('should render correctly', async () => {
    await renderAsync(<SetBirthday {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when account creation token and email are in route params', async () => {
    useRoute.mockReturnValueOnce({
      params: { accountCreationToken: 'accountCreationToken', email: 'user@gmail.com' },
    })
    await renderAsync(<SetBirthday {...props} isSSOSubscription />)

    expect(screen).toMatchSnapshot()
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', async () => {
    await renderAsync(<SetBirthday {...props} />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    await act(() =>
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
    )

    const continueButton = screen.getByTestId('Continuer')
    await user.press(continueButton)

    expect(props.goToNextStep).toHaveBeenCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })

  it.each(nonSpecificUserAges)(
    'should set default date when no specific user age in local storage',
    async (userAge) => {
      storage.saveObject('user_age', userAge)
      await renderAsync(<SetBirthday {...props} />)

      const datePicker = await screen.findByTestId('date-picker-spinner-native')

      expect(datePicker.props.date).toBe(DEFAULT_SELECTED_DATE.toISOString())
    }
  )

  it.each(specificUserAges)(
    'should set default year to user birth year when user age is in local storage',
    async (userAge) => {
      storage.saveObject('user_age', userAge)
      await renderAsync(<SetBirthday {...props} />)

      const datePicker = await screen.findByTestId('date-picker-spinner-native')
      const spinnerDate = new Date(datePicker.props.date)

      expect(spinnerDate.getDate()).toBe(1)
      expect(spinnerDate.getMonth()).toBe(11)
      expect(spinnerDate.getFullYear()).toBe(2020 - userAge)
    }
  )

  it('should set a default birthdate if the user has already added his birthdate', async () => {
    const propsWithPreviousBirthdate = {
      ...props,
      previousSignupData: {
        ...props.previousSignupData,
        birthdate: '12-11-1994',
      },
    }
    await renderAsync(<SetBirthday {...propsWithPreviousBirthdate} />)

    const datePicker = await screen.findByTestId('date-picker-spinner-native')

    expect(datePicker.props.date).toBe(new Date('1994-12-11').toISOString())
  })

  describe('banner', () => {
    beforeEach(async () => {
      await storage.clear('access_token')
    })

    it('should display the general public message when userAge is  NonEligible.OVER_18', async () => {
      storage.saveObject('user_age', NonEligible.OVER_18)
      await renderAsync(<SetBirthday {...props} />)

      const bannerMessage = await screen.findByText(GENERAL_PUBLIC_MESSAGE)

      expect(bannerMessage).toBeTruthy()
    })

    it('should display the eligible message when userAge is set in number', async () => {
      storage.saveObject('user_age', 16)
      await renderAsync(<SetBirthday {...props} />)

      const bannerMessage = await screen.findByText(ELIGIBLE_MESSAGE)

      expect(bannerMessage).toBeTruthy()
    })

    it('should display the eligible message when userAge is UNDER_15', async () => {
      storage.saveObject('user_age', NonEligible.UNDER_15)
      await renderAsync(<SetBirthday {...props} />)

      const bannerMessage = await screen.findByText(ELIGIBLE_MESSAGE)

      expect(bannerMessage).toBeTruthy()
    })

    it('should display the eligible message when userAge is UNDER_17', async () => {
      storage.saveObject('user_age', NonEligible.UNDER_17)
      await renderAsync(<SetBirthday {...props} />)

      const bannerMessage = await screen.findByText(ELIGIBLE_MESSAGE)

      expect(bannerMessage).toBeTruthy()
    })

    it('should display the eligible message when userAge is null', async () => {
      storage.saveObject('user_age', null)
      await renderAsync(<SetBirthday {...props} />)

      const bannerMessage = await screen.findByText(ELIGIBLE_MESSAGE)

      expect(bannerMessage).toBeTruthy()
    })
  })
})
