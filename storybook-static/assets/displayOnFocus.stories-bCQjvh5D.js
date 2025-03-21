import{j as o}from"./jsx-runtime-BiHFnIch.js";import{s as i,u as c}from"./index-CsrLR6Ek.js";import{r as p}from"./index-CsVCrh6D.js";import{q as a}from"./styled-components.browser.esm-DFuWokAj.js";import{T as n}from"./grid-C-3QDytX.js";import{d as m}from"./displayOnFocus.web-D3_kmd2D.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-DrFu-skq.js";import"./index-C2Dso1zb.js";import"./HiddenAccessibleText-DHdenKna.js";const D={title:"ui/accessibility/displayOnFocus"},l="a component wrapped with ",d="displayOnFocus",u=" is a component that should be visible only when giving focus",y="Some content",f=a.div({position:"relative"}),x=a.button({disblay:"flex","&:focus":{width:"90vw !important",outline:"royalblue solid 1px"}}),b=m(x),h=()=>o.jsxs(p.Fragment,{children:[o.jsxs(n.Body,{children:[l,o.jsx(n.BodyAccentXs,{children:d}),u]}),o.jsx(f,{children:o.jsx(b,{children:y})})]}),t={render:()=>o.jsx(h,{}),name:"displayOnFocus",play:async()=>{await i.findByRole("button"),c.tab()}};var e,s,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
  render: () => <StoryComponent />,
  name: 'displayOnFocus',
  play: async () => {
    await screen.findByRole('button'); // wait first render

    userEvent.tab();
  }
}`,...(r=(s=t.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,D as default};
