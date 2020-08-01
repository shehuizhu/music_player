;
(function(root) {
    /**
     *  负责整个项目的歌曲循环
     * @param {*} len  歌曲总长度
     * @param {*} index   当前的长度
     */
    function Index(len) {
        this.len = len;
        this.index = 0;
    }
    Index.prototype = {
        prev() {
            return this.get(-1);
        },
        next() {
            return this.get(1);
        },
        get(val) {
            this.index = (this.index + val + this.len) % this.len; // 整个切换歌曲的核心
            return this.index;
        }
    }
    root.indexControl = Index; // 返回出去
})(window.player || (window.player = {}))