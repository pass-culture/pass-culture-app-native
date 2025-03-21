import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-raw-text'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    // <Text>string</Text>
    { code: '<Text>toto</Text>' },
    // <Typo.***>string</Typo.***>
    { code: '<Typo.Title1>toto</Typo.Title1>' },
    { code: '<Typo.Title2>toto</Typo.Title2>' },
    { code: '<Typo.Title3>toto</Typo.Title3>' },
    { code: '<Typo.Title4>toto</Typo.Title4>' },
    { code: '<Typo.Button>toto</Typo.Button>' },
    { code: '<Typo.Body>toto</Typo.Body>' },
    { code: '<Typo.BodyAccentXs>toto</Typo.BodyAccentXs>' },
    // <Styled***>string</Styled***>
    { code: '<StyledTitle1>toto</StyledTitle1>' },
    { code: '<StyledTitle2>toto</StyledTitle2>' },
    { code: '<StyledTitle3>toto</StyledTitle3>' },
    { code: '<StyledTitle4>toto</StyledTitle4>' },
    { code: '<StyledButtonText>toto</StyledButtonText>' },
    { code: '<StyledButtonTextNeutralInfo>toto</StyledButtonTextNeutralInfo>' },
    { code: '<StyledButtonTextPrimary>toto</StyledButtonTextPrimary>' },
    { code: '<StyledButtonTextSecondary>toto</StyledButtonTextSecondary>' },
    { code: '<StyledBody>toto</StyledBody>' },
    { code: '<StyledBodyAccent>toto</StyledBodyAccent>' },
    { code: '<StyledBodyAccentS>toto</StyledBodyAccentS>' },
    { code: '<StyledBodyAccentXs>toto</StyledBodyAccentXs>' },
    { code: '<StyledCaption>toto</StyledCaption>' },
    { code: '<StyledCaptionNeutralInfo>toto</StyledCaptionNeutralInfo>' },
    { code: '<StyledCaptionPrimary>toto</StyledCaptionPrimary>' },
    { code: '<StyledCaptionSecondary>toto</StyledCaptionSecondary>' },
    // <***Text>string</***Text>
    { code: '<CustomText>toto</CustomText>' },
    { code: '<TrucText>toto</TrucText>' },
    // <ParentsTag><Text>string</Text></ParentsTag>
    {
      code: `<React.Fragment>
    <Text>toto</Text>
    </React.Fragment>`,
    },
    {
      code: `<CustomTag>
    <Text>toto</Text>
    </CustomTag>`,
    },
  ],
  invalid: [
    { code: '<View>toto</View>' },
    { code: '<Button>toto</Button>' },
    { code: '<TextInput>toto</TextInput>' },
    { code: '<TextTruc>toto</TextTruc>' },
    { code: '<StyledTruc>toto</StyledTruc>' },
    { code: '<StyldBody>toto</StyldBody>' },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: `No raw text outside tags <Text>, <Typo.***>, <allowed JSX tag.***>. \n *** = all exported Typo in src/ui/theme/typography.tsx`,
      },
    ],
  })
)

ruleTester.run('no-raw-text', rule, tests)
