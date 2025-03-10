import{j as e}from"./jsx-runtime-BiHFnIch.js";import{s as r,g as p,d}from"./grid-C-3QDytX.js";import{V as u}from"./VerticalStepper-CxGzaRUT.js";function n({variant:t,children:a,isFirst:i,isLast:o,iconComponent:s,addMoreSpacingToIcons:l=!1}){return e.jsxs(c,{children:[e.jsx(d.View,{children:e.jsx(u,{variant:t,isFirst:i,isLast:o,iconComponent:s,addMoreSpacingToIcons:l})}),e.jsx(m,{children:a})]})}const c=r.View({flexGrow:1,flexDirection:"row"}),m=r.View({flex:1,marginLeft:p(2)});try{n.displayName="InternalStep",n.__docgenInfo={description:"",displayName:"InternalStep",props:{children:{defaultValue:null,description:"This content will be shown on the right side of this component.",name:"children",required:!0,type:{name:"ReactNode"}},isFirst:{defaultValue:null,description:"",name:"isFirst",required:!1,type:{name:"boolean"}},isLast:{defaultValue:null,description:"",name:"isLast",required:!1,type:{name:"boolean"}},variant:{defaultValue:null,description:`Use this prop to handle correct stepper step.

There is 3 variants available:
- \`VerticalStepperVariant.complete\` for completed step
- \`VerticalStepperVariant.in_progress\` for in-progress step
- \`VerticalStepperVariant.future\` for future step

Each one has its own styling, and it should always be only one "in-progress" step.
It may exist 0 or more completed and future steps.`,name:"variant",required:!0,type:{name:"enum",value:[{value:'"complete"'},{value:'"in_progress"'},{value:'"future"'}]}},iconComponent:{defaultValue:null,description:"Use this if you want to override middle icon.",name:"iconComponent",required:!1,type:{name:"Element"}},addMoreSpacingToIcons:{defaultValue:{value:"false"},description:"",name:"addMoreSpacingToIcons",required:!1,type:{name:"boolean"}}}}}catch{}export{n as I};
