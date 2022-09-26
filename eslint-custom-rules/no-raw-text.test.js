import { RuleTester } from 'eslint'

import rule from './no-raw-text'

const ruleTester = new RuleTester()

const config = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: [['estree', { classFeatures: true }], 'jsx'],
      },
    },
  },
}

const tests = {
  valid: [
    // <Text>string</Text>
    { code: '<Text>toto</Text>' },
    // <Typo.***>string</Typo.***>
    { code: '<Typo.Hero>toto</Typo.Hero>' },
    { code: '<Typo.Title1>toto</Typo.Title1>' },
    { code: '<Typo.Title2>toto</Typo.Title2>' },
    { code: '<Typo.Title3>toto</Typo.Title3>' },
    { code: '<Typo.Title4>toto</Typo.Title4>' },
    { code: '<Typo.ButtonText>toto</Typo.ButtonText>' },
    { code: '<Typo.ButtonTextNeutralInfo>toto</Typo.ButtonTextNeutralInfo>' },
    { code: '<Typo.ButtonTextPrimary>toto</Typo.ButtonTextPrimary>' },
    { code: '<Typo.ButtonTextSecondary>toto</Typo.ButtonTextSecondary>' },
    { code: '<Typo.Body>toto</Typo.Body>' },
    { code: '<Typo.Caption>toto</Typo.Caption>' },
    { code: '<Typo.CaptionPrimary>toto</Typo.CaptionPrimary>' },
    { code: '<Typo.CaptionSecondary>toto</Typo.CaptionSecondary>' },
    // <Styled***>string</Styled***>
    { code: '<StyledHero>toto</StyledHero>' },
    { code: '<StyledTitle1>toto</StyledTitle1>' },
    { code: '<StyledTitle2>toto</StyledTitle2>' },
    { code: '<StyledTitle3>toto</StyledTitle3>' },
    { code: '<StyledTitle4>toto</StyledTitle4>' },
    { code: '<StyledButtonText>toto</StyledButtonText>' },
    { code: '<StyledButtonTextNeutralInfo>toto</StyledButtonTextNeutralInfo>' },
    { code: '<StyledButtonTextPrimary>toto</StyledButtonTextPrimary>' },
    { code: '<StyledButtonTextSecondary>toto</StyledButtonTextSecondary>' },
    { code: '<StyledBody>toto</StyledBody>' },
    { code: '<StyledCaption>toto</StyledCaption>' },
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
        message: `No raw text outside tags <Text>, <Typo.***>, <Styled***> or tag with prefix 'Text'. \n *** = all exported Typo in src/ui/theme/typography.tsx`,
      },
    ],
  })
)

ruleTester.run('no-raw-text', rule, tests)
