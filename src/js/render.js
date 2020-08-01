// 渲染功能 渲染图片  渲染音乐信息 是否喜欢    组件，模块都是使用自执行函数
;
(function(root) {
    // 渲染图片
    function renderImg(src) {
        const img = document.querySelector('.imgInfo img');
        root.blurImg(src);
        img.src = src;

    }
    // 渲染音乐信息
    function musicInfo(data) {
        const songInfo = document.querySelector('.songInfo');
        songInfo.children[0].innerText = data.name;
        songInfo.children[1].innerText = data.singer;
        songInfo.children[2].innerText = data.album;
    }
    // 渲染是否喜欢
    function likeInfo(data) {
        const lis = document.querySelector('.controls li');
        lis.className = data.isLike ? 'liking' : '';
    }

    root.render = function(data) {
        renderImg(data.image);
        musicInfo(data);
        likeInfo(data);
    }


})(window.player || (window.player = {}))