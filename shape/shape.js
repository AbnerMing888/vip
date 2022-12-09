$(function () {
    /**
     * 空心、实心、渐变监听
     * */
    var mShapeType = "0";
    $(".shape_name_input").val("shape_solid_radius_");
    $("input:radio[name='shapeType']").change(function () {
        let type = $(this).val();
        mShapeType = type;
        if (type === "0") {
            $(".input_rect2").css("display", "block");
            $(".input_rect3").css("display", "none");
            $(".input_rect4").css("display", "none");
            $(".input_rect5").css("display", "none");
            $(".input_rect_color").css("display", "none");
        } else if (type === "1") {
            $(".input_rect2").css("display", "none");
            $(".input_rect3").css("display", "block");
            $(".input_rect4").css("display", "block");
            $(".input_rect5").css("display", "block");
            $(".input_rect_color").css("display", "none");
        } else {
            //渐变
            $(".input_rect2").css("display", "none");
            $(".input_rect3").css("display", "none");
            $(".input_rect4").css("display", "none");
            $(".input_rect5").css("display", "none");
            $(".input_rect_color").css("display", "block");
        }
    });

    /**
     * 点击确定
     * */
    $(".shape_submit span").click(function () {

        let radius = $(".input_radius").val();//获取角度
        let color = $(".input_color").val();//获取颜色
        let solid = $(".input_solid").val();//获取底色
        let frame = $(".input_frame").val();//获取边框
        let frameSize = $(".input_frame_size").val();//获取边框大小

        //获取最终的选择方向
        var checkText = ""
        $.each($('input:checkbox'), function () {
            if (this.checked) {
                let v = $(this).val();
                checkText = checkText + v;
            }
        });

        if (checkText === "") {
            $(".shape_effect").css("border-radius", "10px");
        } else {
            $(".shape_effect").css({
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px"
            });
        }

        if (checkText.indexOf("0") !== -1) {
            $(".shape_effect").css("border-top-left-radius", radius + "px");
        }
        if (checkText.indexOf("1") !== -1) {
            $(".shape_effect").css("border-top-right-radius", radius + "px");
        }
        if (checkText.indexOf("2") !== -1) {
            $(".shape_effect").css("border-bottom-left-radius", radius + "px");
        }
        if (checkText.indexOf("3") !== -1) {
            $(".shape_effect").css("border-bottom-right-radius", radius + "px");
        }

        var endShapeText = "";
        if (mShapeType === "0") {
            //实心
            endShapeText = getSolidText(radius, color, checkText);

            if (color !== "") {
                $(".shape_effect").css({
                    "background-color": color
                });
            }
        } else if (mShapeType === "1") {
            //空心
            endShapeText = getStrokeText(radius, solid, frame, frameSize, checkText);
            if (solid !== "") {
                $(".shape_effect").css({
                    "border": "" + frameSize + "px solid " + frame,
                    "background-color": solid
                });
            }
        } else {
            //渐变
            endShapeText = getGradientXml(radius, checkText);
        }


        $(".shape_code").val(endShapeText);

    });


    //获取空心也就是带有边框的代码
    function getStrokeText(radius, solid, react, reactSize, checkText) {
        //不为空
        radius = radius + "dp";
        reactSize = reactSize + "dp";
        //边框颜色
        var content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
            "<shape xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
            "    >\n";
        content = content + "    <stroke\n" +
            "        android:width=\"" + reactSize + "\"\n" +
            "        android:color=\"" + react + "\" />\n";
        if (radius != null && (checkText === "" || checkText === "0123")) {
            //全部
            content = content + "    <corners android:radius=\"" + radius + "\" />\n";
        } else {

            content = content + "    <corners \n";
            if (checkText.indexOf("0") !== -1) {
                content = content + "android:topLeftRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("1") !== -1) {
                content = content + "        android:topRightRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("2") !== -1) {
                content = content + "        android:bottomLeftRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("3") !== -1) {
                content = content + "        android:bottomRightRadius=\"" + radius + "\"\n";
            }
            content = content + "        />\n";
        }

        content = content + " <solid android:color=\"" + solid + "\"/>\n";
        content = content + "</shape>"
        return content;
    }

    /**
     * 获取实心的代码
     * */
    function getSolidText(radius, color, checkText) {
        var content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
            "<shape xmlns:android=\"http://schemas.android.com/apk/res/android\">\n";

        radius = (radius == null || radius === "") ? "" : radius + "dp";

        if (radius != null && (checkText === "" || checkText === "0123")) {
            //全部
            content = content + "    <corners android:radius=\"" + radius + "\"></corners>\n";
        } else {
            content = content + "    <corners\n";
            if (checkText.indexOf("0") !== -1) {
                content = content + "        android:topLeftRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("1") !== -1) {
                content = content + "        android:topRightRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("2") !== -1) {
                content = content + "        android:bottomLeftRadius=\"" + radius + "\"\n";
            }
            if (checkText.indexOf("3") !== -1) {
                content = content + "        android:bottomRightRadius=\"" + radius + "\"\n";
            }
            content = content + "        />\n";
        }

        content = content + "    <solid android:color=\"" + color + "\" />\n";
        content = content + "</shape>";
        return content;
    }

    //获取渐变
    function getGradientXml(radius, checkText) {
        //渐变
        let inputReactStartColor = $(".input_react_start_color").val();//起始颜色
        let inputReactCenterColor = $(".input_react_center_color").val();//中间颜色
        let inputReactEndColor = $(".input_react_end_color").val();//结束颜色
        let inputReactGradientRadius = $(".input_react_gradient_radius").val();//渐变角度
        let shapeGradientType = $("input[name='shapeGradientType']:checked").val();

        if (inputReactGradientRadius == null || inputReactGradientRadius === "") {
            alert("请输入渐变角度");
            return "";
        }
        var sgType;
        if (shapeGradientType === "0") {
            sgType = "linear";
        } else if (shapeGradientType === "1") {
            sgType = "radial";
        } else {
            sgType = "sweep";
        }

        var gradient = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
            "<shape xmlns:android=\"http://schemas.android.com/apk/res/android\">\n" +
            "\n" +
            "    <gradient\n" +
            "        android:angle=\"" + inputReactGradientRadius + "\"\n";

        if (inputReactCenterColor != null && inputReactCenterColor !== "") {
            gradient = gradient + "        android:centerColor=\"" + inputReactCenterColor + "\"\n";
        }
        gradient = gradient + "        android:endColor=\"" + inputReactEndColor + "\"\n" +
            "        android:startColor=\"" + inputReactStartColor + "\"\n" +
            "        android:type=\"" + sgType + "\" />\n"
        //不为空
        if (radius !== "" && radius != null) {
            //取出默认配置前缀，若不为空，就追加
            radius = radius + "dp";
            if (checkText === "" || checkText === "0123") {
                //全部
                gradient = gradient + "    <corners android:radius=\"" + radius + "\"></corners>\n";
            } else {
                gradient = gradient + "    <corners\n";
                if (checkText.indexOf("0") !== -1) {
                    gradient = gradient + "        android:topLeftRadius=\"" + radius + "\"\n";
                }
                if (checkText.indexOf("1") !== -1) {
                    gradient = gradient + "        android:topRightRadius=\"" + radius + "\"\n";
                }
                if (checkText.indexOf("2") !== -1) {
                    gradient = gradient + "        android:bottomLeftRadius=\"" + radius + "\"\n";
                }
                if (checkText.indexOf("3") !== -1) {
                    gradient = gradient + "        android:bottomRightRadius=\"" + radius + "\"\n";
                }
                gradient = gradient + "        />\n";
            }
        }

        gradient = gradient + "</shape>";
        return gradient;
    }


    //获取名字
    $(".shape_get_name").click(function () {

        var color = "";
        if (mShapeType === "0") {//实心
            color = $(".input_color").val();
        } else if (mShapeType === "1") {//空心
            color = $(".input_solid").val();
        } else {
            //渐变
            let startColor = $(".input_react_start_color").val();
            let endColor = $(".input_react_end_color").val();

            color = startColor + "_to_" + endColor;
        }
        color = color.replaceAll("#", "");

        var radius = $(".input_radius").val();
        if (radius.indexOf("dp") !== 0) {
            radius = radius.replace("dp", "");
        }

        var checkText = ""
        $.each($('input:checkbox'), function () {
            if (this.checked) {
                let v = $(this).val();
                checkText = checkText + v;
            }
        });

        var lTRT = "";
        if (checkText !== "0123") {
            if (checkText.indexOf("0") !== -1 || checkText.indexOf("1") !== -1) {
                //左上
                lTRT = "_top"
            }
            if (checkText.indexOf("2") !== -1 || checkText.indexOf("3") !== -1) {
                //左下
                lTRT = "_bottom"
            }
        }

        if (mShapeType === "0") {
            //实心
            $(".shape_name_input").val("shape_solid" + lTRT + "_" + color + "_radius_" + radius);
        } else if (mShapeType === "1") {
            //空心
            $(".shape_name_input").val("shape_stroke" + lTRT + "_" + color + "_radius_" + radius);
        } else {
            //渐变
            $(".shape_name_input").val("shape_gradient" + lTRT + "_" + color + "_radius_" + radius);
        }
    });

    /**
     * 下载
     * */
    $(".shape_down_load").click(function () {
        let code = $(".shape_code").val();
        let fileName = $(".shape_name_input").val();
        if (code === "") {
            alert("请先生成代码");
            return;
        }
        if (fileName === "") {
            alert("请输入文件名字");
            return;
        }
        let file = new File([code], 'a.txt', {type: 'text/plain;charset=utf-8'});
        saveAs(file, fileName + ".xml");
    });
});