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
let FirstTime = localStorage.getItem("FirstTime"); // 第一次使用？
function AgainLayout() {
  video__msnry.layout();
  picture__msnry.layout();
}
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

function dynamic(dynamicID) {
  let link;
  if (OpenWay == "app") {
    link = "bilibili://following/detail/" + dynamicID;
    window.location.href = link;
  } else if (OpenWay == "uwp") {
    link = "https://t.bilibili.com/" + dynamicID;
    window.open(link, "_newtab");
  } else if (OpenWay == "website") {
    link = "https://t.bilibili.com/" + dynamicID;
    window.open(link, "_newtab");
  }
}

// 通过 name 来获取 Radio 的值
function getRadioValueByName(name) {
  let radio = document.getElementsByName(name);
  for (let i = 0; i < radio.length; i++) {
    // 遍历所有的选项然后返回有选上的选项
    if (radio[i].checked) return radio[i].value;
  }
}

// Menu 部分脚本 开始 //
const tab = document.getElementById("tab");

// 切换 tab 栏状态函数
function tabActived(x) {
  for (let i = 0; i < tab.childElementCount; i++) {
    // 遍历所有 tab 然后取消各自的 actived 状态
    tab.children[i].classList.remove("actived");
  }
  tab.children[x].classList.add("actived");
}

// // 监听锚点
// window.addEventListener("hashchange", function (event) {
//     console.log(location.hash);
//     //console.log(event);
// });

// 监听 tab 栏按钮点击并调用切换状态
// 这段 AI 写的
// 为父元素的所有子元素添加点击事件监听器
const tabChildren = tab.querySelectorAll("a");
for (let i = 0; i < tabChildren.length; i++) {
  tabChildren[i].addEventListener("click", (event) => {
    //console.log(event);
    // 获取点击的子元素
    const tabClickedChild = event.target.parentNode;
    // 获取点击的子元素的索引
    const index = Array.prototype.indexOf.call(
      tabClickedChild.parentNode.children,
      tabClickedChild
    );
    //console.log(`Child ${index + 1} was clicked!`);
    tabActived(index);
  });
}

// 锚点列表激活
let hashPage;
hashPage = ["#homepage", "#videopage", "#picpage", "#tools"]; // 这部分是页面的顺序
if (location.hash == "") {
  // 如果没有定义默认跳转到首页
  window.location.hash = "#homepage";
}
if (hashPage.includes(location.hash)) {
  // 激活对应页面的 tab
  tabActived(hashPage.indexOf(location.hash));
}
// Menu 部分脚本 结束 //

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
    return `https://api.eoe.best/eoefans-api/v1/video-interface/advanced-search?order=${getRadioValueByName(
      "video__order"
    )}&page=${video__pageNumber}&copyright=${getRadioValueByName(
      "video__copyright"
    )}&subscription-key=${EOEFansKey}`;
    //return `http://127.0.0.1:5500/example/video${getRadioValueByName(
    //    "video__copyright"
    //)}.json?pn=${video__pageNumber}&type=${getRadioValueByName(
    ("video__order");
    //)}`;
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
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.remove("hide"); //遍历所有的遮罩并移除“隐藏”样式
  }
  for (
    let i = 0;
    i < document.querySelectorAll("#videoList_viewmore").length;
    i++
  ) {
    document.querySelectorAll("#videoList_viewmore")[i].classList.add("hide"); //遍历所有的“查看更多”的按钮并添加隐藏样式
  }
});

//当瀑布流页面排序完毕时，执行...
video__msnry.on("layoutComplete", function () {
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.add("hide"); //遍历所有的遮罩并添加隐藏样式
  }

  for (
    let i = 0;
    i < document.querySelectorAll("#videoList_viewmore").length;
    i++
  ) {
    document
      .querySelectorAll("#videoList_viewmore")
      [i].classList.remove("hide"); //遍历所有的遮罩并移除隐藏样式
  }
});

// 转换 HTML 字符串到元素，用代理元素。
var video__proxyElem = document.createElement("div");

video__infScroll.on("load", function (body) {
  // 数据转入 HTML 字符串
  var video__itemsHTML = body["data"]["result"].map(getVideoItemHTML).join("");
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
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.add("hide"); //加载后隐藏所有的遮罩
  }
  setTimeout(() => {
    debounce(AgainLayout, 500, false); //加载七百毫秒后重新排列
  }, 700);
});

// 加载一次先
video__infScroll.loadNextPage();

// 点击筛选选项后重新加载
for (
  let i = 0;
  i < document.querySelectorAll("#videoOption label").length;
  i++
) {
  document
    .querySelectorAll("#videoOption label")
    [i].addEventListener("click", () => {
      video__pageNumber = 1; //重设要开始加载的页数
      document.querySelector(
        ".videoList"
      ).innerHTML = `                <div class="videoList__col-sizer"></div>
                <div class="videoList__gutter-sizer"></div>`; //重设视频列表
      setTimeout(() => {
        video__infScroll.loadNextPage();
        setTimeout(() => {
          AgainLayout();
        }, 700);
      }, 1); //加载下一页（还有我不知道怎么怎么解决这个问题，不知道怎么说，你如果能看到这里把 setTimeout 移除看看。
    });
}

// 此处定义一下一个视频卡片物件的 HTML 代码
function getVideoItemHTML({ title, name, pic, aid }) {
  return `<a class="videoCard" href="https://bilibili.com/video/av${aid}" onclick="video('${aid}');return false;">
    <img src = "${pic}@1e_1c.webp" alt="${name}的视频封面" loading="lazy" onload="AgainLayout()" />
    <div>
        <div>${title}</div>
        <div>[UP]${name}</div>
    </div>
</a>`;
}
// 视频列表 部分脚本 结束 //

