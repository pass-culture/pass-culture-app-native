import { SettingsResponse } from 'api/gen'
import {
  bonificationAmountFallbackValue,
  defaultCreditByAge,
} from 'shared/credits/defaultCreditByAge'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const SettingsFixture: SettingsResponse = {
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
    bonusAmount: bonificationAmountFallbackValue,
    qfThreshold: 700,
  },
}
