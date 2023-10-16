import omit from 'lodash/omit'
import React, { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks/helpers'
import { ControlledFilterSwitch } from 'features/internal/marketingAndCommunication/atoms/ControlledFilterSwitch'
import { DateChoice } from 'features/internal/marketingAndCommunication/atoms/DateChoice'
import { LocationFilterChoice } from 'features/internal/marketingAndCommunication/atoms/LocationFilterChoice'
import { OfferCategoryChoices } from 'features/internal/marketingAndCommunication/atoms/OfferCategoryChoices'
import { OfferNativeCategoryChoices } from 'features/internal/marketingAndCommunication/atoms/OfferNativeCategoryChoices'
import {
  FDL_CONFIG,
  MARKETING_CONFIG,
  ParamConfig,
  SCREENS_CONFIG,
  ScreensUsedByMarketing,
} from 'features/internal/marketingAndCommunication/config/deeplinksExportConfig'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { isTabScreen } from 'features/navigation/TabBar/routes'
import { LocationType } from 'features/search/enums'
import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { LocationFilter, SearchView } from 'features/search/types'
import { env } from 'libs/environment'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Slider } from 'ui/components/inputs/Slider'
import { TextInput } from 'ui/components/inputs/TextInput'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Warning as WarningDefault } from 'ui/svg/icons/BicolorWarning'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface GeneratedDeeplink {
  universalLink: string
  firebaseLink: string
}

interface Props {
  onCreate: (generatedDeeplink: GeneratedDeeplink) => void
}

export function getDefaultScreenParams(screenName: ScreensUsedByMarketing) {
  if (screenName === 'Search') {
    return {
      view: SearchView.Results,
      locationFilter: { locationType: LocationType.EVERYWHERE },
      noFocus: true,
      from: 'deeplink',
    }
  }
  return { from: 'deeplink' }
}