// 图片列表 部分脚本 开始 //
// (这段其实压根就不是我写的 参考 Masonry 和 InfiniteScroll 官网展示的 codepen)

// 瀑布流插件初始化
let picture__msnry = new Masonry(".pictureList", {
  itemSelector: ".pictureCard",
  columnWidth: ".pictureList__col-sizer",
  gutter: ".pictureList__gutter-sizer",
  percentPosition: true,
  transitionDuration: 0,
  stagger: 30,
  // nicer reveal transition
  visibleStyle: { transform: "translateY(0)", opacity: 1 },
  hiddenStyle: { transform: "translateY(100px)", opacity: 0 },
});

// 无限滚动插件初始化
let picture__infScroll = new InfiniteScroll(".pictureList", {
  path: function () {
    return `https://api.eoe.lol/apiDynamic/${this.pageIndex}`;
  },
  responseBody: "json", // 响应体为 JSON 格式
  outlayer: picture__msnry,
  status: "#pictureStatus", // 加载状态
  history: false, // 不展示历史
  // prefill: true, // 预先加载
  scrollThreshold: false, // 不需要滚动到底部加载
  button: "#pictureList_viewmore", // 展示更多按钮定义
});

// 转换 HTML 字符串到元素，用代理元素。
var picture__proxyElem = document.createElement("div");

const loadWatcher = () => {
  [...document.querySelectorAll(".pictureCard img")].map((img) =>
    img.addEventListener(
      "load",
      (ev) => {
        AgainLayout();
      },
      { once: true }
    )
  );
};

picture__infScroll.on("load", function (body) {
  // 数据转入 HTML 字符串
  var picture__itemsHTML = body["data"]
    .map((data) => getPictureItemHTML({ ...data, AgainLayout }))
    .join("");
  // 将 HTML 字符串转入到元素
  picture__proxyElem.innerHTML = picture__itemsHTML;
  // 添加元素物件
  let picture__items = picture__proxyElem.querySelectorAll(".pictureCard");

  picture__infScroll.appendItems(picture__items);
  picture__msnry.appended(picture__items);
  loadWatcher();
  setTimeout(() => {
    debounce(AgainLayout, 500, false); //加载七百毫秒后重新排列
  }, 700);
});

// 加载一次先
picture__infScroll.loadNextPage();

// 此处定义一下一个视频卡片物件的 HTML 代码
// 不好意思 这边加载完一个就layout一次可能对低性能设备不太友好 不知道怎么解决 后面应该会加上防抖
function getPictureItemHTML({ username, firstPicture, dynamicIDStr }) {
  return `<a class="pictureCard" href="https://t.bilibili.com/${dynamicIDStr}" onclick="dynamic('${dynamicIDStr}');return false;">
    <img src = "${firstPicture}@1e_1c.webp" alt="${eval(
    "'" + username + "'"
  )}的图片" loading="lazy" />
    <div>
        <div></div>
        <div>[UP]${eval("'" + username + "'")}</div>
    </div>
</a>`;
}

picture__infScroll.on("request", function () {
  for (
    let i = 0;
    i < document.querySelectorAll("#pictureList_viewmore").length;
    i++
  ) {
    document.querySelectorAll("#pictureList_viewmore")[i].classList.add("hide"); //遍历所有的“查看更多”的按钮并添加隐藏样式
  }
});

picture__msnry.on("layoutComplete", function () {
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.add("hide");
  }

  for (
    let i = 0;
    i < document.querySelectorAll("#pictureList_viewmore").length;
    i++
  ) {
    document
      .querySelectorAll("#pictureList_viewmore")
      [i].classList.remove("hide");
  }
});
// 窗口大小变化时重新整理卡片位置

window.addEventListener("resize", debounce(AgainLayout, 500, false));

// 设置 部分脚本 开始 //

// 记住打开方式选项并自动选择
function setOpenWayRadio(option) {
  //设置打开方式的选项
  let Radio = document.querySelectorAll("#OpenWayOption label input");
  for (let i = 0; i < Radio.length; i++) {
    if (Radio[i].getAttribute("value") == option) {
      Radio[i].checked = true;
    }
  }
}

document.getElementById("settings").addEventListener("click", () => {
  //打开设置对话框
  document.getElementById("settings_dialog").showModal();
});

document
  .getElementById("settings_dialog")
  .addEventListener("close", (event) => {
    //关闭设置对话框
    if (getRadioValueByName("open_bilibili") == undefined) {
      localStorage.setItem("open_bilibili", "website");
    } else {
      localStorage.setItem(
        "open_bilibili",
        getRadioValueByName("open_bilibili")
      );
    }
    OpenWay = localStorage.getItem("open_bilibili");
  });

if (OpenWay == null) {
  localStorage.setItem("open_bilibili", "website");
  setOpenWayRadio("website");
} else {
  setOpenWayRadio(OpenWay);
}

// 设置 部分脚本 结束 //

document.querySelector("#homepage .right").addEventListener("click", () => {
  window.location.hash = "#picpage";
  tabActived(hashPage.indexOf(location.hash));
});

// 配置应用 部分脚本 开始 //
document.querySelector("#headerTitle").innerHTML = siteName;
document.querySelector(".websiteNameForMobile").innerHTML = siteName;
document.title = siteName;

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

// 第一次使用提示 部分脚本 开始 //

let FirstTimeEle = document.querySelector(".FirstTime");

if (FirstTime == null) {
  FirstTimeEle.classList.add("show");
}

FirstTimeEle.addEventListener("click", () => {
  localStorage.setItem("FirstTime", "done");
  FirstTimeEle.classList.remove("show");
});
