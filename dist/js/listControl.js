(function(root) {
    /**
     * 
     * @param {*} data  加载的数据 
     * @param {*} wrap  父容器
     */
    function listControl(data, wrap) {
        // 列表页面进行渲染开始
        var list = document.createElement('div');
        var dl = document.createElement('dl');
        var close = document.createElement('div');
        var dt = document.createElement('dt');
        var listDd = [];
        close.innerHTML = '关闭'
        dt.innerHTML = '播放列表'
        dl.appendChild(dt);
        list.className = 'list';
        close.className = 'close';
        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);


        data.forEach(function(ele, index) {
            var dd = document.createElement('dd');
            dd.innerHTML = ele.name;
            listDd.push(dd);
            dl.appendChild(dd);
            dd.addEventListener('touchend', function() {
                changeStyle(index); // 点击不同的dd改变索引
            }, false);

        });
        // 页面渲染结束
        changeStyle(0); // 初始的时候为0
        var disY = list.offsetHeight; // 获取整个子件的高度，以便用以隐藏
        list.style.transform = "translateY(" + disY + "px)";
        /**
         * 显示
         */
        function slideUp() {
            list.style.transition = 'all .2s'
            list.style.transform = "translateY(" + 0 + "px)";
        }
        /**
         * 隐藏
         */

        function slideDown() {
            list.style.transition = 'all .2s'
            list.style.transform = "translateY(" + disY + "px)";

        }
        close.addEventListener('touchend', slideDown); //给关闭添加点击事件

        /**
         * 
         * @param {*} index  给指定的索引添加颜色      
         */
        function changeStyle(index) {
            for (var i = 0; i < listDd.length; i++) {
                listDd[i].className = ''
            }
            listDd[index].className = 'active';
        }

        return {
            listDd: listDd,
            list: list,
            slideUp: slideUp,
            slideDown: slideDown,
            changeStyle: changeStyle

        }
    }
    root.listControl = listControl;

})(window.player || (window.player = {}))