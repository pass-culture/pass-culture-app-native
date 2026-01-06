/**
 * These hooks can be used to access settings while being less coupled with react-query implementation.
 * This is useful, for example, for display components.
 * It can also be useful for mocking in tests.
 * If really needed you can use useSettingsQuery.
 */

import { useSettingsQuery } from 'queries/settings/settingsQuery'
import {
  selectAccountUnsuspensionLimit,
  selectAppEnableAutocomplete,
  selectBonificationBonusAmount,
  selectBonificationQfThreshold,
  selectDepositAmountsByAge,
  selectEnableFrontImageResizing,
  selectEnablePhoneValidation,
  selectIdCheckAddressAutocompletion,
  selectIneligiblePostalCodes,
  selectIsRecaptchaEnabled,
  selectObjectStorageUrl,
  selectPacificFrancToEuro,
} from 'queries/settings/settingsSelectors'
import {
  bonificationAmountFallbackValue,
  defaultCreditByAge,
} from 'shared/credits/defaultCreditByAge'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const useIneligiblePostalCodes = () =>
  useSettingsQuery({
    select: selectIneligiblePostalCodes,
  })

export const useAppEnableAutocomplete = () =>
  useSettingsQuery({
    select: selectAppEnableAutocomplete,
  })

export const useObjectStorageUrl = () =>
  useSettingsQuery({
    select: selectObjectStorageUrl,
  })

export const useEnableFrontImageResizing = () =>
  useSettingsQuery({
    select: selectEnableFrontImageResizing,
  })

export const useIsRecaptchaEnabled = () =>
  useSettingsQuery({
    select: selectIsRecaptchaEnabled,
  })

export const useAccountUnsuspensionLimit = () =>
  useSettingsQuery({
    select: selectAccountUnsuspensionLimit,
  })

export const useEnablePhoneValidation = () =>
  useSettingsQuery({
    select: selectEnablePhoneValidation,
  })

export const useIdCheckAddressAutocompletion = () =>
  useSettingsQuery({
    select: selectIdCheckAddressAutocompletion,
  })

export const useDepositAmountsByAge = () => {
  const queryResult = useSettingsQuery({
    select: selectDepositAmountsByAge,
  })

  return {
    ...queryResult,
    data: queryResult.data ?? defaultCreditByAge,
  }
}

export const usePacificFrancToEuroRate = () => {
  const queryResult = useSettingsQuery({
    select: selectPacificFrancToEuro,
  })
  return {
    ...queryResult,
    data: queryResult.data ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
  }
}

export const useBonificationBonusAmount = () => {
  const queryResult = useSettingsQuery({
    select: selectBonificationBonusAmount,
  })
  return {
    ...queryResult,
    data: queryResult.data ?? bonificationAmountFallbackValue,
  }
}

export const useBonificationQfThreshold = () =>
  useSettingsQuery({
    select: selectBonificationQfThreshold,
  })
