import Masonry from "masonry-layout";
import InfiniteScroll from "infinite-scroll";
import { debounce } from "@/utils/limit";

let right_picture__msnry = new Masonry("#right .pictureList", {
  itemSelector: "#right .pictureCard",
  columnWidth: "#right .pictureList__col-sizer",
  gutter: "#right .pictureList__gutter-sizer",
  percentPosition: true,
  transitionDuration: 0,
  stagger: 30,
});

// 无限滚动插件初始化
let right_picture__infScroll = new InfiniteScroll("#right .pictureList", {
  path: function () {
    return `https://api.eoe.lol/apiDynamic/${this.pageIndex}`;
  },
  responseBody: "json", // 响应体为 JSON 格式
  outlayer: right_picture__msnry,
  status: "#right #pictureStatus", // 加载状态
  history: false, // 不展示历史
  // prefill: true, // 预先加载
  scrollThreshold: false, // 不需要滚动到底部加载
});
function AgainLayout() {
  right_picture__msnry.layout();
}
const loadWatcher = () => {
  [...document.querySelectorAll("#right .pictureCard img")].map((img) =>
    img.addEventListener(
      "load",
      (ev) => {
        AgainLayout();
      },
      { once: true }
    )
  );
};

// 转换 HTML 字符串到元素，用代理元素。
var right_picture__proxyElem = document.createElement("div");

right_picture__infScroll.on("load", function (body) {
  // console.log("body", body);
  // 数据转入 HTML 字符串
  var right_picture__itemsHTML = body["data"].map(getPictureItemHTML).join("");
  // 将 HTML 字符串转入到元素
  right_picture__proxyElem.innerHTML = right_picture__itemsHTML;
  // 添加元素物件
  let right_picture__items = right_picture__proxyElem.querySelectorAll(".pictureCard");

  right_picture__infScroll.appendItems(right_picture__items);
  right_picture__msnry.appended(right_picture__items);
  loadWatcher();

  setTimeout(() => {
    debounce(AgainLayout, 500, false); //加载七百毫秒后重新排列
  }, 700);
});

// 加载一次先
right_picture__infScroll.loadNextPage();

// 此处定义一下一个视频卡片物件的 HTML 代码
// 不好意思 这边加载完一个就layout一次可能对低性能设备不太友好 不知道怎么解决 后面应该会加上防抖
function getPictureItemHTML({ username, firstPicture }) {
  return `<a class="pictureCard" >
<img src = "${firstPicture}@1e_1c.webp" loading="lazy"/>
<div>
<div></div>
<div>[UP]${eval("'" + username + "'")}</div>
</div>
</a>`;
}
