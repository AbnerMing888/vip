$(function () {

    //获取高度
    $(".json_body").css("height", $(document).height() - $(document).height() * 0.05);

    let endBeanContent;
    $(".json_to_body").click(function () {
        //转换对象
        let jsonContent = $(".json_content").val();
        if (jsonContent === "") {
            showMessage("请输入需要转换的json", 0);
            return
        }

        //进行格式化
        $(".json_content").val(formatToJson(jsonContent, false));

        let jsonName = $(".json_name").val();
        if (jsonName === "") {
            jsonName = "TestBean";
        }
        try {
            temporaryObject = "";
            let json = JSON.parse(jsonContent);
            endBeanContent = "export class " + jsonName +
                " {\n";
            endBeanContent = endBeanContent + forEachJson(json);
            endBeanContent = endBeanContent + "}\n" + temporaryObject;
            //生成到右侧
            let html = hljs.highlightAuto(endBeanContent).value;
            $(".json_code").html(html);


        } catch (e) {
            showMessage("请输入一个正确的json", 0);
        }

    });


    /*
    * 遍历Json
    * */
    let temporaryObject = "";//临时的对象

    function forEachJson(json) {
        let eachJson = "";
        for (let key in json) {
            let value = json[key];
            if (typeof value == "number") {
                eachJson = eachJson + "    " + key + "?: number\n";
            } else if (typeof value == "string") {
                eachJson = eachJson + "    " + key + "?: string\n";
            } else if (typeof value == "boolean") {
                eachJson = eachJson + "    " + key + "?: boolean\n";
            } else if (typeof value == "object") {
                //对象,判断是对象还是数组
                if (value == null) {//为空
                    eachJson = eachJson + "    " + key + "?: String? = null";
                } else {
                    //不为空
                    let objFirst = JSON.stringify(value).substring(0, 1);
                    let aCode = key.substring(0, 1).toUpperCase();
                    aCode = aCode + key.substring(1, key.length);
                    if (objFirst === "{") {
                        //对象,首先创建类名
                        let obj = "    " + key + "?: " + aCode + "\n";
                        //只创建属性，对象需要单独创建
                        eachJson = eachJson + obj;
                        //这里创建一个单独的对象
                        temporaryObject = temporaryObject + "\nexport class " + aCode +
                            " {\n";
                        temporaryObject = temporaryObject + forEachJson(value);
                        temporaryObject = temporaryObject + "}\n";
                    } else {
                        //数组
                        let obj = "    " + key + "?: " + aCode + "[]\n";
                        //只创建属性，对象需要单独创建
                        eachJson = eachJson + obj;
                        //这里创建一个单独的对象
                        temporaryObject = temporaryObject + "\nexport class " + aCode +
                            " {\n";
                        temporaryObject = temporaryObject + forEachJson(value[0]);
                        temporaryObject = temporaryObject + "}\n";

                    }
                }
            }
        }

        return eachJson;
    }


    //格式化Json
    function formatToJson(txt, compress) {
        var indentChar = '    ';
        if (/^\s*$/.test(txt)) {
            console.log('数据为空,无法格式化! ');
            return;
        }
        try {
            var data = eval('(' + txt + ')');
        } catch (e) {
            console.log('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
            return;
        }
        var draw = [],
            last = false,
            This = this,
            line = compress ? '' : '\n',
            nodeCount = 0,
            maxDepth = 0;

        var notify = function (name, value, isLast, indent, formObj) {
            nodeCount++; /*节点计数*/
            for (var i = 0, tab = ''; i < indent; i++)
                tab += indentChar; /* 缩进HTML */
            tab = compress ? '' : tab; /*压缩模式忽略缩进*/
            maxDepth = ++indent; /*缩进递增并记录*/
            if (value && value.constructor === Array) {
                /*处理数组*/
                draw.push(
                    tab + (formObj ? '"' + name + '":' : '') + '[' + line
                ); /*缩进'[' 然后换行*/
                for (var i = 0; i < value.length; i++)
                    notify(i, value[i], i === value.length - 1, indent, false);
                draw.push(
                    tab + ']' + (isLast ? line : ',' + line)
                ); /*缩进']'换行,若非尾元素则添加逗号*/
            } else if (value && typeof value == 'object') {
                /*处理对象*/
                draw.push(
                    tab + (formObj ? '"' + name + '":' : '') + '{' + line
                ); /*缩进'{' 然后换行*/
                var len = 0,
                    i = 0;
                for (var key in value)
                    len++;
                for (var key in value)
                    notify(key, value[key], ++i === len, indent, true);
                draw.push(
                    tab + '}' + (isLast ? line : ',' + line)
                ); /*缩进'}'换行,若非尾元素则添加逗号*/
            } else {
                if (typeof value == 'string') value = '"' + value + '"';
                draw.push(
                    tab +
                    (formObj ? '"' + name + '":' : '') +
                    value +
                    (isLast ? '' : ',') +
                    line
                );
            }
        };
        var isLast = true,
            indent = 0;
        notify('', data, isLast, indent, false);
        return draw.join('');
    }

    $(".codeCopy").click(function () {
        //复制内容
        let codeContent = $(".json_code").text();
        console.log(codeContent)
        if (codeContent != null && codeContent != "") {
            copy(codeContent);
            showMessage("复制成功", 1);
        } else {
            showMessage("请转换对象后再复制", 0);
        }

    });

    //copyId 要复制的内容
    function copy(copyId) {
        var oInput = document.createElement('textarea');
        oInput.value = copyId;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
    }

    function showMessage(message, type) {
        $(".infoDiv").css("display", "block");
        $(".infoDiv").text(message);
        if (type === 0) {
            $(".infoDiv").css("background-color", "#ff0000");
        } else {
            $(".infoDiv").css("background-color", "#6a8759");
        }

        setTimeout(function () {
            $(".infoDiv").css("display", "none");
        }, 2000);


    }
});