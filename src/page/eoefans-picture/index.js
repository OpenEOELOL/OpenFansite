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

// 通过 name 来获取 Radio 的值
function getRadioValueByName(name) {
  let radio = document.getElementsByName(name);
  for (i = 0; i < radio.length; i++) {
    // 遍历所有的选项然后返回有选上的选项
    if (radio[i].checked) return radio[i].value;
  }
}

// 动态打开逻辑
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

window.location.hash = "#picturepage";

// 视频列表 部分脚本 开始 //
// (这段其实压根就不是我写的 参考 Masonry 和 InfiniteScroll 官网展示的 codepen)
let picture__pageNumber = 1;

// 瀑布流插件初始化
let picture__msnry = new Masonry(".pictureList", {
  itemSelector: ".pictureCard",
  columnWidth: ".pictureList__col-sizer",
  gutter: ".pictureList__gutter-sizer",
  percentPosition: true,
  stagger: 30,
  transitionDuration: 0,
  // nicer reveal transition
  visibleStyle: { transform: "translateY(0)", opacity: 1 },
  hiddenStyle: { transform: "translateY(100px)", opacity: 0 },
});

// 无限滚动插件初始化
let picture__infScroll = new InfiniteScroll(".pictureList", {
  path: function () {
    return `https://api.eoe.best/eoefans-api/v1/pic/${getRadioValueByName(
      "picture__type"
    )}?topic_id=${getRadioValueByName(
      "picture__member"
    )}&page=${picture__pageNumber}&subscription-key=${EOEFansKey}`;
    //return "http://127.0.0.1:5500/example/picture.json"
  },
  responseBody: "json", // 响应体为 JSON 格式
  outlayer: picture__msnry,
  status: "#pictureStatus", // 加载状态
  history: false, // 不展示历史
  scrollThreshold: false, // 不需要滚动到底部加载
  button: "#pictureList_viewmore", // 展示更多按钮定义
});

//加载时的事件
picture__infScroll.on("request", function () {
  //console.log(picture__pageNumber);
  picture__pageNumber++; //每加载一页就准备好下一页的页数，使用自增语法。
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.remove("hide"); //遍历所有的遮罩并移除“隐藏”样式
  }
  for (
    let i = 0;
    i < document.querySelectorAll("#pictureList_viewmore").length;
    i++
  ) {
    document.querySelectorAll("#pictureList_viewmore")[i].classList.add("hide"); //遍历所有的“查看更多”的按钮并添加隐藏样式
  }
});

//当瀑布流页面排序完毕时，执行...
picture__msnry.on("layoutComplete", function () {
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.add("hide"); //遍历所有的遮罩并添加隐藏样式
  }

  for (
    let i = 0;
    i < document.querySelectorAll("#pictureList_viewmore").length;
    i++
  ) {
    document
      .querySelectorAll("#pictureList_viewmore")
      [i].classList.remove("hide"); //遍历所有的遮罩并移除隐藏样式
  }
});

// 转换 HTML 字符串到元素，用代理元素。
var picture__proxyElem = document.createElement("div");

picture__infScroll.on("load", function (body) {
  // 数据转入 HTML 字符串
  var picture__itemsHTML = body["data"]["result"]
    .map(getpictureItemHTML)
    .join("");
  // 将 HTML 字符串转入到元素
  picture__proxyElem.innerHTML = picture__itemsHTML;
  // 添加元素物件
  let picture__items = picture__proxyElem.querySelectorAll(".pictureCard");
  // imagesLoaded(picture__items, function () {
  //     picture__infScroll.appendItems(picture__items); //添加元素给无限滚动处理
  //     picture__msnry.appended(picture__items); //添加元素给瀑布流插件处理
  // });
  picture__infScroll.appendItems(picture__items); //添加元素给无限滚动处理
  picture__msnry.appended(picture__items); //添加元素给瀑布流插件处理
  for (let i = 0; i < document.querySelectorAll(".mask").length; i++) {
    document.querySelectorAll(".mask")[i].classList.add("hide"); //加载后隐藏所有的遮罩
  }
  setTimeout(() => {
    debounce(AgainLayout, 500, false); //加载七百毫秒后重新排列
  }, 700);
});

// 加载一次先
picture__infScroll.loadNextPage();

// 点击筛选选项后重新加载
for (
  let i = 0;
  i < document.querySelectorAll("#pictureOption label").length;
  i++
) {
  document
    .querySelectorAll("#pictureOption label")
    [i].addEventListener("click", () => {
      picture__pageNumber = 1; //重设要开始加载的页数
      document.querySelector(
        ".pictureList"
      ).innerHTML = `                <div class="pictureList__col-sizer"></div>
                <div class="pictureList__gutter-sizer"></div>`; //重设视频列表
      setTimeout(() => {
        picture__infScroll.loadNextPage();
        setTimeout(() => {
          AgainLayout();
        }, 700);
      }, 1); //加载下一页（还有我不知道怎么怎么解决这个问题，不知道怎么说，你如果能看到这里把 setTimeout 移除看看。
    });
}

// 此处定义一下一个视频卡片物件的 HTML 代码
function getpictureItemHTML({ dynamic_id_str, pictures }) {
  return `<a class="pictureCard" href="https://t.bilibili.com/${dynamic_id_str}" onclick="dynamic('${dynamic_id_str}');return false;">
    <img src = "${pictures[0]["img_src"]}@1e_1c.webp" alt="图片" loading="lazy" onload="AgainLayout();" />
    <div>
    </div>
</a>`;
}
// 视频列表 部分脚本 结束 //
function AgainLayout() {
  picture__msnry.layout();
}
// 窗口大小变化时重新整理卡片位置

window.addEventListener("resize", debounce(AgainLayout, 500, false));

// 设置 部分脚本 开始 //

if (OpenWay == null) {
  localStorage.setItem("open_bilibili", "website");
}

// 设置 部分脚本 结束 //

// 配置应用 部分脚本 开始 //
document.title = siteName + " · EOEFans 提供";

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
