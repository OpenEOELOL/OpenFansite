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
        console.log(event)
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
    window.location.hash = "#homepage"
}
if (hashPage.includes(location.hash)) {
    // 激活对应页面的 tab
    tabActived(hashPage.indexOf(location.hash));
}
// Menu 部分脚本 结束 //


// 视频列表初始化
let videoList;
videoList = document.querySelector(".videoList");
var msnry = new Masonry(videoList, {
    // options
    itemSelector: ".videoCard",
    // columnWidth: ".videoSizer",
    transitionDuration: 0,
    percentPosition: true,
});

window.onload = function () {
    msnry.reloadItems();
    msnry.layout();
}; 

function addVideoCard(link, cover, title, infomation) {
    let videoCardNode;
    videoCardNode = document.createElement("a");
    videoCardNode.className = `videoCard`;
    videoCardNode.innerHTML = `
<img src="${cover}" />
<div>
    <div>${title}</div>
    <div>${infomation}</div>
</div>
`;
    let Attribute;
    Attribute = document.createAttribute("href");
    Attribute.value = link;
    videoCardNode.setAttributeNode(Attribute);
    videoList.appendChild(videoCardNode);
    msnry.appended(videoCardNode);
    msnry.layout();
}


addVideoCard("", "./src/样例.png", "title", "infomation");
addVideoCard("", "./src/样例.png", "title", "infomation");
addVideoCard("", "./src/样例.png", "title", "infomation");
addVideoCard("", "./src/样例.png", "title", "infomation");
addVideoCard("", "./src/样例.png", "title", "infomation");
addVideoCard("", "./src/样例.png", "title", "infomation");