export const DeeplinksGeneratorForm = ({ onCreate }: Props) => {
  const { appContentWidth, isMobileViewport } = useTheme()
  const [selectedScreen, setSelectedScreen] = useState<ScreensUsedByMarketing>('Home')
  const [screenParams, setScreenParams] = useState<Record<string, unknown>>({
    utm_gen: 'marketing',
  })

  const { showErrorSnackBar } = useSnackBarContext()

  const renderScreenItem = (screenName: ScreensUsedByMarketing) => {
    const onSelectScreenName = () => {
      setSelectedScreen(screenName)
      setScreenParams((prev) => ({ ...getDefaultScreenParams(screenName), utm_gen: prev.utm_gen }))
    }

    return (
      <React.Fragment key={screenName}>
        <Spacer.Column numberOfSpaces={2} />
        <RadioButton
          label={screenName}
          isSelected={selectedScreen === screenName}
          onSelect={onSelectScreenName}
        />
        <Spacer.Column numberOfSpaces={2} />
        <Separator.Horizontal />
      </React.Fragment>
    )
  }

  const renderScreenParam = (name: string, config: ParamConfig) => {
    function validate(value: unknown) {
      if (config.serverValidator) {
        config.serverValidator(value).catch((error) => {
          showErrorSnackBar({
            message: `${name} invalide: ${error.message}`,
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
        !value
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: value,
            }
      )
    }

    function onChangePriceRange(value: number[]) {
      setScreenParams((prevPageParams) =>
        value[0] === 0 && value[1] === MAX_PRICE
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
          [name]: !categories.length ? undefined : categories,
          offerNativeCategories: undefined,
        }
      })
    }

    function onChangeOfferNativeCategories(nativeCategories: NativeCategoryIdEnumv2[]) {
      setScreenParams((prevPageParams) =>
        !nativeCategories.length
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: nativeCategories,
            }
      )
    }

    function onChangeDate(date: Date | undefined) {
      setScreenParams((prevPageParams) =>
        !date
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: date,
            }
      )
    }

    function onChangeLocationFilterChoice(locationFilter: LocationFilter | null) {
      setScreenParams((prevPageParams) =>
        !locationFilter
          ? omit(prevPageParams, name)
          : {
              ...prevPageParams,
              [name]: locationFilter,
            }
      )
    }

    const placeholder = config.required ? `${name} (*)` : name
    const sliderLength = appContentWidth / (isMobileViewport ? 1 : 2) - getSpacing(2 * 2 * 6)
    return (
      <React.Fragment key={name}>
        <Spacer.Column numberOfSpaces={2} />
        {config.type === 'string' && (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlurValidate}
            onChangeText={onChangeText}
            defaultValue={screenParams[name] ? String(screenParams[name]) : undefined}
          />
        )}
        {config.type === 'stringArray' && (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlurValidate}
            onChangeText={onChangeStringArray}
          />
        )}
        {config.type === 'boolean' && (
          <ControlledFilterSwitch onChange={onBooleanChange} name={config.description} />
        )}
        {config.type === 'priceRange' && (
          <PaddingContainer>
            <Slider
              showValues
              max={MAX_PRICE}
              sliderLength={sliderLength}
              formatValues={formatPriceInEuroToDisplayPrice}
              onValuesChangeFinish={onChangePriceRange}
              minLabel="Prix minimum&nbsp;:"
              maxLabel="Prix maximum&nbsp;:"
            />
          </PaddingContainer>
        )}
        {config.type === 'offerCategories' && (
          <OfferCategoryChoices onChange={onChangeOfferCategories} />
        )}
        {!!(config.type === 'offerNativeCategories' && screenParams.offerCategories) && (
          <OfferNativeCategoryChoices
            categories={screenParams.offerCategories as SearchGroupNameEnumv2[]}
            onChange={onChangeOfferNativeCategories}
          />
        )}
        {config.type === 'date' && (
          <PaddingContainer>
            <DateChoice onChange={onChangeDate} />
          </PaddingContainer>
        )}
        {config.type === 'locationFilter' && (
          <LocationFilterChoice onChange={onChangeLocationFilterChoice} />
        )}
        {!!config.description && (
          <PaddingContainer>
            <StyledCaption>{config.description}</StyledCaption>
          </PaddingContainer>
        )}
        <Separator.Horizontal />
      </React.Fragment>
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

    const { appParams, marketingParams, fdlParams } = extractParams(screenParams)
    const appAndMarketingParams = { ...appParams, ...marketingParams }

    let screenPath = getScreenPath(selectedScreen, appAndMarketingParams)
    if (isTabScreen(selectedScreen)) {
      const tabNavConfig = getTabNavConfig(selectedScreen, appAndMarketingParams)
      screenPath = getScreenPath(...tabNavConfig)
    }

    let universalLink = `https://${env.WEBAPP_V2_DOMAIN}${screenPath}`
    let firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)

    if (selectedScreen === 'Search' && appParams.URL) {
      universalLink = appParams.URL as string
      firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)
    }

    onCreate({ universalLink, firebaseLink })
  }

  const paramsCount = useMemo(() => {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    return Object.keys(screenConfig).length
  }, [selectedScreen])

  const disabled = !areAllParamsValid()

  useEnterKeyAction(!disabled ? onPress : undefined)

  const errorText = 'Seulement les "ids" disposent de validation\u00a0!'

  return (
    <React.Fragment>
      <Container>
        <StyledTitle4>Besoin d’un lien&nbsp;?</StyledTitle4>
        <Spacer.Column numberOfSpaces={6} />
        <AccordionItem title="Pages" defaultOpen>
          {Object.keys(SCREENS_CONFIG).map((key) =>
            renderScreenItem(key as ScreensUsedByMarketing)
          )}
        </AccordionItem>
        {paramsCount > 0 && (
          <AccordionItem title={'Paramètres applicatifs' + ` (${paramsCount})`} defaultOpen>
            {Object.entries(SCREENS_CONFIG).map(([page, screenConfig]) => (
              <React.Fragment key={page}>
                {page === selectedScreen
                  ? Object.entries(screenConfig).map(([name, config]) =>
                      renderScreenParam(name, config)
                    )
                  : null}
              </React.Fragment>
            ))}
          </AccordionItem>
        )}
        <AccordionItem title="Paramètres marketing" defaultOpen>
          {Object.entries(SCREENS_CONFIG).map(([page]) => (
            <React.Fragment key={page}>
              {page === selectedScreen
                ? Object.entries(MARKETING_CONFIG).map(([name, config]) =>
                    renderScreenParam(name, config)
                  )
                : null}
            </React.Fragment>
          ))}
        </AccordionItem>
        <AccordionItem title="Paramètres firebase dynamic link">
          {Object.keys(SCREENS_CONFIG).map((page) => (
            <React.Fragment key={page}>
              {page === selectedScreen
                ? Object.entries(FDL_CONFIG).map(([name, config]) =>
                    renderScreenParam(name, config)
                  )
                : null}
            </React.Fragment>
          ))}
        </AccordionItem>
      </Container>
      <BottomContainer>
        <ErrorContainer>
          <Warning />
          <Spacer.Row numberOfSpaces={2} />
          <ErrorText>{errorText}</ErrorText>
        </ErrorContainer>
        <ButtonPrimary wording="Générer le lien" disabled={disabled} onPress={onPress} />
      </BottomContainer>
    </React.Fragment>
  )
}

function extractParams(params: Record<string, unknown>) {
  const appParams: Record<string, unknown> = {}
  const marketingParams: Record<string, unknown> = {}
  const fdlParams: Record<string, unknown> = {}
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (paramName in FDL_CONFIG) fdlParams[paramName] = paramValue
    else if (paramName in MARKETING_CONFIG) marketingParams[paramName] = paramValue
    else {
      appParams[paramName] = paramValue
      // Force showResults for old versions compatibility
      if (paramName === 'view') appParams['showResults'] = 'true'
    }
  }
  return { appParams, marketingParams, fdlParams }
}

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
}))

const ErrorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ErrorText = styled(Typo.Caption)(({ theme }) => ({
  paddingVertical: getSpacing(1.5),
  color: theme.colors.error,
}))

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})

const BottomContainer = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})

const PaddingContainer = styled.View({
  padding: getSpacing(5),
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))

const Warning = styled(WarningDefault).attrs(({ theme }) => ({
  color: theme.colors.error,
  size: theme.icons.sizes.extraSmall,
}))``
