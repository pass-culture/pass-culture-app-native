import{j as r}from"./jsx-runtime-BiHFnIch.js";import{s as c,u}from"./index-CsrLR6Ek.js";import{r as d}from"./index-CsVCrh6D.js";import{B as h}from"./ButtonPrimary-DEC78EcC.js";import{V as b}from"./VariantsTemplate-DuOJcNtD.js";import{M as f}from"./MagnifyingGlass-D35s6R8s.js";import{S as o}from"./SearchInput-4SHlzGXH.js";import"./grid-C-3QDytX.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./index-DrFu-skq.js";import"./AppButton.web-jc1nmv1J.js";import"./styled-components.browser.esm-DFuWokAj.js";import"./accessibilityAndTestId.web-DIFnR3-A.js";import"./Logo-BskoEGGL.js";import"./AccessibleSvg-9v1l2TNR.js";import"./index-BPaTxB0G.js";import"./styleUtils-7d7EC2RV.js";import"./padding-Dae-Jp5M.js";import"./customFocusOutline.web-DGw9-iH-.js";import"./lib-BWPdn4WI.js";import"./index-BXMVnZ8T.js";import"./constants-C79QT0UB.js";import"./colors-oXVEEODc.js";import"./getHoverStyle-A_aiC9pY.js";import"./Separator-BsXrwaD7.js";import"./ViewGap-Xg8HNGGB.js";import"./useHandleFocus-Cqy5wjC7.js";import"./types-BSqtYkyg.js";import"./InputLabel.web-cbSq4OYr.js";import"./LabelContainer-Cs6jWhDC.js";import"./Touchable.web-BmARAH_k.js";import"./Invalidate-L-zmeluI.js";import"./InputContainer-Cv8eS5uf.js";import"./v4-f9CH9kWS.js";import"./stringify-CUxI7f_a.js";const tr={title:"ui/inputs/SearchInput",component:o},t={render:e=>r.jsxs(d.Fragment,{children:[r.jsx(o,{...e}),r.jsx(h,{wording:"This is button should be automatically focused"})]}),args:{isFocusable:!1,placeholder:"Placeholder..."},play:async()=>{await c.findAllByRole("button"),u.tab()}},g=[{label:"SearchInput",props:{placeholder:"Placeholder..."}},{label:"Disabled SearchInput",props:{disabled:!0}},{label:"SearchInput WithTallHeight",props:{inputHeight:"tall"}},{label:"SearchInput with LeftIcon",props:{LeftIcon:()=>r.jsx(f,{})}},{label:"SearchInput with value",props:{value:"Value"}}],S=e=>r.jsx(b,{variants:g,Component:o,defaultProps:{placeholder:"Placeholder...",...e,label:"Label"}}),a=S.bind({});var s,p,i;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: (args: React.ComponentProps<typeof SearchInput>) => <Fragment>
      <SearchInput {...args} />
      <ButtonPrimary wording="This is button should be automatically focused" />
    </Fragment>,
  args: {
    isFocusable: false,
    placeholder: 'Placeholder...'
  },
  play: async () => {
    await screen.findAllByRole('button'); // wait first render
    userEvent.tab();
  }
}`,...(i=(p=t.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var l,n,m;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`(args: React.ComponentProps<typeof SearchInput>) => <VariantsTemplate variants={variantConfig} Component={SearchInput} defaultProps={{
  placeholder: 'Placeholder...',
  ...args,
  label: 'Label'
}} />`,...(m=(n=a.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};const ar=["NotFocusable","AllVariants"];export{a as AllVariants,t as NotFocusable,ar as __namedExportsOrder,tr as default};
