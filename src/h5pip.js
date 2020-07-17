/**
 * HTML5 Video Picture In Picture
 * html5 页面视频画中画支持插件。
 * @Author : 陈前帆 | sonny | thinkingMan
 * @Date   : 2020/7/17
 * @Time   : 10:23
 * @Project: h5PIP
 */
(function (window){
    /**
     *
     * @constructor
     * @param {Object} params h5 页面
     */
    var H5PIP = function (params){
        var self = this;
        // 默认参数
        this.params = {
            //
            target:"video",
            // 是否启动自动化，即在视频移出显示区域，自动显示。
            enableAutomation : true
        };

        // 获取参数。
        for (var key in params){
            if (this.params.hasOwnProperty(key)){
                this.params[key] = params[key];
            }
        }

        // 视频对象
        this.video = document.querySelector(this.params.target);

        // // 模拟按钮点击事件，用于实现自动显示画中画功能。
        // this.simulationBtn = document.createElement("button");
        // this.simulationBtn.id = "h5pip_simulation_btn";
        // this.simulationBtn.style = "display:none";
        // document.querySelector("body").appendChild(this.simulationBtn);
        // this.simulationBtn.addEventListener('click', function (event){
        //     // 禁用按钮，防止二次点击
        //     if (this.disabled){
        //         return;
        //     }
        //     this.disabled = true;
        //     try {
        //         if (!document.pictureInPictureElement) {
        //             // 尝试进入画中画模式
        //             self.video.requestPictureInPicture();
        //         } else {
        //             // 退出画中画
        //             document.exitPictureInPicture();
        //         }
        //     } catch(error) {
        //         console.log('&gt; 出错了！' + error);
        //     } finally {
        //         this.disabled = false;
        //     }
        // });

        // 当前浏览器是否支持画中画。
        this.isSupportedPIP = typeof this.video["requestPictureInPicture"] === "function";

        // 画中画弹出框。
        this.pipWindow = null;

        // 初始化插件。
        this.init();
    };

    H5PIP.prototype = {

        /**
         * 初始化插件。
         */
        init : function () {
            var self = this;

            // 侦听浏览器内容滚动事件。
            window.addEventListener('scroll', function(){
                self.onScroll();
            }, false);

            // 注册画中画
            this.initEventListener();
        },

        /**
         * 注册画中画相关事件处理器。
         */
        initEventListener: function (){
            var self = this;
            //
            this.video.addEventListener('enterpictureinpicture', function(event) {
                console.log(' 视频已进入Picture-in-Picture模式');
                self.pipWindow = event.pictureInPictureWindow;
                console.log('视频窗体尺寸为：'+ self.pipWindow.width +' x ' + self.pipWindow.height);

                // 添加resize事件，一切都是为了测试API
                self.pipWindow.addEventListener('resize', onPipWindowResize);
            });
            // 退出画中画模式时候
            this.video.addEventListener('leavepictureinpicture', function(event) {
                console.log('视频已退出Picture-in-Picture模式');
                // 移除resize事件
                self.pipWindow.removeEventListener('resize', onPipWindowResize);
            });
            // 视频窗口尺寸改变时候执行的事件
            var onPipWindowResize = function (event) {
                console.log('窗口尺寸改变为：'+ self.pipWindow.width +' x ' + self.pipWindow.height);
            }
        },

        /**
         *
         */
        onScroll: function(){
            var screenTop = 0;
            var screenRight = window.innerWidth;
            var screenLeft = 0;
            var screenBottom = window.innerHeight;
            var rect = this.video.getBoundingClientRect();
            console.log(rect);
            // ** 矩形相交判断 **
            // 滚动出屏幕底部
            if (rect.top > screenBottom) {
                console.log("滚动出屏幕底部");
                this.open(false);
                // 滚动出屏幕左侧
            }else if (rect.right < screenLeft){
                console.log("滚动出屏幕左侧");
                this.open(false);
                // 滚动出屏幕右侧
            }else if (rect.left > screenRight){
                console.log("滚动出屏幕右侧");
                this.open(false);
                // 滚动出屏幕顶部
            }else if (rect.bottom < screenTop){
                console.log("滚动出屏幕顶部");
                this.open(false);
            }else{ // 与屏幕区域相交不显示画中画。
                console.log("与屏幕区域相交不显示画中画");
                this.close(false);
            }
        },

        /**
         * 打开视频画中画。
         * @param {boolean} simulateClick 是否模拟鼠标单击。
         */
        open : function (simulateClick) {
            // 已经打开则不重复执行。
            if (document.pictureInPictureElement){
                return ;
            }
            if (!this.isSupportedPIP) {
                console.log("当前浏览器不支持<video/> 视频画中画功能！");
                return;
            }
            if (!document.pictureInPictureEnabled) {
                console.log("当前视频画中画功能未启用！");
                return;
            }
            // if (simulateClick){
            //     this.dispatchSimulateClickEvent();
            // }else{
                try {
                    this.pipWindow = this.video.requestPictureInPicture(); // 进入画中画模式
                } catch (e) {
                    console.error(e) // 处理异常
                }
            // }
        },

        /**
         * 抛出模拟单击事件。
         */
        dispatchSimulateClickEvent: function (){
            //
            // document.querySelector("#h5pip_simulation_btn").click();
            // $("#h5pip_simulation_btn").click();
            // TODO: 经实际测试，发现模拟鼠标事件在画中画中无效。
            // var ev = document.createEvent('MouseEvent');
            // ev.clientX = 0;
            // ev.clientY = 0;
            // ev.initEvent('click', false, true);
            // document.querySelector("#h5pip_simulation_btn").dispatchEvent(ev)
        },

        /**
         * 关闭视频画中画。
         * @param {boolean} simulateClick 是否模拟鼠标单击。
         */
        close: function (simulateClick){
            //
            if (!document.pictureInPictureElement){
                return ;
            }
            if (!this.isSupportedPIP){
                console.log("当前浏览器不支持<video/> 视频画中画功能！");
                return ;
            }
            if (!document.pictureInPictureEnabled){
                console.log("当前视频画中画功能未启用！");
                return ;
            }
            // if (simulateClick){
            //     this.dispatchSimulateClickEvent();
            // }else{
                // 退出画中画
                try{
                    document.exitPictureInPicture();
                }catch (e){
                    console.error(e) // 处理异常
                }
            // }
        }
    };

    window.H5PIP = H5PIP;
})(window);
