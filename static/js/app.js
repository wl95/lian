//地图容器
var chart = echarts.init(document.getElementById('main'));
//34个省、市、自治区的名字拼音映射数组
var provinces = {
    //23个省
    "台湾": "taiwan",
    "河北": "hebei",
    "山西": "shanxi",
    "辽宁": "liaoning",
    "吉林": "jilin",
    "黑龙江": "heilongjiang",
    "江苏": "jiangsu",
    "浙江": "zhejiang",
    "安徽": "anhui",
    "福建": "fujian",
    "江西": "jiangxi",
    "山东": "shandong",
    "河南": "henan",
    "湖北": "hubei",
    "湖南": "hunan",
    "广东": "guangdong",
    "海南": "hainan",
    "四川": "sichuan",
    "贵州": "guizhou",
    "云南": "yunnan",
    "陕西": "shanxi1",
    "甘肃": "gansu",
    "青海": "qinghai",
    //5个自治区
    "新疆": "xinjiang",
    "广西": "guangxi",
    "内蒙古": "neimenggu",
    "宁夏": "ningxia",
    "西藏": "xizang",
    //4个直辖市
    "北京": "beijing",
    "天津": "tianjin",
    "上海": "shanghai",
    "重庆": "chongqing",
    //2个特别行政区
    "香港": "xianggang",
    "澳门": "aomen"
};

//全国地图打点
var maplist = [{
        name: "河北",
        value: ["114.502461", "38.045474"],
        state: "优秀"
    },
    {
        name: "黑龙江",
        value: ["126.642464", "45.756967"],
        state: "正常"
    },
    {
        name: "江苏",
        value: ["118.767413", "32.041544"],
        state: "优秀"
    }
]

var jiangsulist = [{
        name: "南京市",
        value: ["118.767413", "32.041544"],
        state: "花海",
        ziding: '花海'
    },
    {
        name: "无锡市",
        value: ["120.301663", "31.574729"],
        state: "正常"
    },
    {
        name: "徐州市",
        value: ["117.184811", "34.261792"],
        state: "正常"
    }
]
var mapdata = [];
var select_ed = {
    "江苏": "江苏",
    "河北": "河北",
    "黑龙江": "黑龙江"
} //地图显示高亮
//绘制全国地图
$.getJSON('static/map/china.json', function (data) {
    console.log(data)
    d = [];
    for (var i = 0; i < data.features.length; i++) {
        if (select_ed.hasOwnProperty(data.features[i].properties.name)) {
            d.push({
                name: data.features[i].properties.name,
                selected: true
            })
        } else {
            d.push({
                name: data.features[i].properties.name,
                selected: false

            })
        }
    }
    mapdata = d;
    console.log(mapdata)
    //注册地图
    echarts.registerMap('china', data);
    //绘制地图
    renderMap('china', d);
});
//地图点击事件
chart.on('click', function (params) {
    console.log(params.name);
    if (params.name in provinces) {
        //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
        $.getJSON('static/map/province/' + provinces[params.name] + '.json', function (data) {
            console.log(data);
            echarts.registerMap(params.name, data);
            var d = [];
            for (var i = 0; i < data.features.length; i++) {
                d.push({
                    name: data.features[i].properties.name
                })
            }
            renderMap(params.name, d, jiangsulist);
            var str = setTimeout(function () {
                san(jiangsulist)
            }, 700);
        });
        setTimeout(function () {
            option.series = []
            console.log(option.series)
        }, 800)
    } else {
        console.log(option.series)
        renderMap('china', mapdata);


    }
    if (params.seriesType == 'effectScatter' && params.data.ziding == '花海') {
        alert(11111);
        top.location.href = "./ind.html";
    }
});

//初始化绘制全国地图配置
var option = {
    tooltip: {
        trigger: 'item'

    },
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 1000
};
//绘制方法
function renderMap(map, data, maplist) {
    option.geo = {
        show: true,
        map: map,
        roam: false,
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: true,
            }
        },
        itemStyle: {
            normal: {
                borderWidth: 2.2,
                areaColor: "rgba(0,8,164,0.8)", //#1F11FA  #0008A4
                borderColor: "#2252F9"
                /* shadowColor: "#0523FD",
                  shadowBlur: 20*/
            },
            emphasis: {
                areaColor: '#100099', // 鼠标滑过选中的颜色
            }
        }

    }
    option.series = [{
            name: map,
            type: 'map',
            mapType: map,
            roam: false,
            nameMap: {
                'china': '中国'
            },
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: '#999',
                        fontSize: 13
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 13
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: 'rgba(0,8,164,0.8)',
                    borderColor: 'dodgerblue'
                },
                emphasis: {
                    areaColor: 'darkorange'
                }
            },
            data: data
        },

    ];
    //渲染地图
    chart.setOption(option);
}
//打点
function san(maplist) {

    console.log(arguments)
    option.series1 = [{
        type: "effectScatter",
        coordinateSystem: "geo",
        effectType: "",

        rippleEffect: {
            period: 10, //动画的周期，秒数。
            brushType: "stroke", //波纹的绘制方式，可选 'stroke' 和 'fill'。
            scale: 5 //缩放比例
        },
        encode: {
            value: 2
        },
        hoverAnimation: true,
        symbolSize: 10, //散点大小
        showEffectOn: "render",

        itemStyle: {
            normal: {
                //选取前颜色"#0AFFE5"
                color: function (maplist) {
                    /* console.log(555555);*/
                    console.log(maplist.data);
                    if (maplist.data.state === "优秀") {
                        return "#30CF80"; //绿色
                    }
                    if (maplist.data.state === "正常") {
                        return "#fff"; //白色
                    }
                    if (maplist.data.state === "异常") {
                        return "#FF6600"; //橘红色
                    }
                    if (maplist.data.state === "发展中") {
                        return "#FFFF00"; //黄色
                    }
                    if (maplist.data.state === "花海") {
                        return "red"; //红色
                    }
                },
                shadowBlur: 10,
                shadowColor: "#333"
            }
        },
        emphasis: {
            //选取后颜色
            itemStyle: {
                color: "#100099",
                shadowBlur: 15,
                shadowColor: "#333"
            }
        },
        data: maplist
    }]
    option.series.push(...option.series1)
    console.log(option.series)
    chart.setOption(option);
}