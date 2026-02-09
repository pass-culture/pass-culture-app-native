import { omit } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { ControlledFilterSwitch } from 'features/internal/atoms/ControlledFilterSwitch'
import { DateChoice } from 'features/internal/atoms/DateChoice'
import { LocationFilterChoice } from 'features/internal/atoms/LocationFilterChoice'
import {
  OfferCategoryChoices,
  ThematicSearchCategoryChoices,
} from 'features/internal/atoms/OfferCategoryChoices'
import { OfferNativeCategoryChoices } from 'features/internal/atoms/OfferNativeCategoryChoices'
import {
  MARKETING_CONFIG,
  ParamConfig,
  SCREENS_CONFIG,
  ScreensUsedByMarketing,
} from 'features/internal/config/deeplinksExportConfig'
import { getScreenForLabel, SCREEN_OPTIONS } from 'features/internal/helpers/screenOptionsHelpers'
import { getUniversalLink } from 'features/navigation/navigators/RootNavigator/linking/getUniversalLink'
import { MAX_PRICE_IN_CENTS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { Range } from 'libs/typesUtils/typeHelpers'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Accordion } from 'ui/components/Accordion'
import { Slider } from 'ui/components/inputs/Slider'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Warning as WarningDefault } from 'ui/svg/icons/Warning'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  onCreate: (universalLink: string) => void
}

type DeeplinksAppParams = Record<string, unknown> & {
  priceRange?: Range<number> | null
  offerIsFree?: boolean
  minPrice?: string
  maxPrice?: string
}

export const getDefaultScreenParams = (screenName: ScreensUsedByMarketing) => {
  if (screenName === 'SearchResults') {
    return {
      locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: 'all' },
      from: 'deeplink',
    }
  }
  return { from: 'deeplink' }
}

