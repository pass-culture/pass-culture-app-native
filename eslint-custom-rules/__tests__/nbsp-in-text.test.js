import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../nbsp-in-text'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    // \u00a0 for 'myText !' with characters !, ?, :, » and €
    { code: `'myText\\u00a0!'` },
    // \u00a0 for '« myText'
    { code: `'«\\u00a0myText'` },
    // \u00a0 for `myText !` with characters !, ?, :, » and €
    { code: `\`myText\\u00a0!\`` },
    // \u00a0 for `« myText`
    { code: `\`«\\u00a0myText\`` },
    // &nbsp; for "myText !" with characters !, ?, :, » and €
    { code: `"myText&nbsp;!"` },
    // &nbsp; for "« myText"
    { code: `"«&nbsp;myText"` },
    // &nbsp; for <Text>myText !</Text> with characters !, ?, :, » and €
    { code: '<Text>myText&nbsp;!</Text>' },
    // &nbsp; for <Text>« myText</Text>
    { code: '<Text>«&nbsp;myText</Text>' },
  ],
  invalid: [
    // TODO(PC-21172): Add invalid tests (https://passculture.atlassian.net/browse/PC-21172)
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('nbsp-in-text', rule, tests)
