(function(root) {
    function Progress() {
        this.durTime = 0; //总时间
        this.frameId = null; //定时器
        this.startTime = 0; // 开始播放的时间
        this.lastPercent = 0; // 上次已经走的百分比
        this.init(); // 初始化dom

    }
    Progress.prototype = {
        init() {
            this.getDom();
        },
        getDom() {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.front = document.querySelector('.front');
            this.back = document.querySelector('.back');
            this.totalTime = document.querySelector('.totalTime');
        },
        renderAlltime(time) { // 渲染总的时间
            this.durTime = time;
            time = this.fromatTime(time); //格式化时间
            this.totalTime.innerHTML = time; // 进行渲染
        },
        fromatTime(time) {
            time = Math.round(time); // 取整  四舍五入
            var m = Math.floor(time / 60); // 取整
            var s = time % 60;
            m = m < 10 ? '0' + m : m; //  满足大于10
            s = s < 10 ? '0' + s : s;
            return m + ':' + s;
        },
        /**
         * 
         * @param {*} per   传入的百分比 
         */
        move(per) {
            var This = this;
            this.lastPercent = per === undefined ? this.lastPercent : per; // 看看上次的百分比是否从头开始，或者是重新开始
            cancelAnimationFrame(this.frameId); // 清除定时器
            this.startTime = new Date().getTime(); // 得到开始时间

            function frame() {
                var curTime = new Date().getTime();
                // 当前时间
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);
                if (per <= 1) {
                    This.update(per); // 百分比是否为1
                } else {
                    cancelAnimationFrame(This.frameId); // 百分比为1   清除定时器
                }
                This.frameId = requestAnimationFrame(frame);

            }
            frame(); // 开启定时器
        },
        update(per) { // 更新位置    小圆点  前背景  时间
            var time = this.fromatTime(per * this.durTime);
            this.curTime.innerHTML = time;
            this.front.style.width = per * 100 + '%';
            var l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX(' + l + 'px)'
        },
        stop() { // 停止定时器
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime(); // 得到停止的时间
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000); //记录停止时间时候的百分比
        }

    };


    function instanceProgress() {
        return new Progress();
    }

    function Drag(obj) { // 使用拖拽
        this.obj = obj; // 对象
        this.startPointX = 0; // 开始的点
        this.startLeft = 0;
        this.percent = 0;
        this.init(); // 进行初始化
    }
    Drag.prototype = {
        init() {
            var This = this;
            this.obj.style.transform = 'translateX(0)'; //添加一个初始的位移值，目的是默认的时候能取到它

            //拖拽开始
            this.obj.addEventListener('touchstart', function(ev) {
                This.startPointX = ev.changedTouches[0].pageX;
                This.startLeft = parseFloat(this.style.transform.split('(')[1]);

                This.start && This.start(); //给用户提供一个对外的方法
            });

            //拖拽进行中
            this.obj.addEventListener('touchmove', function(ev) {
                This.disPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.disPointX + This.startLeft;

                if (l < 0) {
                    l = 0;
                } else if (l > this.offsetParent.offsetWidth) {
                    l = this.offsetParent.offsetWidth;
                }

                this.style.transform = 'translateX(' + l + 'px)';
                This.percent = l / this.offsetParent.offsetWidth; //拖拽的百分比，存储起来

                This.move && This.move(This.percent); //给用户提供一个对外的方法

                ev.preventDefault();
            });

            this.obj.addEventListener('touchend', function() {
                This.end && This.end(This.percent); //给用户提供一个对外的方法
            })

        }
    };

    function instanceDrag(obj) {
        return new Drag(obj)
    }

    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag
    }


})(window.player || (window.player = {}));