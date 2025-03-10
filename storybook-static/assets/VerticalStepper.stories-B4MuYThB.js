import{j as i}from"./jsx-runtime-BiHFnIch.js";import{d as l}from"./grid-C-3QDytX.js";import{t as n}from"./index-BXMVnZ8T.js";import{V as v,S as m}from"./VerticalStepper-CxGzaRUT.js";import"./index-CsVCrh6D.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./lib-BWPdn4WI.js";import"./constants-C79QT0UB.js";import"./colors-oXVEEODc.js";import"./VerticalDots-CTzTegO9.js";import"./StepperValidate-BNFDeLVH.js";import"./AccessibleSvg-9v1l2TNR.js";import"./index-BPaTxB0G.js";const F={title:"features/profile/VerticalStepper",component:v,argTypes:{variant:{description:`Use this prop to handle correct stepper step.

There is 3 variants available:
- \`VerticalStepperVariant.complete\` for completed step
- \`VerticalStepperVariant.in_progress\` for in-progress step
- \`VerticalStepperVariant.future\` for future step

Each one has its own styling, and it should always be only one "in-progress" step.
It may exist 0 or more completed and future steps.`},wrapper:{options:["normal","large","small"],mapping:{normal:"normal",large:"large",small:"small"},control:{type:"select",labels:{normal:"Normal",large:"Large",small:"Small"}},description:"ONLY USED IN STORYBOOK. NOT AVAILABLE IN THE COMPONENT"},iconComponent:{description:"Use this if you want to override middle icon.",control:{disable:!0}}}},s=({wrapper:r="normal",...T})=>i.jsx(l.View,{style:[r==="normal"&&p.wrapper,r==="large"&&p.wrapperBig,r==="small"&&p.wrapperSmall],children:i.jsx(v,{...T})}),e={render:r=>s(r),args:{variant:m.complete,wrapper:"normal"}},a={render:r=>s(r),args:{variant:m.in_progress,wrapper:"normal"}},t={render:r=>s(r),args:{variant:m.future,wrapper:"normal"}},o={render:r=>s(r),args:{...e.args,iconComponent:i.jsx(l.View,{style:{width:20,height:20,backgroundColor:"blue"}})}},p=l.StyleSheet.create({wrapper:{backgroundColor:n.colors.greyLight,padding:12,width:50,height:200},wrapperBig:{backgroundColor:n.colors.greyLight,padding:12,width:50,height:500},wrapperSmall:{backgroundColor:n.colors.greyLight,padding:12,width:50,height:100}});var c,g,d;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => WrapperTemplate(args),
  args: {
    variant: StepVariant.complete,
    wrapper: 'normal'
  }
}`,...(d=(g=e.parameters)==null?void 0:g.docs)==null?void 0:d.source}}};var u,h,w;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => WrapperTemplate(args),
  args: {
    variant: StepVariant.in_progress,
    wrapper: 'normal'
  }
}`,...(w=(h=a.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};var S,V,f;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: args => WrapperTemplate(args),
  args: {
    variant: StepVariant.future,
    wrapper: 'normal'
  }
}`,...(f=(V=t.parameters)==null?void 0:V.docs)==null?void 0:f.source}}};var y,C,b;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => WrapperTemplate(args),
  args: {
    ...Complete.args,
    // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
    iconComponent: <View style={{
      width: 20,
      height: 20,
      backgroundColor: 'blue'
    }} />
  }
}`,...(b=(C=o.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};const R=["Complete","InProgress","Future","WithCustomComponent"];export{e as Complete,t as Future,a as InProgress,o as WithCustomComponent,R as __namedExportsOrder,F as default};
