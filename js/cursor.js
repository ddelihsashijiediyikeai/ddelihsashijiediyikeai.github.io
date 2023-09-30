var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        // 这里改变鼠标指针的颜色 由svg生成
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();



//评论区
//移除FixedComment类，保持原生样式，确保不与最新评论跳转冲突
function RemoveFixedComment() {
    var activedItems = document.querySelectorAll('.fixedcomment');
    if (activedItems) {
      for (i = 0; i < activedItems.length; i++) {
        activedItems[i].classList.remove('fixedcomment');
      }
    }
  }
  //给post-comment添加fixedcomment类
  function AddFixedComment(){
    var commentBoard = document.getElementById('post-comment');
    var quitBoard = document.getElementById('quit-board');
    commentBoard.classList.add('fixedcomment');
    quitBoard.classList.add('fixedcomment');
  }
  //创建一个蒙版，作为退出键使用
  function CreateQuitBoard(){
    var quitBoard = `<div id="quit-board" onclick="RemoveFixedComment()"></div>`
    var commentBoard = document.getElementById('post-comment');
    commentBoard.insertAdjacentHTML("beforebegin",quitBoard)
  }
  
  function FixedCommentBtn(){
    //第一步，判断当前是否存在FixedComment类，存在则移除，不存在则添加
    // 获取评论区对象
    var commentBoard = document.getElementById('post-comment');
    // 若评论区存在
    if (commentBoard) {
        // 判断是否存在fixedcomment类
        if (commentBoard.className.indexOf('fixedcomment') > -1){
          // 存在则移除
          RemoveFixedComment();
        }
        else{
          // 不存在则添加
          CreateQuitBoard();
          AddFixedComment();
        }
    }
    // 若不存在评论区则跳转至留言板(留言板路径记得改为自己的)
    else{
      // 判断是否开启了pjax，尽量不破坏全局吸底音乐刷新
        if (pjax){
          pjax.loadUrl("/comments/#post-comment");
        }
        else{
          window.location.href = "/comments/#post-comment";
        }
    }
  }
  //切换页面先初始化一遍，确保开始时是原生状态。所以要加pjax重载。
  RemoveFixedComment();