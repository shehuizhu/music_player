(function($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        this.listData = []; // 保存获取的数据
        // this.now = 1;
        this.indexObject = null; // 索引对象
        this.curIndex = 0; // 当前对象
        this.progress = player.progress.pro(); // 进度条对象
        this.list = null;

    }
    MusicPlayer.prototype = {
        init() {
            this.getDom();
            this.getData('../mock/data.json');
        },
        getDom() {
            this.img = document.querySelector('.imgInfo img');
            this.songInfo = document.querySelector('.songInfo');
            this.controls = document.querySelector('.controls');
            this.play_pause = this.controls.children[2]; // 控制 播放 暂停

        },
        getData(url) {
            const This = this;
            $.ajax({
                type: "get",
                url: url,
                success: function(data) {
                    This.indexObject = new player.indexControl(data.length); // 获取索引方面的对象
                    This.listData = data; // 获取数据对象
                    This.listPlay(); //列表音乐切换
                    This.loadMusic(This.indexObject.index);
                    This.musiControl(); // 音乐控制

                    This.dragProgress(); // 拖拽进度条

                },
                error: function() {
                    console.log('数据请求失败');
                }
            });
        },
        loadMusic(index) {
            player.render(this.listData[index]); //渲染相关信息
            player.music.load(this.listData[index].audioSrc); // 加载音乐  
            if (player.music.status == 'play') {
                player.music.play(); // 播放
                this.play_pause.className = 'playing';
                this.imgRotate(0); // 图片旋转
                this.progress.move(0); // 进度条开始动起来
            }
            this.curIndex = index;
            this.list.changeStyle(index); //改变列表歌曲的状态

            this.progress.renderAlltime(this.listData[index].duration); //渲染总时间

        },
        musiControl() {
            var This = this;
            // 暂停  播放
            this.play_pause.addEventListener('touchend', function() {
                if (player.music.status == 'pause') {
                    player.music.status = 'play';
                    This.loadMusic(This.indexObject.index);
                    this.className = 'playing'; //按钮变成播放状态
                    var deg = This.img.dataset.rotate || 0;
                    This.imgRotate(deg);
                    This.progress.move(); // 从原来开始的位置进行移动进度条

                } else {

                    player.music.status = 'pause';
                    This.loadMusic(This.indexObject.index);
                    this.className = '';
                    This.stopImg();
                    This.progress.stop()
                }
            }, false);
            //向上播放
            this.controls.children[1].addEventListener('touchend', function() {
                player.music.status = 'play';
                This.loadMusic(This.indexObject.prev());

                This.imgRotate(0);

            }, false);
            //下一首
            this.controls.children[3].addEventListener('touchend', function() {
                player.music.status = 'play';
                This.loadMusic(This.indexObject.next());
                This.imgRotate(0);
            }, false);
        },
        // 旋转图片
        imgRotate(deg) {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                deg = +deg + 0.2;
                this.img.dataset.rotate = deg;
                this.img.style.transform = 'rotate(' + deg + 'deg)';
            }, 1000 / 60);
        },
        // 停止图片旋转
        stopImg() {
            clearInterval(this.timer);
        },
        listPlay() {
            var This = this;
            this.list = player.listControl(this.listData, this.wrap);
            this.controls.children[4].addEventListener('touchend', function() {
                This.list.slideUp();
            }, false);
            this.list.listDd.forEach((ele, index) => {
                ele.addEventListener('touchend', function() {
                    if (this.curIndex == index) {
                        return;
                    }
                    player.music.status = 'play';
                    This.indexObject.index = index;
                    This.loadMusic(index);
                    This.list.slideDown();
                }, false);

            });

        },
        //进度条拖拽功能
        dragProgress() {
            var This = this;
            var circle = player.progress.drag(document.querySelector('.circle'));

            //按下圆点。进度条停止
            circle.start = function() {
                // console.log(123444);

                This.progress.stop();
            };

            //拖拽圆点
            circle.move = function(per) {
                This.progress.update(per);
            };

            //抬起圆点
            circle.end = function(per) {
                var cutTime = per * This.listData[This.indexObject.index].duration;

                player.music.playTo(cutTime);
                player.music.play();

                This.progress.move(per);

                var deg = This.img.dataset.rotate || 0;
                This.imgRotate(deg); //旋转图片

                This.controls.children[2].className = 'playing'; //按钮状态变成播放状态
            }
        }

    }
    var musicPlayer = new MusicPlayer(document.getElementsByClassName('wrap')[0])
    musicPlayer.init();

})(window.Zepto, window.player)