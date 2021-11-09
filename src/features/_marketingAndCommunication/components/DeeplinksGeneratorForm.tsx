import { t } from '@lingui/macro'
import omit from 'lodash.omit'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import {
  FDL_CONFIG,
  MARKETING_CONFIG,
  SCREENS_CONFIG,
} from 'features/_marketingAndCommunication/config/deeplinksExportConfig'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { ScreenNames } from 'features/navigation/RootNavigator'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { getWebappOfferUrl } from 'features/offer/services/useShareOffer'
import { getWebappVenueUrl } from 'features/venue/services/useShareVenue'
import { env, useWebAppUrl } from 'libs/environment'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { RadioButton } from 'ui/components/RadioButton'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export type paramConfig = {
  type: 'string'
  required?: boolean
  description?: string
  serverValidator?: (value: string) => Promise<unknown>
}

export type ScreenConfig = Record<string, paramConfig | boolean>

function getScreenConfig(screenName: ScreenNames) {
  let screenConfig = undefined
  Object.entries(SCREENS_CONFIG).forEach(([page, config]) => {
    if (page === screenName) {
      screenConfig = config
    }
  })
  return (screenConfig as unknown) as ScreenConfig
}

function isPrivateConfig(name: string) {
  return name.startsWith('_')
}

export interface GeneratedDeeplink {
  universalLink: string
  firebaseLink: string
}

interface Props {
  onCreate: (generatedDeeplink: GeneratedDeeplink) => void
}

export const DeeplinksGeneratorForm = ({ onCreate }: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<ScreenNames>('Offer')
  const [screenParams, setScreenParams] = useState({})
  const { showErrorSnackBar } = useSnackBarContext()
  const oflBaseUrl = useWebAppUrl()

  const renderScreenItem = (screenName: ScreenNames) => {
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

  const renderScreenParam = (name: string, config: paramConfig) => {
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
              // @ts-ignore find why typescript can't get this
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

  function validate(selectedScreen: ScreenNames, screenParams: Record<string, string>) {
    let valid = true
    const screenConfig = getScreenConfig(selectedScreen)
    Object.entries(screenConfig).forEach(([name, paramCfg]) => {
      if (!isPrivateConfig(name) && (paramCfg as paramConfig).required && !screenParams[name]) {
        valid = false
      }
    })
    return valid
  }

  function onPress() {
    const isValid = validate(selectedScreen, screenParams)
    if (!isValid) return
    const screenConfig = getScreenConfig(selectedScreen)
    let screenPathArguments = {
      screen: selectedScreen,
      params: screenParams,
    }

    if (screenConfig._tabNav) {
      // @ts-ignore cast was too long to write
      const tabNavConfig = getTabNavConfig(selectedScreen as any, screenParams as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      screenPathArguments = {
        screen: tabNavConfig[0],
        params: tabNavConfig[1],
      }
    }

    const fdlParams: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
    const otherParams: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
    Object.entries(screenPathArguments.params).forEach(([paramKey, paramValue]) => {
      Object.keys(FDL_CONFIG).forEach((fdlParamKey) => {
        if (paramKey !== fdlParamKey) {
          otherParams[paramKey] = paramValue
        } else {
          fdlParams[paramKey] = paramValue
        }
      })
    })

    // TODO: remove this block when settings.isWebappV2Enabled in production
    if (oflBaseUrl?.includes(env.WEBAPP_V2_DOMAIN)) {
      if (selectedScreen === 'Offer') {
        fdlParams.ofl = getWebappOfferUrl(otherParams.id, oflBaseUrl)
      } else if (selectedScreen === 'Venue') {
        fdlParams.ofl = getWebappVenueUrl(otherParams.id, oflBaseUrl)
      }
    }

    const screenPath = getScreenPath(screenPathArguments.screen, otherParams)

    const universalLink = `https://${env.WEBAPP_V2_DOMAIN}${screenPath}`
    const firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)

    onCreate({
      universalLink,
      firebaseLink,
    })
  }

  const paramsCount = useMemo(() => {
    const screenConfig = getScreenConfig(selectedScreen)
    let count = 0
    Object.keys(screenConfig).forEach((name) => {
      if (!isPrivateConfig(name)) {
        count += 1
      }
    })
    return count
  }, [selectedScreen])

  const disabled = !validate(selectedScreen, screenParams)

  useEnterKeyAction(!disabled ? onPress : undefined)

  return (
    <React.Fragment>
      <Container>
        <TitleContainer>{t`Besoin d'un lien ?`}</TitleContainer>
        <Spacer.Column numberOfSpaces={6} />
        <AccordionItem title={t`Pages`} defaultOpen>
          {Object.keys(SCREENS_CONFIG).map((key) => renderScreenItem(key as ScreenNames))}
        </AccordionItem>
        {paramsCount > 0 && (
          <AccordionItem title={t`Paramètres applicatifs` + ` (${paramsCount})`} defaultOpen>
            {Object.entries(SCREENS_CONFIG).map(([page, config]) => (
              <React.Fragment key={page}>
                {page === selectedScreen
                  ? Object.entries(config).map(([name, config]) =>
                      !isPrivateConfig(name) ? renderScreenParam(name, config as paramConfig) : null
                    )
                  : null}
              </React.Fragment>
            ))}
          </AccordionItem>
        )}
        <AccordionItem title={t`Paramètres marketing`} defaultOpen>
          {Object.entries(SCREENS_CONFIG).map(([page, config]) => (
            <React.Fragment key={page}>
              {page === selectedScreen && config._utms
                ? Object.entries(MARKETING_CONFIG).map(([name, config]) =>
                    !isPrivateConfig(name) ? renderScreenParam(name, config as paramConfig) : null
                  )
                : null}
            </React.Fragment>
          ))}
        </AccordionItem>
        <AccordionItem title={t`Paramètres firebase dynamic link`}>
          {Object.entries(SCREENS_CONFIG).map(([page, config]) => (
            <React.Fragment key={page}>
              {page === selectedScreen && config._utms
                ? Object.entries(FDL_CONFIG).map(([name, config]) =>
                    !isPrivateConfig(name) ? renderScreenParam(name, config as paramConfig) : null
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
