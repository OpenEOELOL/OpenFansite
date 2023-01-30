// 防抖 juejin.cn/post/6996617040081453064 有修改
export function debounce(handle, wait, immediate) {
  //首先进行参数判断
  if (typeof handle !== "function") throw new Error("handle must be function");
  //默认wait为1s
  if (typeof handle === "undefinde") wait = 1000;
  //如果只传入 handle 和 immediate
  if (typeof wait === "boolean") {
    immediate = wait;
    wait = 1000;
  }
  //immediate默认为flase
  if (typeof immediate !== "boolean") immediate = false;
  //所谓的防抖效果，我们想要实现的就是一个人为可以管理handle的执行次数
  let timer = null;
  return function proxy(...args) {
    let self = this,
      init = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      !immediate ? handle.apply(self, args) : null;
    }, wait);
    //如果立即执行
    init ? handle.apply(self, args) : null;
  };
}
