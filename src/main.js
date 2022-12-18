const tab = document.getElementById("tab");

function tabActived(x) {
    for (var i = 0; i < tab.childElementCount; i++) {
        tab.children[i].classList.remove("actived");
    }
    tab.children[x].classList.add("actived");
}

window.addEventListener("hashchange", function (event) {
    console.log(location.hash);
    //console.log(event);
});

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
        console.log(`Child ${index + 1} was clicked!`);
        tabActived(index);
    });
}

var hashPage = ["#homePage", "#videoPage", "#picPage"];
if (location.hash == "") {
    window.location.hash = "#homePage"
}
if (hashPage.includes(location.hash)) {
    tabActived(hashPage.indexOf(location.hash));
}