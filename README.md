# h5PIP

    h5PIP 为一个为视频提供已封装好的画中画功能的插件。

    注意：模拟鼠标事件在画中画中无效。

## 使用方法

```html

    <!-- 视频节点 -->
    <video id="video" src="./fish-16166-s.mp4" controls playsinline loop></video>

    <!-- 导入插件 -->
    <script type="text/javascript" scr="h5pip.js"></script>

    <!-- 使用插件 -->
    <script type="text/javascript">
        var pip = new H5PIP({
            target:"#video"
        });
        // 打开画中画功能，必须在交互事件处理器中调用才有效。
        pip.open();
        // 关闭画中画功能，必须在交互事件处理器中调用才有效。
        pip.close();
    </script>
    
<<<<<<< HEAD
```
=======
```
>>>>>>> 54e4a6ff21404f2b2572f1c405c0018a2c40dc81
