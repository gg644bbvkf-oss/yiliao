import{g as de,E as pe,w as me,x as fe,b as v,d as W,y as b,_ as x,j as o,V as l,z as he,H as ge,f as ve,A as R,i as be,S as xe,B as we,D as ye,e as Ee,F as _e,X as Ce,G as je,J as Te,K as Be,M as p,N as u,O as Se,P as K,Q,r as A,U as Fe,W as Pe,Y as ke,Z as Ne,$ as Ae,a0 as De,a1 as Z,a2 as h}from"./vendors.bcbdfbbf.js";import{c as O,P as Oe,B as S,C as He,a as Re,b as D,d as Le,e as Ie,t as U,T as ze}from"./common.a1ede081.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const t of a.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&n(t)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();var Ve=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 导航栏页面自动添加顶部间距 */
body.h5-navbar-visible .taro_page {
  padding-top: 44px;
}

body.h5-navbar-visible .toaster[data-position^="top"] {
  top: 44px !important;
}

/* Sheet 组件在 H5 导航栏下的位置修正 */
body.h5-navbar-visible .sheet-content:not([data-side="bottom"]) {
    top: 44px !important;
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* 全局按钮样式重置 */
taro-button-core,
button {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

taro-button-core::after,
button::after {
    border: none;
}

taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`,Me=`
/* PC 宽屏适配 - 基础布局 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }
}
`,We=`
/* PC 宽屏适配 - 手机框样式（有 TabBar 页面） */
@media (min-width: 769px) {
  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}

/* PC 宽屏适配 - Toast 定位到手机框范围内 */
@media (min-width: 769px) {
  body .toaster {
    left: 50% !important;
    right: auto !important;
    width: 375px !important;
    max-width: 375px !important;
    transform: translateX(-50%) !important;
    box-sizing: border-box !important;
  }
}

/* PC 宽屏适配 - 手机框样式（无 TabBar 页面，通过 JS 添加 no-tabbar 类） */
@media (min-width: 769px) {
  body.no-tabbar #app {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
    transform: translateX(0) !important;
  }

  body.no-tabbar #app .taro_router {
    height: 100% !important;
    overflow: auto !important;
  }
}
`;function Ue(){var s=document.createElement("style");s.innerHTML=Ve+Me+We,document.head.appendChild(s)}function $e(){var s=function(){var n=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!n)};s();var e=new MutationObserver(s);e.observe(document.body,{childList:!0,subtree:!0})}function Ye(){Ue(),$e()}function Xe(){var s=de();if(s===pe.WEAPP)try{var e=me(),r=e.miniProgram.envVersion;console.log("[Debug] envVersion:",r),r!=="release"&&fe({enableDebug:!0})}catch(n){console.error("[Debug] 开启调试模式失败:",n)}}var Ge={visible:!1,title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},Je=function(){var e,r=R();return(r==null||(e=r.config)===null||e===void 0?void 0:e.window)||{}},qe=function(){var e,r,n=(e=R())===null||e===void 0||(e=e.config)===null||e===void 0?void 0:e.tabBar;return new Set((n==null||(r=n.list)===null||r===void 0?void 0:r.map(function(i){return i.pagePath}))||[])},$=function(){var e,r=R();return(r==null||(e=r.config)===null||e===void 0||(e=e.pages)===null||e===void 0?void 0:e[0])||"pages/index/index"},P=function(e){return e.replace(/^\//,"")},Ke=function(e,r,n,i){if(!e)return"none";var a=P(e),t=P(i),g=a===t,c=r.has(a)||r.has("/".concat(a)),m=n>1;return c||g?"none":m?"back":"home"},Qe=function(){var e=v.useState(Ge),r=W(e,2),n=r[0],i=r[1],a=v.useState(0),t=W(a,2),g=t[0],c=t[1],m=v.useCallback(function(){var d=b.getCurrentPages();if(d.length===0){i(function(ce){return x(x({},ce),{},{visible:!1})});return}var f=d[d.length-1],z=(f==null?void 0:f.route)||"";if(z){var w=(f==null?void 0:f.config)||{},y=Je(),T=qe(),se=$(),B=P(z),V=P(se),le=B===V,ue=T.has(B)||T.has("/".concat(B)),M=T.size<=1&&d.length<=1&&(le||ue);i({visible:!M,title:document.title||w.navigationBarTitleText||y.navigationBarTitleText||"",bgColor:w.navigationBarBackgroundColor||y.navigationBarBackgroundColor||"#ffffff",textStyle:w.navigationBarTextStyle||y.navigationBarTextStyle||"black",navStyle:w.navigationStyle||y.navigationStyle||"default",transparent:w.transparentTitle||y.transparentTitle||"none",leftIcon:M?"none":Ke(B,T,d.length,V)})}},[]);b.useDidShow(function(){m()}),b.usePageScroll(function(d){var f=d.scrollTop;n.transparent==="auto"&&c(Math.min(f/100,1))}),v.useEffect(function(){var d=null,f=new MutationObserver(function(){d&&clearTimeout(d),d=setTimeout(function(){m()},50)});return f.observe(document.head,{subtree:!0,childList:!0,characterData:!0}),m(),function(){f.disconnect(),d&&clearTimeout(d)}},[m]);var N=n.visible&&n.navStyle!=="custom";if(v.useEffect(function(){N?document.body.classList.add("h5-navbar-visible"):document.body.classList.remove("h5-navbar-visible")},[N]),!N)return o.jsx(o.Fragment,{});var I=n.textStyle==="white"?"#fff":"#333",te=n.textStyle==="white"?"text-white":"text-gray-800",ae=function(){return n.transparent==="always"?{backgroundColor:"transparent"}:n.transparent==="auto"?{backgroundColor:n.bgColor,opacity:g}:{backgroundColor:n.bgColor}},ie=function(){return b.navigateBack()},oe=function(){var f=$();b.reLaunch({url:"/".concat(f)})};return o.jsxs(o.Fragment,{children:[o.jsxs(l,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000",style:ae(),children:[n.leftIcon==="back"&&o.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:ie,children:o.jsx(he,{size:24,color:I})}),n.leftIcon==="home"&&o.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:oe,children:o.jsx(ge,{size:22,color:I})}),o.jsx(ve,{className:"text-base font-medium max-w-3/5 truncate ".concat(te),children:n.title})]}),o.jsx(l,{className:"h-11 shrink-0"})]})},Ze=function(e){var r=e.children;return o.jsxs(o.Fragment,{children:[o.jsx(Qe,{}),r]})},er=["className","children","orientation"],ee=v.forwardRef(function(s,e){var r=s.className,n=s.children,i=s.orientation,a=i===void 0?"vertical":i,t=be(s,er),g=a==="horizontal"||a==="both",c=a==="vertical"||a==="both";return o.jsx(xe,x(x({ref:e,className:O("relative",r),scrollY:c,scrollX:g,style:{overflowX:g?"auto":"hidden",overflowY:c?"auto":"hidden"}},t),{},{children:n}))});ee.displayName="ScrollArea";var rr={error:null,report:"",source:"",visible:!1,open:!1,timestamp:""},Y="hsl(360, 100%, 45%)",X=!1,k=rr,H=new Set,nr=function(){H.forEach(function(e){return e()})},tr=function(e){return H.add(e),function(){return H.delete(e)}},G=function(){return k},re=function(e){k=e,nr()},ar=(function(){var s=p(u().m(function e(r){var n,i,a,t,g;return u().w(function(c){for(;;)switch(c.p=c.n){case 0:if(typeof window!="undefined"){c.n=1;break}return c.a(2,!1);case 1:if(c.p=1,!((n=navigator.clipboard)!==null&&n!==void 0&&n.writeText)){c.n=3;break}return c.n=2,navigator.clipboard.writeText(r);case 2:return c.a(2,!0);case 3:c.n=5;break;case 4:c.p=4,t=c.v,console.warn("[H5ErrorBoundary] Clipboard API copy failed:",t);case 5:return c.p=5,i=document.createElement("textarea"),i.value=r,i.setAttribute("readonly","true"),i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.select(),a=document.execCommand("copy"),document.body.removeChild(i),c.a(2,a);case 6:return c.p=6,g=c.v,console.warn("[H5ErrorBoundary] Fallback copy failed:",g),c.a(2,!1)}},e,null,[[5,6],[1,4]])}));return function(r){return s.apply(this,arguments)}})(),ir=function(e){if(e instanceof Error)return e;if(typeof e=="string")return new Error(e);try{return new Error(JSON.stringify(e))}catch(r){return new Error(String(e))}},or=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=["[H5 Runtime Error]","Time: ".concat(new Date().toISOString()),r.source?"Source: ".concat(r.source):"","Name: ".concat(e.name),"Message: ".concat(e.message),e.stack?`Stack:
`.concat(e.stack):"",r.componentStack?`Component Stack:
`.concat(r.componentStack):"",typeof navigator!="undefined"?"User Agent: ".concat(navigator.userAgent):""].filter(Boolean);return n.join(`

