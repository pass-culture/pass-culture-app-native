import{j as e}from"./jsx-runtime-BiHFnIch.js";import{d as p,T as a,s as B}from"./grid-C-3QDytX.js";import{S as D}from"./StepCard-B_PMoVd-.js";import{t as y}from"./index-BXMVnZ8T.js";import{S as l}from"./types-CXBpbSQ8.js";import{B as T}from"./BicolorAroundMe-BF9nNk7w.js";import{E as d}from"./Email-CblpmRs_.js";import{S as r}from"./Step-r0EEQq58.js";import{S as m}from"./StepList-DqC0Por0.js";import"./index-CsVCrh6D.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./lib-BWPdn4WI.js";import"./constants-C79QT0UB.js";import"./colors-oXVEEODc.js";import"./AccessibleSvg-9v1l2TNR.js";import"./index-BPaTxB0G.js";import"./utils-BOQWVbER.js";import"./stringify-CUxI7f_a.js";import"./InternalStep-C0uNxxbL.js";import"./VerticalStepper-CxGzaRUT.js";import"./VerticalDots-CTzTegO9.js";import"./StepperValidate-BNFDeLVH.js";import"./Li-CI6nrOIs.js";import"./Ul-DvuSUFWN.js";const X={title:"features/profile/StepList",component:m,args:{currentStepIndex:0},argTypes:{children:{control:{disable:!0}}}},o=p.StyleSheet.create({contentActive:{borderColor:y.colors.black},content:{borderColor:y.colors.greyMedium,borderWidth:2,borderStyle:"solid",borderRadius:4,height:100,padding:24,marginVertical:12}});function s({currentStepIndex:t=0}){return e.jsxs(m,{currentStepIndex:t,children:[e.jsx(r,{children:e.jsx(p.View,{style:[o.content,t===0&&o.contentActive],children:e.jsx(a.Body,{children:"Play with"})})}),e.jsx(r,{children:e.jsx(p.View,{style:[o.content,t===1&&o.contentActive],children:e.jsx(a.Body,{children:"`currentStepIndex` control"})})}),e.jsx(r,{children:e.jsx(p.View,{style:[o.content,t===2&&o.contentActive],children:e.jsx(a.Body,{children:"on Storybook"})})})]})}const i=B(D)({marginVertical:12}),b=({currentStepIndex:t=0})=>{const n=S=>S===t?l.CURRENT:S<t?l.COMPLETED:l.DISABLED;return e.jsxs(m,{currentStepIndex:t,children:[e.jsx(r,{children:e.jsx(i,{title:"Done",icon:e.jsx(d,{}),type:n(0)})}),e.jsx(r,{children:e.jsx(i,{title:"Active",subtitle:"Renseigne ton e-mail",icon:e.jsx(T,{}),type:n(1)})}),e.jsx(r,{children:e.jsx(i,{title:"Disabled",icon:e.jsx(d,{}),type:n(2)})}),e.jsx(r,{children:e.jsx(i,{title:"Disabled",icon:e.jsx(d,{}),type:n(3)})})]})},c={args:{currentStepIndex:1},render:b};var x,u,h;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`function UsageExample({
  currentStepIndex = 0
}) {
  return <StepList currentStepIndex={currentStepIndex}>
      <Step>
        <View style={[styles.content, currentStepIndex === 0 && styles.contentActive]}>
          <TypoDS.Body>Play with</TypoDS.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, currentStepIndex === 1 && styles.contentActive]}>
          <TypoDS.Body>\`currentStepIndex\` control</TypoDS.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, currentStepIndex === 2 && styles.contentActive]}>
          <TypoDS.Body>on Storybook</TypoDS.Body>
        </View>
      </Step>
    </StepList>;
}`,...(h=(u=s.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var j,f,g;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    currentStepIndex: 1
  },
  render: Template
}`,...(g=(f=c.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};const Y=["UsageExample","WithStepCard"];export{s as UsageExample,c as WithStepCard,Y as __namedExportsOrder,X as default};
