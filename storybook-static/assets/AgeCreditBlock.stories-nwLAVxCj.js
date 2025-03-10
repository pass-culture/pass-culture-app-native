import{j as e}from"./jsx-runtime-BiHFnIch.js";import{R as x}from"./index-CsVCrh6D.js";import{s as O,g as h,T as n,S as c}from"./grid-C-3QDytX.js";import{C as s}from"./enums-BvOyAU8C.js";import{A as t}from"./AgeCreditBlock-CEEux-2e.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./CreditBlock-8aNllW7T.js";import"./CreditStatusTag-Lr6EGSJP.js";import"./index-D7eVwUcm.js";import"./index-BUG6N09H.js";import"./index-BPaTxB0G.js";import"./styled-components.browser.esm-DFuWokAj.js";const j=2,F={title:"features/tutorial/AgeCreditBlock",component:t,parameters:{chromatic:{delay:j}}},N=O.View({padding:h(6),justifyContent:"center"}),y=O(n.Title3)(({theme:r})=>({color:r.colors.secondary})),i={render:r=>e.jsx(t,{...r}),args:{age:18,creditStatus:s.ONGOING,children:e.jsx(y,{children:"300 €"})}},o={render:r=>e.jsx(t,{...r}),args:{children:e.jsxs(x.Fragment,{children:[e.jsx(n.Title3,{children:"300 €"}),e.jsx(c.Column,{numberOfSpaces:2}),e.jsx(n.Body,{children:"Tu auras 2 ans pour utiliser tes 300 €"})]}),age:18,creditStatus:s.COMING}},a={render:r=>e.jsxs(N,{children:[e.jsx(t,{...r,creditStatus:s.GONE,children:e.jsx(n.Title3,{children:"30 €"})}),e.jsx(c.Column,{numberOfSpaces:.5}),e.jsx(t,{...r}),e.jsx(c.Column,{numberOfSpaces:.5}),e.jsx(t,{...r,creditStatus:s.COMING,children:e.jsx(n.Title3,{children:"30 €"})})]}),args:{children:e.jsx(y,{children:"30 €"}),age:17,creditStatus:s.ONGOING}};var d,p,l;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: props => <AgeCreditBlock {...props} />,
  args: {
    age: 18,
    creditStatus: CreditStatus.ONGOING,
    children: <StyledTitle3>300&nbsp;€</StyledTitle3>
  }
}`,...(l=(p=i.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var m,u,S;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: props => <AgeCreditBlock {...props} />,
  args: {
    children: <React.Fragment>
        <TypoDS.Title3>300&nbsp;€</TypoDS.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <TypoDS.Body>Tu auras 2 ans pour utiliser tes 300&nbsp;€</TypoDS.Body>
      </React.Fragment>,
    age: 18,
    creditStatus: CreditStatus.COMING
  }
}`,...(S=(u=o.parameters)==null?void 0:u.docs)==null?void 0:S.source}}};var g,C,T;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: props => <ListContainer>
      <AgeCreditBlock {...props} creditStatus={CreditStatus.GONE}>
        <TypoDS.Title3>30&nbsp;€</TypoDS.Title3>
      </AgeCreditBlock>
      <Spacer.Column numberOfSpaces={0.5} />
      <AgeCreditBlock {...props} />
      <Spacer.Column numberOfSpaces={0.5} />
      <AgeCreditBlock {...props} creditStatus={CreditStatus.COMING}>
        <TypoDS.Title3>30&nbsp;€</TypoDS.Title3>
      </AgeCreditBlock>
    </ListContainer>,
  args: {
    children: <StyledTitle3>30&nbsp;€</StyledTitle3>,
    age: 17,
    creditStatus: CreditStatus.ONGOING
  }
}`,...(T=(C=a.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};const _=["OngoingCredit","withDescription","CreditBlockList"];export{a as CreditBlockList,i as OngoingCredit,_ as __namedExportsOrder,F as default,o as withDescription};