`)},J=function(e){k.visible&&re(x(x({},k),{},{open:e}))},L=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(typeof window!="undefined"){var n=ir(e),i=or(n,r),a=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});re({error:n,report:i,source:r.source||"runtime",timestamp:a,visible:!0,open:!1}),console.error("[H5ErrorOverlay] Showing error overlay:",n,r)}},sr=function(e){var r=e.error||new Error(e.message||"Unknown H5 runtime error");L(r,{source:"window.error"})},lr=function(e){L(e.reason,{source:"window.unhandledrejection"})},ur=function(){typeof window=="undefined"||X||(X=!0,window.addEventListener("error",sr),window.addEventListener("unhandledrejection",lr))},cr=function(){var e,r,n=v.useSyncExternalStore(tr,G,G);if(!n.visible)return null;var i=((e=n.error)===null||e===void 0?void 0:e.name)||"Error";return o.jsx(Oe,{children:o.jsxs(l,{className:"pointer-events-none fixed inset-0 z-[2147483646]",children:[o.jsx(l,{className:"pointer-events-auto fixed bottom-5 left-5",children:o.jsx(S,{variant:"outline",size:"icon",className:O("h-11 w-11 rounded-full shadow-md transition-transform"),style:{backgroundColor:"hsl(359, 100%, 97%)",borderColor:"hsl(359, 100%, 94%)",color:Y},onClick:function(){return J(!n.open)},children:o.jsx(Ee,{size:22,color:Y})})}),n.open&&o.jsx(l,{className:"pointer-events-none fixed inset-0 bg-white bg-opacity-15 supports-[backdrop-filter]:backdrop-blur-md",children:o.jsx(l,{className:"absolute inset-0 flex items-center justify-center px-4 py-4",children:o.jsx(l,{className:"w-full max-w-md",style:{width:"min(calc(100vw - 32px), var(--h5-phone-width, 390px))",height:"min(calc(100vh - 32px), 900px)"},children:o.jsx(He,{className:O("pointer-events-auto h-full rounded-2xl border border-border bg-background text-foreground shadow-2xl"),children:o.jsxs(l,{className:"relative flex h-full flex-col",children:[o.jsxs(Re,{className:"gap-2 p-4 pb-2",children:[o.jsxs(l,{className:"flex items-start justify-between gap-3",children:[o.jsxs(l,{className:"flex flex-wrap items-center gap-2",children:[o.jsx(D,{variant:"destructive",className:"border-none bg-red-500 px-3 py-1 text-xs font-medium text-white",children:"Runtime Error"}),o.jsx(D,{variant:"outline",className:"px-3 py-1 text-xs",children:n.source})]}),o.jsxs(l,{className:"flex shrink-0 items-center gap-1",children:[o.jsx(S,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return window.location.reload()},children:o.jsx(_e,{size:15,color:"inherit"})}),o.jsx(S,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return J(!1)},children:o.jsx(Ce,{size:17,color:"inherit"})})]})]}),o.jsxs(l,{className:"flex items-center justify-between gap-3",children:[o.jsx(Le,{className:"text-left text-lg",children:i}),o.jsxs(S,{variant:"outline",size:"sm",className:"shrink-0 rounded-lg",onClick:(function(){var a=p(u().m(function g(){var c;return u().w(function(m){for(;;)switch(m.n){case 0:return m.n=1,ar(n.report);case 1:if(c=m.v,!c){m.n=2;break}return U.success("已复制错误信息",{description:"可发送给 Agent 进行自动修复",position:"top-center"}),m.a(2);case 2:U.warning("复制失败",{description:"请直接选中文本后手动复制。",position:"top-center"});case 3:return m.a(2)}},g)}));function t(){return a.apply(this,arguments)}return t})(),children:[o.jsx(je,{size:15,color:"inherit"}),o.jsx(l,{children:"复制错误"})]})]})]}),o.jsx(Ie,{className:"min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2",children:o.jsxs(l,{className:"flex h-full min-h-0 flex-col gap-2",children:[o.jsxs(l,{className:"flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border px-3 py-2 text-sm",children:[o.jsxs(l,{className:"flex items-center gap-2",children:[o.jsx(l,{className:"text-muted-foreground",children:"Error"}),o.jsx(l,{className:"font-medium text-foreground",children:((r=n.error)===null||r===void 0?void 0:r.name)||"Error"})]}),o.jsx(l,{className:"h-4 w-px bg-border"}),o.jsxs(l,{className:"flex items-center gap-2",children:[o.jsx(l,{className:"text-muted-foreground",children:"Source"}),o.jsx(l,{className:"font-medium text-foreground",children:n.source})]})]}),o.jsxs(l,{className:"min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-black text-white",children:[o.jsxs(l,{className:"flex items-center justify-between border-b border-white border-opacity-10 px-3 py-3",children:[o.jsx(l,{className:"text-xs font-medium uppercase tracking-wide text-zinc-400",children:"Full Report"}),o.jsx(D,{variant:"outline",className:"border-zinc-700 bg-transparent px-2 py-1 text-xs text-zinc-400",children:n.timestamp})]}),o.jsx(ee,{className:"min-h-0 flex-1 w-full",orientation:"both",children:o.jsx(l,{className:"inline-block min-w-full whitespace-pre px-3 py-3 pb-8 font-mono text-xs leading-6 text-zinc-200",children:n.report})})]})]})})]})})})})})]})})},dr=(function(s){function e(){var r;Te(this,e);for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];return r=Be(this,e,[].concat(i)),r.state={error:null},r}return we(e,s),ye(e,[{key:"componentDidUpdate",value:function(n){this.state.error&&n.children!==this.props.children&&this.setState({error:null})}},{key:"componentDidCatch",value:function(n,i){L(n,{source:"React Error Boundary",componentStack:i.componentStack||""})}},{key:"render",value:function(){return o.jsxs(o.Fragment,{children:[o.jsx(cr,{}),this.state.error?null:this.props.children]})}}],[{key:"getDerivedStateFromError",value:function(n){return{error:n}}}])})(v.Component),pr=function(e){var r=e.children;return o.jsx(dr,{children:r})},mr=function(e){var r=e.children;return ur(),b.useLaunch(function(){Xe(),Ye()}),o.jsx(pr,{children:o.jsx(Ze,{children:r})})},fr=function(e){var r=e.children;return o.jsxs(Se,{defaultColor:"#000",defaultSize:24,children:[o.jsx(mr,{children:r}),o.jsx(ze,{})]})},_=K.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index","pages/appointment/index","pages/hospital/index","pages/profile/index","pages/appointment/doctor-select","pages/appointment/booking-form","pages/appointment/booking-result","pages/appointment/my-appointments","pages/hospital/department-detail","pages/hospital/doctor-detail","pages/profile/patient-manage","pages/profile/admin-mgmt"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#0D9488",navigationBarTitleText:"旬邑县城关镇卫生院",navigationBarTextStyle:"white"},tabBar:{color:"#64748B",selectedColor:"#0D9488",backgroundColor:"#ffffff",borderStyle:"black",list:[{pagePath:"pages/index/index",text:"医院简介",iconPath:"./assets/tabbar/building.png",selectedIconPath:"./assets/tabbar/building-active.png"},{pagePath:"pages/hospital/index",text:"医生介绍",iconPath:"./assets/tabbar/stethoscope.png",selectedIconPath:"./assets/tabbar/stethoscope-active.png"},{pagePath:"pages/appointment/index",text:"预约挂号",iconPath:"./assets/tabbar/calendar-plus.png",selectedIconPath:"./assets/tabbar/calendar-plus-active.png"},{pagePath:"pages/profile/index",text:"我的",iconPath:"./assets/tabbar/user.png",selectedIconPath:"./assets/tabbar/user-active.png"}]}},C=[],j=[];C[0]="/static/images/building.png";j[0]="/static/images/building-active.png";C[1]="/static/images/stethoscope.png";j[1]="/static/images/stethoscope-active.png";C[2]="/static/images/calendar-plus.png";j[2]="/static/images/calendar-plus-active.png";C[3]="/static/images/user.png";j[3]="/static/images/user-active.png";var q=_.tabBar.list;for(var E=0;E<q.length;E++){var F=q[E];F.iconPath&&(F.iconPath=C[E]),F.selectedIconPath&&(F.selectedIconPath=j[E])}_.routes=[Object.assign({path:"pages/index/index",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./index.026016f9.js"),["./index.026016f9.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js","../css/index.e3b0c442.css"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"医院简介"}),Object.assign({path:"pages/appointment/index",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./index.84eaebc5.js"),["./index.84eaebc5.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"预约挂号"}),Object.assign({path:"pages/hospital/index",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./index.45b9c748.js"),["./index.45b9c748.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"医生介绍"}),Object.assign({path:"pages/profile/index",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./index.a69abad5.js"),["./index.a69abad5.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"我的"}),Object.assign({path:"pages/appointment/doctor-select",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./doctor-select.4a9c9353.js"),["./doctor-select.4a9c9353.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"选择医生"}),Object.assign({path:"pages/appointment/booking-form",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./booking-form.fc2e0c75.js"),["./booking-form.fc2e0c75.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"填写预约信息"}),Object.assign({path:"pages/appointment/booking-result",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./booking-result.ee7cdfc6.js"),["./booking-result.ee7cdfc6.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"预约成功"}),Object.assign({path:"pages/appointment/my-appointments",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./my-appointments.7e8fd8ba.js"),["./my-appointments.7e8fd8ba.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"我的预约"}),Object.assign({path:"pages/hospital/department-detail",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./department-detail.e9684aa0.js"),["./department-detail.e9684aa0.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"科室详情"}),Object.assign({path:"pages/hospital/doctor-detail",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./doctor-detail.e38c612b.js"),["./doctor-detail.e38c612b.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"医生详情"}),Object.assign({path:"pages/profile/patient-manage",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./patient-manage.be062435.js"),["./patient-manage.be062435.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"就诊人管理"}),Object.assign({path:"pages/profile/admin-mgmt",load:(function(){var s=p(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,h(()=>import("./admin-mgmt.5d004c77.js"),["./admin-mgmt.5d004c77.js","./vendors.bcbdfbbf.js","../css/vendors.8886af03.css","./common.a1ede081.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"管理后台"})];Object.assign(Q,{findDOMNode:A.findDOMNode,render:A.render,unstable_batchedUpdates:A.unstable_batchedUpdates});Fe();var hr=Pe(fr,Z,Q,_),ne=ke({window:K});Ne(_,ne);Ae(ne,hr,_,Z);De({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
