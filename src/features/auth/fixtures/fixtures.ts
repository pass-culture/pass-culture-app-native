import { SettingsResponse } from 'api/gen'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
export const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')
export const DEFAULT_SELECTED_DATE = new Date('2006-12-01T00:00:00.000Z')
export const MINIMUM_DATE = new Date('1900-01-01T00:00:00.000Z')
export const MAXIMUM_DATE = new Date('2006-12-01T00:00:00.000Z')
export const EIGHTEEN_AGE_DATE = new Date('2002-12-01T00:00:00.000Z')
export const SIXTEEN_AGE_DATE = new Date('2004-12-01T00:00:00.000Z')

export const defaultSettings: SettingsResponse = {
  accountCreationMinimumAge: 15,
  accountUnsuspensionLimit: 60,
  appEnableAutocomplete: true,
  displayDmsRedirection: true,
  enableFrontImageResizing: true,
  enableNativeCulturalSurvey: false,
  enablePhoneValidation: true,
  idCheckAddressAutocompletion: true,
  isRecaptchaEnabled: true,
  objectStorageUrl: 'https://localhost-storage',
  rates: { pacificFrancToEuro: DEFAULT_PACIFIC_FRANC_TO_EURO_RATE },
  wipEnableCreditV3: true,
  ineligiblePostalCodes: [],
  depositAmountsByAge: defaultCreditByAge,
  bonification: {
    bonusAmount: 50_00,
    qfThreshold: 700,
  },
}
