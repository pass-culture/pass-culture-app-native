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
      {visibleSiteMapLinks.flatMap((item) => {
        const parentJsx = (
          <Li
            key={item.wording}
            groupLabel="Plan du site"
            total={visibleSiteMapLinks.length}
            index={visibleSiteMapLinks.indexOf(item)}
            accessibilityLabel={item.wording}
            accessibilityRole={AccessibilityRole.BUTTON}>
            <ParentListItem wording={item.wording} navigateTo={item.navigateTo} />
          </Li>
        )

        const childrenJsx = item.subPages
          .filter((subPage) => !subPage.isLoggedIn || isLoggedIn)
          .map((subPage, idx) => (
            <Li
              key={subPage.wording}
              groupLabel={item.wording}
              index={idx}
              total={item.subPages.length}
              accessibilityLabel={subPage.wording}
              accessibilityRole={AccessibilityRole.BUTTON}>
              <SubPagesListItem wording={subPage.wording} navigateTo={subPage.navigateTo} />
            </Li>
          ))

        return [parentJsx, ...childrenJsx]
      })}
    </StyledVerticalUl>
  )
}
