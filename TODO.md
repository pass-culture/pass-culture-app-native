# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)

- [Guide de mise à jour](https://callstack.github.io/react-native-testing-library/docs/migration-v12)

---

## Tasks

- [ ] 8 tests natif ❌

  - [ ] src/features/auth/pages/signup/SignupForm.native.test.tsx
  - [ ] src/features/profile/pages/ConsentSettings/ConsentSettings.native.test.tsx
  - [ ] src/ui/components/**tests**/AccordionItem.native.test.tsx
  - [ ] src/features/home/pages/GenericHome.native.test.tsx
  - [ ] src/features/home/components/modules/video/VideoModal.native.test.tsx
  - [ ] src/features/home/components/modules/video/VideoPlayer.native.test.tsx
  - [ ] src/features/cookies/components/CookiesSettings.native.test.tsx
  - [ ] src/ui/components/touchable/**tests**/Touchable.native.test.tsx

- [ ] 1 test web ❌
  - [ ] src/features/cookies/helpers/setMarketingParams.test.ts

---

## Tasks for another US

- [ ]

```
Summary of all failing tests
 FAIL  src/features/auth/pages/signup/SignupForm.native.test.tsx (47.054 s, 228 MB heap size)
  ● Signup Form › should have accessibility label indicating current step and total steps

    Unable to find an element with text: Étape 1 sur 5

    [
      <View
        accessibilityRole="header"
      >
        <View />
        <View>
          <View>
            <View
              testID="back-button-container"
            >
              <View
                accessibilityLabel="Revenir en arrière"
                accessibilityRole="button"
                testID="Revenir en arrière"
              >
                <View
                  testID="icon-back"
                >
                  <Text>
                    icon-back-SVG-Mock
                  </Text>
                </View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Retour
                </Text>
              </View>
            </View>
            <Text>
              Inscription
            </Text>
            <View
              testID="close-button-container"
            />
          </View>
        </View>
        <Text
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
        >
          Étape 1 sur 5
        </Text>
        <View>
          <View>
            <View>
              <Text>
                undefined-SVG-Mock
              </Text>
            </View>
          </View>
        </View>
      </View>,
      <RCTScrollView>
        <View>
          <View />
          <View />
          <View>
            <Text>
              Crée-toi un compte
            </Text>
            <View />
            <View>
              <View>
                <View>
                  <Text>
                    Adresse e-mail
                  </Text>
                </View>
              </View>
              <View />
              <View
                testID="styled-input-container"
              >
                <TextInput
                  nativeID="testUuidV4"
                  placeholder="tonadresse@email.com"
                  testID="Entrée pour l’email"
                  value=""
                />
              </View>
            </View>
            <View />
            <View
              accessibilityLabel="J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture."
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                }
              }
              testID="J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture."
            >
              <View />
              <Text>
                J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture.
              </Text>
            </View>
            <View />
            <View />
            <View />
            <Text>
              Le pass Culture traite tes données pour la gestion de ton compte et pour l’inscription à la newsletter.
            </Text>
            <View />
            <View
              accessibilityLabel="Comment gérer tes données personnelles ?"
              testID="Comment gérer tes données personnelles ?"
            >
              <View>
                <View
                  accessibilityLabel="Nouvelle fenêtre"
                  testID="button-icon"
                >
                  <Text>
                    button-icon-SVG-Mock
                  </Text>
                </View>
              </View>
              <Text>
                Comment gérer tes données personnelles ?
              </Text>
            </View>
            <View />
            <View
              accessibilityLabel="Continuer vers l’étape Mot de passe"
              accessibilityState={
                {
                  "disabled": true,
                }
              }
              testID="Continuer vers l’étape Mot de passe"
            >
              <Text>
                Continuer
              </Text>
            </View>
            <View />
            <View>
              <Text>
                Déjà un compte ?
                <View />
                <View>
                  <View
                    accessibilityLabel="Se connecter"
                    accessibilityRole="link"
                    testID="Se connecter"
                  >
                    <View>
                      <View
                        testID="button-icon"
                      >
                        <Text>
                          button-icon-SVG-Mock
                        </Text>
                      </View>
                      <View />
                      <Text>
                        Se connecter
                      </Text>
                    </View>
                  </View>
                </View>
              </Text>
            </View>
            <View />
          </View>
        </View>
      </RCTScrollView>,
      <View>
        <BlurView />
      </View>,
    ]

      50 |     render(<SignupForm />)
      51 |
    > 52 |     expect(await screen.findByText('Étape 1 sur 5')).toBeTruthy()
         |                         ^
      53 |   })
      54 |
      55 |   describe('Quit button', () => {

      at Object.findByText (src/features/auth/pages/signup/SignupForm.native.test.tsx:52:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

 FAIL  src/features/profile/pages/ConsentSettings/ConsentSettings.native.test.tsx (15.991 s, 334 MB heap size)
  ● <ConsentSettings/> › should render correctly

    Unable to find an element with role: "checkbox"

    [
      <View
        accessibilityRole="header"
      >
        <View />
        <View>
          <View>
            <View
              testID="back-button-container"
            >
              <View
                accessibilityLabel="Revenir en arrière"
                accessibilityRole="button"
                testID="Revenir en arrière"
              >
                <View
                  testID="icon-back"
                >
                  <Text>
                    icon-back-SVG-Mock
                  </Text>
                </View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Retour
                </Text>
              </View>
            </View>
            <Text>
              Paramètres de confidentialité
            </Text>
            <View
              testID="close-button-container"
            />
          </View>
        </View>
      </View>,
      <RCTScrollView>
        <View>
          <View />
          <View />
          <Text>
            L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer ton expérience de navigation.
          </Text>
          <View />
          <Text>
            Tu peux choisir d’accepter ou non l’activation de leur suivi.
          </Text>
          <View />
          <Text>
            À quoi servent tes cookies et tes données ?
          </Text>
          <View />
          <View>
            <Text>
              Je choisis mes cookies
            </Text>
            <View>
              <Text>
                Tout accepter
              </Text>
              <View />
              <View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Case à cocher -
                  non cochée
                </Text>
                <View
                  accessibilityRole="checkbox"
                  accessibilityState={
                    {
                      "checked": false,
                      "disabled": false,
                    }
                  }
                  testID="Interrupteur Tout accepter"
                >
                  <View>
                    <View />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View />
          <View>
            <View>
              <View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Case à cocher -
                  non cochée
                </Text>
                <View
                  accessibilityRole="checkbox"
                  accessibilityState={
                    {
                      "checked": false,
                      "disabled": false,
                    }
                  }
                  testID="Interrupteur Personnaliser ta navigation"
                >
                  <View>
                    <View />
                  </View>
                </View>
              </View>
              <View />
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "expanded": false,
                }
              }
            >
              <View
                nativeID="testUuidV4"
              >
                <Text>
                  <Text>
                    Personnaliser ta navigation
                  </Text>
                </Text>
                <View
                  testID="accordionArrow"
                >
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            testID="accordionBody"
          >
            <View
              accessibilityLabelledBy="testUuidV4"
              nativeID="testUuidV4"
              style={
                {
                  "display": "none",
                }
              }
              testID="accordionBodyContainer"
            >
              <Text>
                Ces cookies nous permettent, en fonction de ta navigation, de te proposer des contenus supposés pertinents et susceptibles de t’intéresser.
              </Text>
              <View />
              <View>
                <View>
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
                <Text>
                  <View />
                  Sans ces cookies, nous ne pourrons pas te proposer des recommandations adaptées.
                </Text>
              </View>
            </View>
          </View>
          <View />
          <View>
            <View>
              <View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Case à cocher -
                  non cochée
                </Text>
                <View
                  accessibilityRole="checkbox"
                  accessibilityState={
                    {
                      "checked": false,
                      "disabled": false,
                    }
                  }
                  testID="Interrupteur Enregistrer des statistiques de navigation"
                >
                  <View>
                    <View />
                  </View>
                </View>
              </View>
              <View />
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "expanded": false,
                }
              }
            >
              <View
                nativeID="testUuidV4"
              >
                <Text>
                  <Text>
                    Enregistrer des statistiques de navigation
                  </Text>
                </Text>
                <View
                  testID="accordionArrow"
                >
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            testID="accordionBody"
          >
            <View
              accessibilityLabelledBy="testUuidV4"
              nativeID="testUuidV4"
              style={
                {
                  "display": "none",
                }
              }
              testID="accordionBodyContainer"
            >
              <Text>
                Ces cookies sont là pour nous aider à améliorer notre service grâce à des statistiques anonymes sur l’usage du pass Culture. Nous regardons par exemple les mots que tu tapes dans la barre de recherche pour définir des tendances et ainsi améliorer les résultats qui te sont proposés.
              </Text>
              <View />
              <View>
                <View>
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
                <Text>
                  <View />
                  Si tu désactives ces cookies, nous ne pourrons pas prendre en compte ton usage de l’application pour continuer à la créer au plus près de nos utilisateurs.
                </Text>
              </View>
            </View>
          </View>
          <View />
          <View>
            <View>
              <View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Case à cocher -
                  non cochée
                </Text>
                <View
                  accessibilityRole="checkbox"
                  accessibilityState={
                    {
                      "checked": false,
                      "disabled": false,
                    }
                  }
                  testID="Interrupteur Mesurer l’efficacité de nos publicités"
                >
                  <View>
                    <View />
                  </View>
                </View>
              </View>
              <View />
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "expanded": false,
                }
              }
            >
              <View
                nativeID="testUuidV4"
              >
                <Text>
                  <Text>
                    Mesurer l’efficacité de nos publicités
                  </Text>
                </Text>
                <View
                  testID="accordionArrow"
                >
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            testID="accordionBody"
          >
            <View
              accessibilityLabelledBy="testUuidV4"
              nativeID="testUuidV4"
              style={
                {
                  "display": "none",
                }
              }
              testID="accordionBodyContainer"
            >
              <Text>
                Tu ne verras pas de publicité de tiers sur notre site ou sur notre application.
              </Text>
              <View />
              <View>
                <View>
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
                <Text>
                  <View />
                  En revanche, nous faisons de la publicité sur les réseaux sociaux pour faire connaître le pass Culture auprès du plus grand nombre. Grâce à ces cookies, nous pourrons en estimer l’efficacité.
                </Text>
              </View>
            </View>
          </View>
          <View />
          <View>
            <View>
              <View>
                <Text
                  style={
                    {
                      "display": "none",
                    }
                  }
                >
                  Case à cocher -
                  cochée
                </Text>
                <View
                  accessibilityRole="checkbox"
                  accessibilityState={
                    {
                      "checked": true,
                      "disabled": true,
                    }
                  }
                  testID="Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs"
                >
                  <View>
                    <View>
                      <View
                        accessibilityLabel="Désactivé"
                      >
                        <Text>
                          undefined-SVG-Mock
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View />
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "expanded": false,
                }
              }
            >
              <View
                nativeID="testUuidV4"
              >
                <Text>
                  <Text>
                    Assurer la sécurité, prévenir la fraude et corriger les bugs
                  </Text>
                </Text>
                <View
                  testID="accordionArrow"
                >
                  <View>
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            testID="accordionBody"
          >
            <View
              accessibilityLabelledBy="testUuidV4"
              nativeID="testUuidV4"
              style={
                {
                  "display": "none",
                }
              }
              testID="accordionBodyContainer"
            >
              <Text>
                Nous enregistrons par exemple ton consentement ou non aux autres cookies pour ne pas te le redemander. Ils te permettent aussi de rester connecté et d’assurer la sécurité de l’application.
              </Text>
            </View>
          </View>
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              Nous ne demandons pas ton consentement pour ces cookies car ils sont obligatoires pour le bon fonctionnement du pass Culture.
            </Text>
          </View>
          <View />
          <View />
          <View />
          <Text>
            Tu as la main dessus
          </Text>
          <View />
          <Text>
            Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.
          </Text>
          <View />
          <Text>
            On te redemandera bien sûr ton consentement si notre politique évolue.
          </Text>
          <View />
          <Text>
            Pour plus d’informations, nous t’invitons à consulter notre
            <View />
            <View>
              <View
                accessibilityLabel="Politique de gestion des cookies"
                accessibilityRole="link"
                testID="Politique de gestion des cookies"
              >
                <View>
                  <View
                    accessibilityLabel="Nouvelle fenêtre"
                    testID="button-icon"
                  >
                    <Text>
                      button-icon-SVG-Mock
                    </Text>
                  </View>
                  <View />
                  <Text>
                    Politique de gestion des cookies
                  </Text>
                </View>
              </View>
            </View>
          </Text>
          <View />
          <View
            accessibilityLabel="Enregistrer mes choix"
            testID="Enregistrer mes choix"
          >
            <Text>
              Enregistrer mes choix
            </Text>
          </View>
          <View />
          <View />
        </View>
      </RCTScrollView>,
      <View>
        <BlurView />
      </View>,
    ]

      38 |     const renderAPI = renderConsentSettings()
      39 |
    > 40 |     await screen.findAllByRole('checkbox')
         |                  ^
      41 |     expect(renderAPI).toMatchSnapshot()
      42 |   })
      43 |

      at Object.findAllByRole (src/features/profile/pages/ConsentSettings/ConsentSettings.native.test.tsx:40:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

 FAIL  src/ui/components/__tests__/AccordionItem.native.test.tsx (9.187 s, 269 MB heap size)
  ● AccordionItem › we see the children after pressing on the title

    Unable to find an element with testID: accordionBodyContainer

    [
      <View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              accordion title
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <View
            testID="accordion-child-view"
          />
        </View>
      </View>,
    ]

      22 |     const accordion = renderAccordion()
      23 |     const accordionBody = accordion.getByTestId('accordionBody')
    > 24 |     const accordionBodyContainer = accordion.getByTestId('accordionBodyContainer')
         |                                              ^
      25 |     expect(accordionBody.props.style).toEqual({ height: 0, overflow: 'hidden' })
      26 |     expect(accordion.getByRole('button').props.accessibilityState.expanded).toBeFalsy()
      27 |

      at Object.getByTestId (src/ui/components/__tests__/AccordionItem.native.test.tsx:24:46)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

 FAIL  src/features/home/pages/GenericHome.native.test.tsx (15.424 s, 341 MB heap size)
  ● GenericHome page - Analytics › should display spinner when end is reached

    Oh no! Your test called the following console method:
      * error (2 calls)
        > Call 0: "Warning: An update to %s inside a test was not wrapped in act(...)...., "OnlineHome", "...
        > Call 1: "Warning: An update to %s inside a test was not wrapped in act(...)...., "OnlineHome", "...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/home/components/modules/video/VideoModal.native.test.tsx (25.004 s, 318 MB heap size)
  ● VideoModal › should render correctly if modal visible

    thrown: "Exceeded timeout of 10000 ms for a test.
    Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

      14 |
      15 | describe('VideoModal', () => {
    > 16 |   it('should render correctly if modal visible', async () => {
         |   ^
      17 |     renderVideoModal()
      18 |
      19 |     await waitFor(() => {

      at it (src/features/home/components/modules/video/VideoModal.native.test.tsx:16:3)
      at Object.describe (src/features/home/components/modules/video/VideoModal.native.test.tsx:15:1)

 FAIL  src/features/home/components/modules/video/VideoPlayer.native.test.tsx (13.452 s, 275 MB heap size)
  ● VideoPlayer › should render error view when showErrorView is true

    expect(received).not.toBeNull()

    Received: null

      24 |     )
      25 |
    > 26 |     expect(errorMessage).not.toBeNull()
         |                              ^
      27 |   })
      28 |
      29 |   it('should not render error view when showErrorView is false', async () => {

      at Object.toBeNull (src/features/home/components/modules/video/VideoPlayer.native.test.tsx:26:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

 FAIL  src/features/cookies/components/CookiesSettings.native.test.tsx (16.306 s, 278 MB heap size)
  ● <CookiesSettings/> › should render correctly

    Unable to find an element with role: "checkbox"

    [
      <Text>
        À quoi servent tes cookies et tes données ?
      </Text>,
      <View />,
      <View>
        <Text>
          Je choisis mes cookies
        </Text>
        <View>
          <Text>
            Tout accepter
          </Text>
          <View />
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Tout accepter"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Personnaliser ta navigation"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Personnaliser ta navigation
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Ces cookies nous permettent, en fonction de ta navigation, de te proposer des contenus supposés pertinents et susceptibles de t’intéresser.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              Sans ces cookies, nous ne pourrons pas te proposer des recommandations adaptées.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Enregistrer des statistiques de navigation"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Enregistrer des statistiques de navigation
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Ces cookies sont là pour nous aider à améliorer notre service grâce à des statistiques anonymes sur l’usage du pass Culture. Nous regardons par exemple les mots que tu tapes dans la barre de recherche pour définir des tendances et ainsi améliorer les résultats qui te sont proposés.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              Si tu désactives ces cookies, nous ne pourrons pas prendre en compte ton usage de l’application pour continuer à la créer au plus près de nos utilisateurs.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Mesurer l’efficacité de nos publicités"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Mesurer l’efficacité de nos publicités
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Tu ne verras pas de publicité de tiers sur notre site ou sur notre application.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              En revanche, nous faisons de la publicité sur les réseaux sociaux pour faire connaître le pass Culture auprès du plus grand nombre. Grâce à ces cookies, nous pourrons en estimer l’efficacité.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": true,
                  "disabled": true,
                }
              }
              testID="Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs"
            >
              <View>
                <View>
                  <View
                    accessibilityLabel="Désactivé"
                  >
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Assurer la sécurité, prévenir la fraude et corriger les bugs
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Nous enregistrons par exemple ton consentement ou non aux autres cookies pour ne pas te le redemander. Ils te permettent aussi de rester connecté et d’assurer la sécurité de l’application.
          </Text>
        </View>
      </View>,
      <View>
        <View>
          <View>
            <Text>
              undefined-SVG-Mock
            </Text>
          </View>
        </View>
        <Text>
          <View />
          Nous ne demandons pas ton consentement pour ces cookies car ils sont obligatoires pour le bon fonctionnement du pass Culture.
        </Text>
      </View>,
      <View />,
      <View />,
    ]

      14 |     const renderAPI = renderCookiesSettings()
      15 |
    > 16 |     await screen.findAllByRole('checkbox')
         |                  ^
      17 |
      18 |     expect(renderAPI).toMatchSnapshot()
      19 |   })

      at Object.findAllByRole (src/features/cookies/components/CookiesSettings.native.test.tsx:16:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

  ● <CookiesSettings/> › should disable and check essential cookies switch

    Unable to find an element with role: "checkbox"

    [
      <Text>
        À quoi servent tes cookies et tes données ?
      </Text>,
      <View />,
      <View>
        <Text>
          Je choisis mes cookies
        </Text>
        <View>
          <Text>
            Tout accepter
          </Text>
          <View />
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Tout accepter"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Personnaliser ta navigation"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Personnaliser ta navigation
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Ces cookies nous permettent, en fonction de ta navigation, de te proposer des contenus supposés pertinents et susceptibles de t’intéresser.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              Sans ces cookies, nous ne pourrons pas te proposer des recommandations adaptées.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Enregistrer des statistiques de navigation"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Enregistrer des statistiques de navigation
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Ces cookies sont là pour nous aider à améliorer notre service grâce à des statistiques anonymes sur l’usage du pass Culture. Nous regardons par exemple les mots que tu tapes dans la barre de recherche pour définir des tendances et ainsi améliorer les résultats qui te sont proposés.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              Si tu désactives ces cookies, nous ne pourrons pas prendre en compte ton usage de l’application pour continuer à la créer au plus près de nos utilisateurs.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              non cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": false,
                  "disabled": false,
                }
              }
              testID="Interrupteur Mesurer l’efficacité de nos publicités"
            >
              <View>
                <View />
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Mesurer l’efficacité de nos publicités
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Tu ne verras pas de publicité de tiers sur notre site ou sur notre application.
          </Text>
          <View />
          <View>
            <View>
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
            <Text>
              <View />
              En revanche, nous faisons de la publicité sur les réseaux sociaux pour faire connaître le pass Culture auprès du plus grand nombre. Grâce à ces cookies, nous pourrons en estimer l’efficacité.
            </Text>
          </View>
        </View>
      </View>,
      <View />,
      <View>
        <View>
          <View>
            <Text
              style={
                {
                  "display": "none",
                }
              }
            >
              Case à cocher -
              cochée
            </Text>
            <View
              accessibilityRole="checkbox"
              accessibilityState={
                {
                  "checked": true,
                  "disabled": true,
                }
              }
              testID="Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs"
            >
              <View>
                <View>
                  <View
                    accessibilityLabel="Désactivé"
                  >
                    <Text>
                      undefined-SVG-Mock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "expanded": false,
            }
          }
        >
          <View
            nativeID="testUuidV4"
          >
            <Text>
              <Text>
                Assurer la sécurité, prévenir la fraude et corriger les bugs
              </Text>
            </Text>
            <View
              testID="accordionArrow"
            >
              <View>
                <Text>
                  undefined-SVG-Mock
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>,
      <View
        testID="accordionBody"
      >
        <View
          accessibilityLabelledBy="testUuidV4"
          nativeID="testUuidV4"
          style={
            {
              "display": "none",
            }
          }
          testID="accordionBodyContainer"
        >
          <Text>
            Nous enregistrons par exemple ton consentement ou non aux autres cookies pour ne pas te le redemander. Ils te permettent aussi de rester connecté et d’assurer la sécurité de l’application.
          </Text>
        </View>
      </View>,
      <View>
        <View>
          <View>
            <Text>
              undefined-SVG-Mock
            </Text>
          </View>
        </View>
        <Text>
          <View />
          Nous ne demandons pas ton consentement pour ces cookies car ils sont obligatoires pour le bon fonctionnement du pass Culture.
        </Text>
      </View>,
      <View />,
      <View />,
    ]

      22 |     renderCookiesSettings()
      23 |
    > 24 |     await screen.findAllByRole('checkbox')
         |                  ^
      25 |
      26 |     const essentialToggle = screen.getByTestId(
      27 |       'Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs'

      at Object.findAllByRole (src/features/cookies/components/CookiesSettings.native.test.tsx:24:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:32:7
      at tryCallTwo (node_modules/react-native/node_modules/promise/lib/core.js:45:5)
      at doResolve (node_modules/react-native/node_modules/promise/lib/core.js:200:13)
      at new Promise (node_modules/react-native/node_modules/promise/lib/core.js:66:3)
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:21:12)

 FAIL  src/ui/components/touchable/__tests__/Touchable.native.test.tsx (13.034 s, 285 MB heap size)
  ● <Touchable /> › should execute callback on press

    Unable to find an element with role: "button"

    <View
      accessibilityRole="button"
    >
      <Text>
        Touchable content
      </Text>
    </View>

      15 |     )
      16 |
    > 17 |     const button = getByRole('button')
         |                    ^
      18 |     fireEvent.press(button)
      19 |
      20 |     expect(handleClick).toHaveBeenCalledTimes(1)

      at Object.getByRole (src/ui/components/touchable/__tests__/Touchable.native.test.tsx:17:20)


Test Suites: 8 failed, 680 passed, 688 total
Tests:       9 failed, 9 skipped, 4566 passed, 4584 total
Snapshots:   270 passed, 270 total
Time:        901.789 s
```
