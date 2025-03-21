import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'

export const CheatcodesScreenAccessibility = () => {
    const labelID = uuidv4()
    const checkboxID = uuidv4()
    const toggle = () => 'doNothing'

    return (
        <CheatcodesTemplateScreen title="Accessibility 🌈" flexDirection="column">
            <FilterSwitchLabelContainer gap={5}>
                <InputLabel htmlFor={checkboxID}>
                    <TypoDS.BodyAccent>Mode sombre</TypoDS.BodyAccent>
                </InputLabel>
                <FilterSwitch
                    checkboxID={checkboxID}
                    active={false}
                    toggle={toggle}
                    accessibilityLabelledBy={labelID}
                />
            </FilterSwitchLabelContainer>
        </CheatcodesTemplateScreen>
    )
}

const FilterSwitchLabelContainer = styled(ViewGap)({
    flexDirection: 'row',
    alignItems: 'center',
})
