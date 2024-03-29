import Masonry from "masonry-layout";
import InfiniteScroll from "infinite-scroll";
import { debounce } from "@/utils/limit";
import WebFont from "webfontloader";

import '@/styles/water.min.css';
import '@/styles/material-icon.css'
import '@/styles/custom.css'
import '@/page/index/main.css'

const { VITE_APP_EOEFansKey: EOEFansKey, VITE_APP_SiteName: siteName } =
  import.meta.env;
let OpenWay = localStorage.getItem("open_bilibili"); // 如何打开哔哩哔哩？

// 视频打开逻辑
function video(videoID) {
  let link;
  if (OpenWay == "app") {
    link = "bilibili://video/" + videoID;
    window.location.href = link;
  } else if (OpenWay == "uwp") {
    link = "richasy-bili://play?video=" + videoID;
  } else if (OpenWay == "website") {
    link = "https://www.bilibili.com/video/av" + videoID;
    window.open(link, "_newtab");
  }
}

window.location.hash = "#videopage";

// 视频列表 部分脚本 开始 //
// (这段其实压根就不是我写的 参考 Masonry 和 InfiniteScroll 官网展示的 codepen)
let video__pageNumber = 1;

// 瀑布流插件初始化
let video__msnry = new Masonry(".videoList", {
  itemSelector: ".videoCard",
  columnWidth: ".videoList__col-sizer",
  gutter: ".videoList__gutter-sizer",
  percentPosition: true,
  stagger: 30,
  transitionDuration: 0,
  // nicer reveal transition
  visibleStyle: { transform: "translateY(0)", opacity: 1 },
  hiddenStyle: { transform: "translateY(100px)", opacity: 0 },
});

// 无限滚动插件初始化
let video__infScroll = new InfiniteScroll(".videoList", {
  path: function () {
    //let video__pageNumber = this.pageIndex;
    return `https://api.eoe.lol/api/${video__pageNumber}`;
  },
  responseBody: "json", // 响应体为 JSON 格式
  outlayer: video__msnry,
  status: "#videoStatus", // 加载状态
  history: false, // 不展示历史
  // prefill: true, // 预先加载
  scrollThreshold: false, // 不需要滚动到底部加载
  button: "#videoList_viewmore", // 展示更多按钮定义
});

//加载时的事件
video__infScroll.on("request", function () {
  //console.log(video__pageNumber);
  video__pageNumber++; //每加载一页就准备好下一页的页数，使用自增语法。
});

// 转换 HTML 字符串到元素，用代理元素。
var video__proxyElem = document.createElement("div");

video__infScroll.on("load", function (body) {
  // 数据转入 HTML 字符串
  var video__itemsHTML = body["data"].map(getVideoItemHTML).join("");
  // 将 HTML 字符串转入到元素
  video__proxyElem.innerHTML = video__itemsHTML;
  // 添加元素物件
  let video__items = video__proxyElem.querySelectorAll(".videoCard");
  // imagesLoaded(video__items, function () {
  //     video__infScroll.appendItems(video__items); //添加元素给无限滚动处理
  //     video__msnry.appended(video__items); //添加元素给瀑布流插件处理
  // });
  video__infScroll.appendItems(video__items); //添加元素给无限滚动处理
  video__msnry.appended(video__items); //添加元素给瀑布流插件处理

  setTimeout(() => {
    debounce(AgainLayout, 500, false); //加载七百毫秒后重新排列
  }, 700);
});

// 加载一次先
video__infScroll.loadNextPage();

// 此处定义一下一个视频卡片物件的 HTML 代码
function getVideoItemHTML({ title, author, cover, av }) {
  return `<a class="videoCard" href="https://bilibili.com/video/av${av}" onclick="video('${av}');return false;">
<img src = "${cover}" alt="${author}的视频封面" loading="lazy" onload="AgainLayout()" />
<div>
<div>${title}</div>
<div>[UP]${author}</div>
</div>
</a>`;
}
// 视频列表 部分脚本 结束 //
function AgainLayout() {
  video__msnry.layout();
}
// 窗口大小变化时重新整理卡片位置

window.addEventListener("resize", debounce(AgainLayout, 500, false));

// 设置 部分脚本 开始 //

if (OpenWay == null) {
  localStorage.setItem("open_bilibili", "website");
}

// 设置 部分脚本 结束 //

// 配置应用 部分脚本 开始 //
document.title = siteName + " Legacy";

WebFont.load({
  custom: {
    families: ["LXGWFasmartGothic"],
  },
  classes: false,
  active() {
    document.body.style.fontFamily = "LXGWFasmartGothic";
  },
});

// 配置应用 部分脚本 结束 //
