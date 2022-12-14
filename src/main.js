// Menu 部分脚本 开始 //
const tab = document.getElementById("tab");

// 切换 tab 栏状态函数
function tabActived(x) {
    for (var i = 0; i < tab.childElementCount; i++) {
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
        console.log(event);
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

// 瀑布流插件初始化
let video__msnry = new Masonry(".videoList", {
    itemSelector: ".videoCard",
    columnWidth: ".videoList__col-sizer",
    gutter: ".videoList__gutter-sizer",
    percentPosition: true,
    stagger: 30,
    // nicer reveal transition
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 },
});

// 无限滚动插件初始化
let video__infScroll = new InfiniteScroll(".videoList", {
    path: function () {
        return `http://127.0.0.1:5500/example/video1.json?${this.pageIndex}`;
    },
    responseBody: "json", // 响应体为 JSON 格式
    outlayer: video__msnry,
    status: ".page-load-status", // 加载状态
    history: false, // 不展示历史
    // prefill: true, // 预先加载
    scrollThreshold: false, // 不需要滚动到底部加载
    button: ".view-more-button", // 展示更多按钮定义
});

// 转换 HTML 字符串到元素，用代理元素。
var video__proxyElem = document.createElement("div");

video__infScroll.on("load", function (body) {
    // 数据转入 HTML 字符串
    var video__itemsHTML = body["data"]["result"].map(getItemHTML).join("");
    // 将 HTML 字符串转入到元素
    video__proxyElem.innerHTML = video__itemsHTML;
    // 添加元素物件
    let video__items = video__proxyElem.querySelectorAll(".videoCard");
    imagesLoaded(video__items, function () {
        video__infScroll.appendItems(video__items);
        video__msnry.appended(video__items);
    });
});

// 加载一次先
video__infScroll.loadNextPage();

// 此处定义一下一个视频卡片物件的 HTML 代码
function getItemHTML({ name, pic }) {
    return `<a class="videoCard">
    <img src = "${pic}" />
    <div>
        <div>${name}</div>
        <div>${name}</div>
    </div>
</a>`;
}
// 视频列表 部分脚本 结束 //
