import{d as debounce}from"./limit-851bbedd.js";import{M as Masonry}from"./masonry-layout-f99d37ca.js";import{I as InfiniteScroll}from"./infinite-scroll-530e71ba.js";let picture__msnry=new Masonry(".pictureList",{itemSelector:".pictureCard",columnWidth:".pictureList__col-sizer",gutter:".pictureList__gutter-sizer",percentPosition:!0,transitionDuration:0,stagger:30}),picture__infScroll=new InfiniteScroll(".pictureList",{path:function(){return`https://api.eoe.lol/apiDynamic/${this.pageIndex}`},responseBody:"json",outlayer:picture__msnry,status:"#pictureStatus",history:!1,scrollThreshold:!1});function AgainLayout(){picture__msnry.layout()}const loadWatcher=()=>{[...document.querySelectorAll(".pictureCard img")].map(e=>e.addEventListener("load",t=>{AgainLayout()},{once:!0}))};var picture__proxyElem=document.createElement("div");picture__infScroll.on("load",function(e){var t=e.data.map(getPictureItemHTML).join("");picture__proxyElem.innerHTML=t;let r=picture__proxyElem.querySelectorAll(".pictureCard");picture__infScroll.appendItems(r),picture__msnry.appended(r),loadWatcher(),setTimeout(()=>{debounce(AgainLayout,500,!1)},700)});picture__infScroll.loadNextPage();function getPictureItemHTML({username,firstPicture}){return`<a class="pictureCard" >
<img src = "${firstPicture}@1e_1c.webp" loading="lazy"/>
<div>
<div></div>
<div>[UP]${eval("'"+username+"'")}</div>
</div>
</a>`}
