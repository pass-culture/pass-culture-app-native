import { t } from '@lingui/macro'
import omit from 'lodash.omit'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import {
  FDL_CONFIG,
  MARKETING_CONFIG,
  SCREENS_CONFIG,
  ScreensUsedByMarketing,
  ParamConfig,
} from 'features/_marketingAndCommunication/config/deeplinksExportConfig'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { isTabScreen } from 'features/navigation/TabBar/routes'
import { humanizeId } from 'features/offer/services/dehumanizeId'
import { getOfferUrl } from 'features/offer/services/useShareOffer'
import { getVenueUrl } from 'features/venue/services/useShareVenue'
import { env, useWebAppUrl, WEBAPP_V2_URL } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { RadioButton } from 'ui/components/RadioButton'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export interface GeneratedDeeplink {
  universalLink: string
  firebaseLink: string
}

interface Props {
  onCreate: (generatedDeeplink: GeneratedDeeplink) => void
}

function getWebappOfferUrl(offerId: number, webAppUrl: string) {
  if (webAppUrl === WEBAPP_V2_URL) return getOfferUrl(offerId)
  if (webAppUrl === env.WEBAPP_URL) return `${webAppUrl}/accueil/details/${humanizeId(offerId)}`
  throw new MonitoringError(
    `webAppUrl=${webAppUrl} should be equal to WEBAPP_V2_URL=${WEBAPP_V2_URL} or env.WEBAPP_URL=${env.WEBAPP_URL}`
  )
}

function getWebappVenueUrl(venueId: number, webAppUrl: string) {
  if (webAppUrl === WEBAPP_V2_URL) return getVenueUrl(venueId)
  if (webAppUrl === env.WEBAPP_URL) return `${webAppUrl}/${getScreenPath('Venue', { id: venueId })}`
  throw new MonitoringError(
    `webAppUrl=${webAppUrl} should be equal to WEBAPP_V2_URL=${WEBAPP_V2_URL} or env.WEBAPP_URL=${env.WEBAPP_URL}`
  )
}

export const DeeplinksGeneratorForm = ({ onCreate }: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<ScreensUsedByMarketing>('Offer')
  const [screenParams, setScreenParams] = useState<Record<string, string>>({})

  const { showErrorSnackBar } = useSnackBarContext()
  const oflBaseUrl = useWebAppUrl()

  const renderScreenItem = (screenName: ScreensUsedByMarketing) => {
    return (
      <React.Fragment key={screenName}>
        <Spacer.Column numberOfSpaces={2} />
        <RadioButton
          id={screenName}
          title={screenName}
          onSelect={() => {
            setSelectedScreen(screenName)
            setScreenParams({})
          }}
          selectedValue={selectedScreen}
        />
        <Spacer.Column numberOfSpaces={2} />
        <Separator />
      </React.Fragment>
    )
  }

  const renderScreenParam = (name: string, config: ParamConfig) => {
    function validate(value: string) {
      if (config.serverValidator) {
        config.serverValidator(value).catch((error) => {
          showErrorSnackBar({
            message: `${name} invalide : ${error.message}`,
            timeout: SNACK_BAR_TIME_OUT,
          })
        })
      }
    }

    return (
      <React.Fragment key={name}>
        <Spacer.Column numberOfSpaces={2} />
        {config.type === 'string' && (
          <TextInput
            placeholder={config.required ? `${name} (*)` : name}
            onBlur={() => {
              const value: string = screenParams[name]
              !!value && validate(value)
            }}
            onChangeText={(text) =>
              setScreenParams((prevPageParams) =>
                text.length === 0
                  ? omit(prevPageParams, name)
                  : {
                      ...prevPageParams,
                      [name]: text,
                    }
              )
            }
          />
        )}
        {!!config.description && (
          <DescriptionContainer>
            <Typo.Caption color={ColorsEnum.GREY_MEDIUM}>{config.description}</Typo.Caption>
          </DescriptionContainer>
        )}
        <Separator />
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

    // TODO: remove this block when settings.isWebappV2Enabled in production
    if (oflBaseUrl?.includes(env.WEBAPP_V2_DOMAIN)) {
      if (selectedScreen === 'Offer') {
        const offerId = Number(appParams.id)
        fdlParams.ofl = getWebappOfferUrl(offerId, oflBaseUrl)
      } else if (selectedScreen === 'Venue') {
        const venueId = Number(appParams.id)
        fdlParams.ofl = getWebappVenueUrl(venueId, oflBaseUrl)
      }
    }

    let screenPath = getScreenPath(selectedScreen, appAndMarketingParams)
    if (isTabScreen(selectedScreen)) {
      const tabNavConfig = getTabNavConfig(selectedScreen, appAndMarketingParams)
      screenPath = getScreenPath(...tabNavConfig)
    }

    const universalLink = `https://${env.WEBAPP_V2_DOMAIN}${screenPath}`
    const firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)

    onCreate({ universalLink, firebaseLink })
  }

  const paramsCount = useMemo(() => {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    return Object.keys(screenConfig).length
  }, [selectedScreen])

  const disabled = !areAllParamsValid()

  useEnterKeyAction(!disabled ? onPress : undefined)

  return (
    <React.Fragment>
      <Container>
        <TitleContainer>{t`Besoin d'un lien ?`}</TitleContainer>
        <Spacer.Column numberOfSpaces={6} />
        <AccordionItem title={t`Pages`} defaultOpen>
          {Object.keys(SCREENS_CONFIG).map((key) =>
            renderScreenItem(key as ScreensUsedByMarketing)
          )}
        </AccordionItem>
        {paramsCount > 0 && (
          <AccordionItem title={t`Paramètres applicatifs` + ` (${paramsCount})`} defaultOpen>
            {Object.entries(SCREENS_CONFIG).map(([page, config]) => (
              <React.Fragment key={page}>
                {page === selectedScreen
                  ? Object.entries(config).map(([name, config]) => renderScreenParam(name, config))
                  : null}
              </React.Fragment>
            ))}
          </AccordionItem>
        )}
        <AccordionItem title={t`Paramètres marketing`} defaultOpen>
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
        <AccordionItem title={t`Paramètres firebase dynamic link`}>
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
        <Banner color={ColorsEnum.ERROR}>
          <Warning color={ColorsEnum.ERROR} size={getSpacing(3.5)} />
          {t`Seulement les "ids" disposent de validation !`}
        </Banner>
        <ButtonPrimary title={t`Générer le lien`} disabled={disabled} onPress={onPress} />
      </BottomContainer>
    </React.Fragment>
  )
}

function extractParams(params: Record<string, string>) {
  const appParams: Record<string, string> = {}
  const marketingParams: Record<string, string> = {}
  const fdlParams: Record<string, string> = {}
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (paramName in FDL_CONFIG) fdlParams[paramName] = paramValue
    else if (paramName in MARKETING_CONFIG) marketingParams[paramName] = paramValue
    else appParams[paramName] = paramValue
  }
  return { appParams, marketingParams, fdlParams }
}

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
}))

const Banner = styled(Typo.Caption)({
  paddingVertical: getSpacing(1.5),
})

const TitleContainer = styled(Typo.Title4)({
  textAlign: 'center',
})

const BottomContainer = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})

const DescriptionContainer = styled.View({
  padding: getSpacing(5),
})
