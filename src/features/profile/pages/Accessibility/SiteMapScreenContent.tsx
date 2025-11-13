import React from 'react'

import {
  ParentListItem,
  StyledVerticalUl,
  SubPagesListItem,
} from 'features/profile/pages/Accessibility/SiteMapScreen'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Li } from 'ui/components/Li'

export const SiteMapScreenContent = ({ visibleSiteMapLinks, isLoggedIn }) => {
  return (
    <StyledVerticalUl>
      {visibleSiteMapLinks.map((item, parentIdx) => {
        const visibleSubPages = item.subPages.filter((subPage) => !subPage.isLoggedIn || isLoggedIn)
        return (
          <React.Fragment key={item.wording}>
            <Li
              groupLabel="Plan du site"
              total={visibleSiteMapLinks.length}
              index={parentIdx}
              accessibilityLabel={item.wording}
              accessibilityRole={AccessibilityRole.BUTTON}>
              <ParentListItem wording={item.wording} navigateTo={item.navigateTo} />
            </Li>
            {visibleSubPages.length > 0 ? (
              <StyledVerticalUl>
                {visibleSubPages.map((subPage, idx) => {
                  return (
                    <Li
                      key={subPage.wording}
                      groupLabel={item.wording}
                      total={visibleSubPages.length}
                      index={idx}
                      accessibilityLabel={subPage.wording}
                      accessibilityRole={AccessibilityRole.BUTTON}>
                      <SubPagesListItem wording={subPage.wording} navigateTo={subPage.navigateTo} />
                    </Li>
                  )
                })}
              </StyledVerticalUl>
            ) : null}
          </React.Fragment>
        )
      })}
    </StyledVerticalUl>
  )
}
