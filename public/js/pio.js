/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2021.5.6

一个支持更换 Live2D 模型的 JS 插件

本代码为奇趣保罗原创，并遵守 GPL 2.0 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var Paul_Pio = function (prop) {
    var that = this;

    var current = {
        idol: 0,
        menu: document.querySelector(".pio-container .pio-action"),
        canvas: document.getElementById("pio"),
        body: document.querySelector(".pio-container"),
        root: document.location.protocol +'//' + document.location.hostname +'/'
    };

    /* - 方法 */
    var modules = {
        // 更换模型
        idol: function () {
            current.idol < (prop.model.length - 1) ? current.idol++ : current.idol = 0;
            return current.idol;
        },
        // 创建内容
        create: function (tag, prop) {
            var e = document.createElement(tag);
            if(prop.class) e.className = prop.class;
            return e;
        },
        // 随机内容
        rand: function (arr) {
            return arr[Math.floor(Math.random() * arr.length + 1) - 1];
        },
        // 创建对话框方法
        render: function (text) {
            if(text.constructor === Array){
                dialog.innerText = modules.rand(text);
            }
            else if(text.constructor === String){
                dialog.innerText = text;
            }
            else{
                dialog.innerText = "輸入內容出現錯誤 X_X";
            }

            dialog.classList.add("active");

            clearTimeout(this.t);
            this.t = setTimeout(function () {
                dialog.classList.remove("active");
            }, 3000);
        },
        // 移除方法
        destroy: function () {
            that.initHidden();
            localStorage.setItem("posterGirl", 0);
        },
        // 是否为移动设备
        isMobile: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            ua = ua.indexOf("mobile") || ua.indexOf("android") || ua.indexOf("ios");

            return window.innerWidth < 500 || ua !== -1;
        }
    };
    this.destroy = modules.destroy;

    var elements = {
        home: modules.create("span", {class: "pio-home"}),
        skin: modules.create("span", {class: "pio-skin"}),
        info: modules.create("span", {class: "pio-info"}),
        night: modules.create("span", {class: "pio-night"}),
        close: modules.create("span", {class: "pio-close"}),

        show: modules.create("div", {class: "pio-show"})
    };

    var dialog = modules.create("div", {class: "pio-dialog"});
    current.body.appendChild(dialog);
    current.body.appendChild(elements.show);

    /* - 提示操作 */
    var action = {
        // 欢迎
        welcome: function () {
            if(document.referrer !== "" && document.referrer.indexOf(current.root) === -1){
                var referrer = document.createElement('a');
                referrer.href = document.referrer;
                prop.content.referer ? modules.render(prop.content.referer.replace(/%t/, "“" + referrer.hostname + "”")) : modules.render("歡迎來自 “" + referrer.hostname + "” 的朋友！");
            }
            else if(prop.tips){
                var text, hour = new Date().getHours();

                if (hour > 22 || hour <= 5) {
                    text = '你是夜貓子呀？這麽晚還不睡覺，明天起的來嘛';
                }
                else if (hour > 5 && hour <= 8) {
                    text = '早上好！';
                }
                else if (hour > 8 && hour <= 11) {
                    text = '上午好！工作順利嘛，不要久坐，多起來走動走動哦！';
                }
                else if (hour > 11 && hour <= 14) {
                    text = '中午了，工作了一個上午，現在是午餐時間！';
                }
                else if (hour > 14 && hour <= 17) {
                    text = '午後很容易犯困呢，今天的運動目標完成了嗎？';
                }
                else if (hour > 17 && hour <= 19) {
                    text = '傍晚了！窗外夕陽的景色很美麗呢，最美不過夕陽紅~';
                }
                else if (hour > 19 && hour <= 21) {
                    text = '晚上好，今天過得怎麽樣？';
                }
                else if (hour > 21 && hour <= 23) {
                    text = '已經這麽晚了呀，早點休息吧，晚安~';
                }
                else{
                    text = "奇趣保羅說：這個是無法被觸發的吧，哈哈";
                }

                modules.render(text);
            }
            else{
                modules.render(prop.content.welcome || "歡迎來到本站！");
            }
        },
        // 触摸
        touch: function () {
            current.canvas.onclick = function () {
                modules.render(prop.content.touch || 
                    ["你在幹什麽？", 
                    "再摸我就報警了！", 
                    "HENTAI!", 
                    "不可以這樣欺負我啦！"]);
            };
        },
        // 右侧按钮
        buttons: function () {
            // 返回首页
            elements.home.onclick = function () {
                location.href = current.root;
            };
            elements.home.onmouseover = function () {
                modules.render(prop.content.home || "不可以這樣欺負我啦！");
            };
            current.menu.appendChild(elements.home);

            // 更换模型
            elements.skin.onclick = function () {
                loadlive2d("pio", prop.model[modules.idol()]);
                prop.content.skin && prop.content.skin[1] ? modules.render(prop.content.skin[1]) : modules.render("新衣服真漂亮~");
            };
            elements.skin.onmouseover = function () {
                prop.content.skin && prop.content.skin[0] ? modules.render(prop.content.skin[0]) : modules.render("想看看我的新衣服吗？");
            };
            if(prop.model.length > 1) current.menu.appendChild(elements.skin);

            // 关于我
            elements.info.onclick = function () {
                window.open(prop.content.link || "https://paugram.com/coding/add-poster-girl-with-plugin.html");
            };
            elements.info.onmouseover = function () {
                modules.render("想了解更多關於我的信息嗎？");
            };
            current.menu.appendChild(elements.info);

            // 夜间模式
            if(prop.night){
                elements.night.onclick = function () {
                    typeof prop.night === "function" ? prop.night() : eval(prop.night);
                };
                elements.night.onmouseover = function () {
                    modules.render("夜間點擊這里可以保護眼睛呢");
                };
                current.menu.appendChild(elements.night);
            }

            // 关闭看板娘
            elements.close.onclick = function () {
                modules.destroy();
            };
            elements.close.onmouseover = function () {
                modules.render(prop.content.close || "QWQ 下次再見吧~");
            };
            current.menu.appendChild(elements.close);
        },
        custom: function () {
            prop.content.custom.forEach(function (t) {
                if(!t.type) t.type = "default";
                var e = document.querySelectorAll(t.selector);

                if(e.length){
                    for(var j = 0; j < e.length; j++){
                        if(t.type === "read"){
                            e[j].onmouseover = function () {
                                modules.render("想閱讀 %t 嗎？".replace(/%t/, "“" + this.innerText + "”"));
                            }
                        }
                        else if(t.type === "link"){
                            e[j].onmouseover = function () {
                                modules.render("想了解一下 %t 嗎？".replace(/%t/, "“" + this.innerText + "”"));
                            }
                        }
                        else if(t.text){
                            e[j].onmouseover = function () {
                                modules.render(t.text);
                            }
                        }
                    }
                }
            });
        }
    };

    /* - 运行 */
    var begin = {
        static: function () {
            current.body.classList.add("static");
        },
        fixed: function () {
            action.touch(); action.buttons();
        },
        draggable: function () {
            action.touch(); action.buttons();

            var body = current.body;
            body.onmousedown = function (downEvent) {
                var location = {
                    x: downEvent.clientX - this.offsetLeft,
                    y: downEvent.clientY - this.offsetTop
                };

                function move(moveEvent) {
                    body.classList.add("active");
                    body.classList.remove("right");
                    body.style.left = (moveEvent.clientX - location.x) + 'px';
                    body.style.top  = (moveEvent.clientY - location.y) + 'px';
                    body.style.bottom = "auto";
                }

                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", function () {
                    body.classList.remove("active");
                    document.removeEventListener("mousemove", move);
                });
            };
        }
    };

    // 运行
    this.init = function (onlyText) {
        if(!(prop.hidden && modules.isMobile())){
            if(!onlyText){
                action.welcome();
                loadlive2d("pio", prop.model[0]);
            }

            switch (prop.mode){
                case "static": begin.static(); break;
                case "fixed":  begin.fixed(); break;
                case "draggable": begin.draggable(); break;
            }

            if(prop.content.custom) action.custom();
        }
    };

    // 隐藏状态
    this.initHidden = function () {
        // ! 清除预设好的间距
        if(prop.mode === "draggable"){
            current.body.style.top = null;
            current.body.style.left = null;
            current.body.style.bottom = null;
        }

        current.body.classList.add("hidden");
        dialog.classList.remove("active");

        elements.show.onclick = function () {
            current.body.classList.remove("hidden");
            localStorage.setItem("posterGirl", 1);
            that.init();
        }
    }

    localStorage.getItem("posterGirl") == 0 ? this.initHidden() : this.init();
};

// 请保留版权说明
if (window.console && window.console.log) {
    console.log("%c Pio %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;","margin: 1em 0; padding: 5px 0; background: #efefef;");
}