export const DeeplinksGeneratorForm = ({ onCreate }: Props) => {
  const { appContentWidth, isMobileViewport } = useTheme()
  const [selectedScreen, setSelectedScreen] = useState<ScreensUsedByMarketing>('Home')
  const [screenParams, setScreenParams] = useState<Record<string, unknown>>({
    ...getDefaultScreenParams('Home'),
    utm_gen: 'marketing',
  })

  const { showErrorSnackBar } = useSnackBarContext()

  const handleScreenChange = useCallback((label: string) => {
    const screen = getScreenForLabel(label)
    if (!screen) return
    setSelectedScreen(screen)
    setScreenParams((prev) => ({
      ...getDefaultScreenParams(screen),
      utm_gen: prev.utm_gen,
    }))
  }, [])

  const renderScreenParam = (name: string, config: ParamConfig) => {
    function validate(value: unknown) {
      if (config.serverValidator) {
        config.serverValidator(value).catch((error) => {
          const errorMessage = getErrorMessage(error)
          showErrorSnackBar({
            message: `${name} invalide: ${errorMessage}`,
            timeout: SNACK_BAR_TIME_OUT,
          })
        })
      }
    }

    function onChangeText(text: string) {
      setScreenParams((prevPageParams) =>
        text.length === 0
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: text,
            }
      )
    }

    function onChangeStringArray(text: string) {
      setScreenParams((prevPageParams) =>
        text.length === 0
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: text.split(';'),
            }
      )
    }

    function onBlurValidate() {
      const value: unknown = screenParams[name]
      if (value) validate(value)
    }

    function onBooleanChange(value: boolean) {
      setScreenParams((prevPageParams) =>
        value
          ? {
              ...prevPageParams,
              [name]: value,
            }
          : omit(prevPageParams, name)
      )
    }

    function onChangePriceRange(value: number[]) {
      setScreenParams((prevPageParams) =>
        value[0] === 0 && value[1] === convertCentsToEuros(MAX_PRICE_IN_CENTS)
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: value,
            }
      )
    }

    function onChangeOfferCategories(categories: SearchGroupNameEnumv2[]) {
      setScreenParams((prevPageParams) => {
        return {
          ...prevPageParams,
          [name]: categories.length ? categories : undefined,
          offerNativeCategories: undefined,
        }
      })
    }

    function onChangeOfferNativeCategories(nativeCategories: NativeCategoryIdEnumv2[]) {
      setScreenParams((prevPageParams) =>
        nativeCategories.length
          ? {
              ...prevPageParams,
              [name]: nativeCategories,
            }
          : omit(prevPageParams, name)
      )
    }

    function onChangeDate(date: Date | undefined) {
      setScreenParams((prevPageParams) =>
        date
          ? {
              ...prevPageParams,
              [name]: date,
            }
          : omit(prevPageParams, name)
      )
    }

    function onChangeLocationFilterChoice(locationFilter: LocationFilter | null) {
      setScreenParams((prevPageParams) =>
        locationFilter
          ? {
              ...prevPageParams,
              [name]: locationFilter,
            }
          : omit(prevPageParams, name)
      )
    }

    const label = config.required ? `${name} (*)` : name
    const sliderLength = appContentWidth / (isMobileViewport ? 1 : 2) - getSpacing(2 * 2 * 6)
    return (
      <TextInputContainer key={name}>
        {config.type === 'string' ? (
          <TextInput
            label={label}
            onBlur={onBlurValidate}
            onChangeText={onChangeText}
            defaultValue={screenParams[name] ? String(screenParams[name]) : undefined}
            testID={`Entrée pour un ${name}`}
          />
        ) : null}
        {config.type === 'stringArray' ? (
          <TextInput label={label} onBlur={onBlurValidate} onChangeText={onChangeStringArray} />
        ) : null}
        {config.type === 'boolean' ? (
          <ControlledFilterSwitch onChange={onBooleanChange} name={config.description} />
        ) : null}
        {config.type === 'priceRange' ? (
          <PaddingContainer>
            <Slider
              showValues
              max={convertCentsToEuros(MAX_PRICE_IN_CENTS)}
              sliderLength={sliderLength}
              onValuesChangeFinish={onChangePriceRange}
              minLabel="Prix minimum&nbsp;:"
              maxLabel="Prix maximum&nbsp;:"
            />
          </PaddingContainer>
        ) : null}
        {config.type === 'offerCategories' ? (
          <OfferCategoryChoices
            onChange={onChangeOfferCategories}
            selection={screenParams.offerCategories as SearchGroupNameEnumv2[]}
          />
        ) : null}
        {config.type === 'offerNativeCategories' && screenParams.offerCategories ? (
          <OfferNativeCategoryChoices
            categories={screenParams.offerCategories as SearchGroupNameEnumv2[]}
            onChange={onChangeOfferNativeCategories}
          />
        ) : null}
        {config.type === 'thematicSearchCategories' ? (
          <ThematicSearchCategoryChoices
            onChange={onChangeOfferCategories}
            selection={screenParams.offerCategories as SearchGroupNameEnumv2[]}
          />
        ) : null}
        {config.type === 'date' ? (
          <PaddingContainer>
            <DateChoice onChange={onChangeDate} />
          </PaddingContainer>
        ) : null}
        {config.type === 'locationFilter' ? (
          <LocationFilterChoice onChange={onChangeLocationFilterChoice} />
        ) : null}
        {config.description ? (
          <PaddingContainer>
            <StyledCaption>{config.description}</StyledCaption>
          </PaddingContainer>
        ) : null}
        <Separator.Horizontal />
      </TextInputContainer>
    )
  }

  function areAllParamsValid() {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    for (const [paramName, paramConfig] of Object.entries(screenConfig)) {
      if (paramConfig.required && !screenParams[paramName]) {
        return false
      }
    }
    return true
  }

  function onPress() {
    if (!areAllParamsValid()) return

    const { appParams, marketingParams } = extractParams(screenParams)

    if (appParams.offerIsFree) {
      appParams.priceRange = null
      appParams.minPrice = '0'
      appParams.maxPrice = '0'
    } else {
      appParams.minPrice = appParams.priceRange?.[0]?.toString() ?? undefined
      appParams.maxPrice = appParams.priceRange?.[1]?.toString() ?? undefined
    }

    const appAndMarketingParams = { ...appParams, ...marketingParams }

    const universalLink =
      selectedScreen === 'SearchResults' && appParams.URL
        ? (appParams.URL as string)
        : getUniversalLink(selectedScreen, appAndMarketingParams, env.WEBAPP_V2_DOMAIN)

    onCreate(universalLink)
  }

  const paramsCount = useMemo(() => {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    return Object.keys(screenConfig).length
  }, [selectedScreen])

  const disabled = !areAllParamsValid()

  useEnterKeyAction(disabled ? undefined : onPress)

  const errorText = 'Seulement les "ids" disposent de validation\u00a0!'

  return (
    <React.Fragment>
      <Container>
        <StyledTitle4>Besoin d’un lien&nbsp;?</StyledTitle4>
        <Accordion title="Pages" defaultOpen>
          <RadioButtonGroup
            label="Sélectionne une page"
            options={SCREEN_OPTIONS}
            value={selectedScreen}
            onChange={handleScreenChange}
          />
        </Accordion>
        {paramsCount > 0 ? (
          <Accordion title={'Paramètres applicatifs' + ` (${paramsCount})`} defaultOpen>
            {Object.entries(SCREENS_CONFIG).map(([page, screenConfig]) => (
              <React.Fragment key={page}>
                {page === selectedScreen
                  ? Object.entries(screenConfig).map(([name, config]) =>
                      renderScreenParam(name, config)
                    )
                  : null}
              </React.Fragment>
            ))}
          </Accordion>
        ) : null}
        <Accordion title="Paramètres marketing" defaultOpen>
          {Object.entries(SCREENS_CONFIG).map(([page]) => (
            <React.Fragment key={page}>
              {page === selectedScreen
                ? Object.entries(MARKETING_CONFIG).map(([name, config]) =>
                    renderScreenParam(name, config)
                  )
                : null}
            </React.Fragment>
          ))}
        </Accordion>
      </Container>
      <BottomContainer>
        <ErrorContainer gap={2}>
          <Warning />
          <ErrorText>{errorText}</ErrorText>
        </ErrorContainer>
        <Button wording="Générer le lien" disabled={disabled} onPress={onPress} fullWidth />
      </BottomContainer>
    </React.Fragment>
  )
}

function extractParams(params: Record<string, unknown>) {
  const appParams: DeeplinksAppParams = {}
  const marketingParams: Record<string, unknown> = {}
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (paramName in MARKETING_CONFIG) marketingParams[paramName] = paramValue
    else {
      appParams[paramName] = paramValue
      // Force showResults for old versions compatibility
      if (paramName === 'view') appParams['showResults'] = 'true'
    }
  }
  return { appParams, marketingParams }
}

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
  flexDirection: 'column',
}))

const ErrorContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const ErrorText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.s,
  color: theme.designSystem.color.text.error,
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const BottomContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingVertical: theme.designSystem.size.spacing.l,
  alignItems: 'center',
}))

const PaddingContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.xl,
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Warning = styled(WarningDefault).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
  size: theme.icons.sizes.extraSmall,
}))``

const TextInputContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
