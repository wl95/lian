(function($, doc) {
	$.init();
	
	window.addEventListener('resetPage',function(event){
		plus.webview.currentWebview().reload();
	});
	
	$.plusReady(function(){
		var osName = plus.os.name;  
	    if(osName === 'Android') {  
	        fullScreenOfAndroid();  
	    } else if(osName === 'iOS') {  
	        var videoElem = document.getElementById('myPlayer');  
	        fullScreenOfIos(videoElem);  
	    }
	    
	    // iOS平台的视频全屏旋转  
		function fullScreenOfIos(videoElem) {  
		    // 监听的事件与Android平台有很大区别  
		    videoElem.addEventListener('webkitbeginfullscreen', function() {  
		        plus.screen.lockOrientation('landscape'); //锁死屏幕方向为横屏  
		    });  
		    videoElem.addEventListener('webkitendfullscreen', function() {  
		        plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏  
		    });  
		};  
		
		// Android平台的视频全屏旋转  
		function fullScreenOfAndroid() {  
		    if(true) {  
		        // 最新5+API的支持  
		        var self = plus.webview.currentWebview();  
		        self.setStyle({  
		            videoFullscreen: 'landscape'  
		        });  
		    } else {  
                 document.addEventListener('webkitfullscreenchange', function() {  
                    var el = document.webkitFullscreenElement; //获取全屏元素  
                    if(el) {  
                        plus.screen.lockOrientation('landscape'); //锁死屏幕方向为横屏  
                    } else {  
                        plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏  
                    }  
                });  
		    }  
		};
        
	});
		
		//关闭视频
		jQuery("#videoOption")[0].addEventListener('tap',function(){
			jQuery('#myPlayer').remove();
			jQuery('#liveVideo').hide().append('<video id="myPlayer" class="video-style" controls  autoplay></video>');
		});
		
		//关闭chart
		jQuery("#chartOption")[0].addEventListener('tap',function(){
			jQuery(this).parent().hide().siblings('#chart-btn').show();
		});
		
		var projectId = localStorage.getItem("IPARK_APP_PROJECTID");
		var map = new BMap.Map('mapContainer');
		var point,levelNow,longitude,latitude,persondata;
		//定义路线数组、项目范围全局变量
		var roadList=[],polygonMap = {},polygonMapList = [];
		var pts = [];
		var sensorTypeList = ['worker','trash','soil','weather','smoke','cam'];
		
		Util.ajax({
            type: 'get',
            dataType:'json',
            url: 'project/findById',
            data:{id:projectId},
            success:function(data){
            	if(data.longitude != null && data.latitude != null){
                    longitude = data.longitude;
                    latitude = data.latitude;
                }
            	initMap(longitude,latitude);
            }
      	});
		
		//地图初始化
		function initMap(longitude,latitude){
			var nowLevel = 17;
			//如果经度与纬度都存在
			if(longitude && latitude){
				point = new BMap.Point(longitude,latitude); // 创建点坐标  
            	map.centerAndZoom(point, nowLevel);
			}else{
				nowLevel = 6;
				point = new BMap.Point(108.7712386400,35.5380089796); // 默认点坐标  
            	map.centerAndZoom(point, nowLevel);
            	mui.toast("当前项目未设定项目坐标！");
			}
            map.enableScrollWheelZoom(false);    // 启用滚轮放大缩小，默认禁用  
            map.enableContinuousZoom();    // 启用地图惯性拖拽，默认禁用 
            projectRoad(nowLevel);
            map.addEventListener("zoomend", //监听缩放事件
                function(){ 
                    levelNow = map.getZoom();//当前地图等级
                    //地图范围13至20
                   	resizeMap(levelNow);
                   	map.clearOverlays();
                   	//根据地图当前等级重新绘制线宽
                	jQuery.each(roadList,function(i,a){
                   		var width = getRoadWidth(a.width,levelNow);
                   		if(width != '0'){
                   			a.obj.setStrokeWeight(width);
							map.addOverlay(a.obj)
                   		}
                   	});
                   	//重新绘制地图范围
                   	jQuery.each(polygonMapList,function(i,b){
                   		map.addOverlay(b);
                   	});
                   	clearTimeout(t);//清除计时器
                   	allSensor();
					var t = setInterval(function(){
						allSensor();
					}, 300000);
                }
            );
		}
		
		//人员,垃圾桶，土壤，气象，烟感，摄像头的图标切换
		jQuery(".sensor-name").each(function(){
			jQuery(this).on('click',function(){
				jQuery('#chart-weather').hide();
				jQuery('#myPlayer').remove();
				jQuery('#liveVideo').hide().append('<video id="myPlayer" class="video-style" controls  autoplay></video>');
				//切换效果
				jQuery(this).siblings('.showAllInfo').show();
				var src = jQuery(this).find('img').attr('src').replace('_off','');
				jQuery(this).find('img').attr('src',src);
				jQuery(this).siblings('.sensor-name').find('img').each(function(){
					var orgSrc = jQuery(this).attr('src');
					if(orgSrc.indexOf('_off') < 0){
						var tempSrc = orgSrc.replace('.png','_off.png');
						jQuery(this).attr('src',tempSrc);	
					}
				});
				//将加载数组置空
				sensorTypeList = [];
				sensorTypeList.push(jQuery(this).data("type"));
				if(jQuery(this).data("type") == "worker"){
					if(jQuery("#chart-others")[0].style.display != "block"){
						jQuery(".charts-btn").show();
					}
				}else{
					jQuery(".charts-btn").hide().siblings('#chart-others').hide();
				}
				allSensor();
			});
		});
		
		//显示饼图
		jQuery(".charts-btn").on("click",function(){
			jQuery(this).hide().siblings('#chart-others').show();
			jQuery("#chart-worker").show();
			drawChart();
		})
		
		//点击全部
		jQuery(".showAllInfo").on('click',function(){
			jQuery(this).hide().siblings('.sensor-name').find('img').each(function(){
				var orgSrc = jQuery(this).attr('src');
				if(orgSrc.indexOf('_off') > -1){
					var tempSrc = orgSrc.replace('_off','');
					jQuery(this).attr('src',tempSrc);	
				}
			});
			sensorTypeList = ['worker','trash','soil','weather','smoke','cam'];
			allSensor();
		});
		
		//显示地图窗口
		function showWindow(marker,type){
			var panelCon = creatCon(marker.dataInfo,type);
            var infoWindow = new BMap.InfoWindow(panelCon, {
                width: 200
            }); 
            map.openInfoWindow(infoWindow, marker.point); //开启信息窗口
       }
		
		//拼接弹窗内容
		function creatCon(data,type){
			//土壤弹窗
			var soilContent = '<div class="mapWin">'
                			+ '<div class="mui-row label-row"><label>编号：</label><span class="copy">'+ data.deviceCode+'</span></div>'
			                + '<div class="mui-row label-row"><label>状态：</label>'+data.statusdesc+'</div>'
			                + '<div class="mui-row">'
				                + '<div class="sensor-info" style="width: 50%;">'
									+ '<span class="left-info iconfont">&#xe6ad;</span>'
									+ '<div class="right-info">'
										+ '<p class="info-title">土壤温度</p>'
										+ '<p class="info-num">'+(-(-data.temperature)).toFixed(2)+'<span class="info-unit">℃</span></p>'
									+ '</div>'
								+ '</div>'
								+ '<div class="sensor-info" style="width: 50%;">'
									+ '<span class="left-info iconfont">&#xe6aa;</span>'
									+ '<div class="right-info">'
										+ '<p class="info-title">土壤湿度</p>'
										+ '<p class="info-num">'+(-(-data.humidity)).toFixed(2)+'<span class="info-unit">%</span></p>'
									+ '</div>'
								+ '</div>'
			                + '</div>'
			        	+ '</div>';
			var weatherContent = '<div class="mapWin">'
                			+ '<div class="mui-row label-row"><label>编号：</label><span class="copy">'+ data.deviceCode+'</span></div>'
			                + '<div class="mui-row label-row no-border"><label>状态：</label>'+data.statusDesc+'</div>'
			        	+ '</div>';
			var workerContent = '<div class="mapWin">'
				    			+ '<div class="mui-row label-row"><label>编号：</label><span class="copy">'+ data.devId+'</span></div>'
				                + '<div class="mui-row label-row no-border"><label>状态：</label>'+ (data.sos==1 ? "SOS告警" : "正常" )+'<a href="tel:'+data.mobile+'"><span class="iconfont specical-call">&#xe68d;</span></a></div>'
				        	+ '</div>';
        	var smokeContent = '<div class="mapWin">'
				    			+ '<div class="mui-row label-row"><label>编号：</label><span class="copy">'+ data.deviceNumber+'</span></div>'
				                + '<div class="mui-row label-row no-border"><label>状态：</label>';
			var smokePhone = "inline-block";
				switch(data.status) {
					case "0":
						smokeContent += "正常";
						smokePhone = "none";
						break;
					case "1":
						smokeContent += "电量不足";
						break;
					case "3":
						smokeContent += "烟雾预警";
						break;
					case "4":
						smokeContent += "烟雾报警";
						break;
					default :
						smokeContent += "失联";
						break;
				}
				smokeContent += '<a href="tel:'+data.mobile+'" style="display:'+smokePhone+'"><span class="iconfont specical-call">&#xe68d;</span></a>'
						+'</div>'
				    + '</div>';
			var trashContent = '<div class="mapWin">'
				    			+ '<div class="mui-row label-row"><label>编号：</label><span class="copy">'+ data.deviceNumber+'</span></div>'
				                + '<div class="mui-row label-row no-border">'
				                	+'<label>状态：</label>'+ (data.status == "0" ? "正常" : (data.status == "1" ? "溢满" : "失联") )
				                	+'<a href="tel:'+data.mobile+'" style="display:'+(data.status == "0" ? "none" : "inline-block")+'"><span class="iconfont specical-call">&#xe68d;</span></a>'
				                +'</div>'
				        	+ '</div>';
			var camContent = '<div class="mapWin">'
				    			+ '<div class="mui-row label-row  no-border"><label>编号：</label><span class="copy">'+ data.deviceNumber+'</span></div>'
				        	+ '</div>';
			switch(type){
				case "soil":
					return soilContent;
				case "weather":
					return weatherContent;
				case "worker":
					return workerContent;
				case "smoke":
					return smokeContent;
				case "trash":
					return trashContent;
				case "cam":
					return camContent;
					
			}
		}
		
		//显示气象站传感器相关参数
		function showWeatherInfo(data){
			jQuery('#chart-weather').show().siblings('#chart-others').hide();
			jQuery(".weathertmperature","#chart-weather").text(-(-data.weathertemplate).toFixed(2));
			jQuery(".weatherhumidity","#chart-weather").text(-(-data.weatherhum).toFixed(2));
			jQuery(".pressure","#chart-weather").text(-(-data.pressure).toFixed(0));
			jQuery(".rainfall","#chart-weather").text(-(-data.rainfall).toFixed(2));
			jQuery(".windspeed","#chart-weather").text(-(-data.windspeed).toFixed(2));
			var winddirect = formatWind(data.winddirect);
			jQuery(".winddirection","#chart-weather").text(winddirect);
		}
		
		/**
		* @description 通过度数格式化风向
		* @param windDeg
		*/
		function formatWind(windDeg) {
			if (0 < windDeg && windDeg <= 22.25 || windDeg > 337.75) {
				return '北风';
			} else if (22.25 < windDeg && windDeg <= 67.25) {
				return '东北风';
			} else if (67.25 < windDeg && windDeg <= 112.25) {
				return '东风';
			} else if (112.25 < windDeg && windDeg <= 157.25) {
				return '东南风';
			} else if (157.25 < windDeg && windDeg <= 202.25) {
				return '南风';
			} else if (202.25 < windDeg && windDeg <= 247.25) {
				return '西南风';
			} else if (247.25 < windDeg && windDeg <= 292.25) {
				return '西风';
			} else if (292.25 < windDeg && windDeg <= 337.25) {
				return '西北风';
			}
		}
		
		//项目道路显示
		function projectRoad(levelNow){
            //加载道路框定
            Util.ajax({
                type: 'get', 
                url: 'projectRoad/list',
                data: {
                    projectId: projectId
                },
                success:function(res){
                	if(res.length > 0){
                        //循环道路数据
                        jQuery.each(res,function(i,value){
	                   		var array=[],lineObj={};
	                   		jQuery.each(value.point,function(i,value){
	                   			array.push(new BMap.Point(value.longitude, value.latitude));
	                   		});
                            //绘制查询到的路线
                            var width = getRoadWidth(value.roadWidth,levelNow);
                            lineObj = new BMap.Polyline(array, {strokeColor:value.roadColour || '#ffffff', strokeWeight:width, strokeOpacity:1});
                            map.addOverlay(lineObj);
                            //将每个路线的对象存入数组
                            roadList.push({
                            	obj:lineObj,
                            	width:value.roadWidth
                            });
                            if(width == 0){
                                lineObj.hide();
                            }
	                   	});
                    }
                	porjectRange();
                }
            });
		}

		//项目框定
		function porjectRange(){
        	Util.ajax({
                type: 'get', 
                url: 'homePage/selectByIdFrame',
                data: {
                    projectId: projectId
                },
                success:function(res){
					if(res && res.length > 0){
                        var polygonPoints = [];
                        //渲染项目框定
                        for (var i = 0,len = res.length; i < len; i++) {
                            if(res[i].fenceType == 'M'){

                                if(!polygonMap[res[i].fenceCode]){
                                    polygonMap[res[i].fenceCode] = [];
                                }
                                var tempPoint =  new BMap.Point(res[i].longitude, res[i].latitude);
                                polygonMap[res[i].fenceCode].push(tempPoint);
                                pts.push(tempPoint);
                            }
                        }
						
                        for(var key in polygonMap){
                        	var obj = new BMap.Polygon(polygonMap[key], {strokeColor:"#4ef037",fillColor:"#4ef037", strokeWeight:3, strokeOpacity:1,fillOpacity:0.2});
                            map.addOverlay(obj);
                            polygonMapList.push(obj);
                        }
                    }
					allSensor();
					t = setInterval(function(){
						allSensor();
					}, 300000);
                }
            });
       	}
		
		//所有传感器
		function allSensor(){
			//清除marker			                	
			var allOverlay = map.getOverlays();
			for(var i = 0;i<allOverlay.length;i++) {
				if(allOverlay[i].toString()=="[object Marker]"){  
                    map.removeOverlay(allOverlay[i]);  
                }  
           	}
			
			for(var a in sensorTypeList){
				switch(sensorTypeList[a]){
					case "worker":
						workerGis();
						break;
					case "soil":
						soilGis();
						break;
					case "weather":
						weatherGis();
						break;
					case "trash":
						trashGis();
						break;
					case "cam":
						camGis();
						break;
					case "smoke":
						smokeGis();
						break;
				}
			}
		}
        
        //人员Gis显示
        function workerGis(){
        	Util.ajax({
                type: 'get', 
                url: 'homePage/getPersonnelCount',
                data: {
                    projectId: projectId,
                    types: ['700C']
                },
                success:function(res){
                    var workerNormal_icon = new BMap.Icon("../images/icon/worker.svg", new BMap.Size(30, 39), {anchor: new BMap.Size(15,39)});
                    var workerSos_icon = new BMap.Icon("../images/icon/workerSOS.svg", new BMap.Size(30, 39), {anchor: new BMap.Size(15,39)});
                    if(res.list.length > 0){
                    	jQuery("[data-type='worker']").show();
                    	var ply = new BMap.Polygon(pts);
                    	var count = 0,sos = res.sosCount,total = res.list.length;//考勤正常的人数
                        for (var i = 0,len = res.list.length; i < len; i++) {
                        	var marker,dev = res.list[i];
                        	var point = new BMap.Point(
		                        dev.longitude,
		                        dev.latitude
		                    );
                        	var result = BMapLib.GeoUtils.isPointInPolygon(point,ply);
							if(result){
								count++;
	                            //判断当前的用户状态（0：正常 ，1：异常）
	                            if(dev.sos == "1"){
	                            	marker = new BMap.Marker(point,{icon: workerSos_icon});
	                            }else{
	                            	marker = new BMap.Marker(point,{icon: workerNormal_icon});
	                            }
	                            marker.dataInfo = dev;
		                        marker.addEventListener('click', function(e) {
		                        	var allOverlay = map.getOverlays();
									for (var i = 0;i < allOverlay.length;i++) {
										if (allOverlay[i].isBig) {
											allOverlay[i].setIcon(allOverlay[i].icon);
										}
									}
		                            var p = e.target;
	                            	jQuery('#chart-weather').hide()
	                            	showWindow(p,'worker'); 
	                            	if(this.dataInfo.sos == "1"){
	                            		this.icon = workerSos_icon;
		                            	this.setIcon(new BMap.Icon("../images/icon/workerSOS.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
		                            }else{
		                            	this.icon = workerNormal_icon;
		                            	this.setIcon(new BMap.Icon("../images/icon/worker.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
		                            }
		                            this.isBig = true;
		                        });
	                            map.addOverlay(marker);
							}
                        }
                    }else{
                    	jQuery(".charts-btn").hide();
                    	jQuery("[data-type='worker']").hide();
                    }
                    persondata = [{
                    	value:count,
                    	name:"在岗"
                    },{
                    	value:sos,
                    	name:"SOS"
                    },{
                    	value:total - count,
                    	name:"脱岗"
                    }];
                    jQuery('.totalNumber','.totalContent').html(total+"位");
                }
            });
        }
        
        //土壤传感器
        function soilGis(){
        	Util.ajax({
                type: 'get', 
                url: '/homePage/deviceInfo',
                data: {
                    projectId: projectId,
                    page: 0,
        			size: 10000
                },
                success:function(res){
                	var ic_icon = new BMap.Icon("../images/icon/sensor.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
                    if(res && res.content && res.content.length > 0){
                    	jQuery("[data-type='soil']").show();
                        for (var i = 0,len = res.content.length; i < len; i++) {
                        	var dev = res.content[i];
	                        var marker,type = dev.deviceType;
	                        //这俩类型都是土壤传感器设备类型
	                        if(type == 'S' || type =='NS'){
		                        marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: ic_icon });
		                        marker.dataInfo = dev;
		                        marker.addEventListener('click', function(e) {
		                        	var allOverlay = map.getOverlays();
									for (var i = 0;i < allOverlay.length;i++) {
										if (allOverlay[i].isBig) {
											allOverlay[i].setIcon(allOverlay[i].icon);
										}
									}
		                            var p = e.target;
	                            	jQuery('#chart-weather').hide();
	                            	showWindow(p,'soil');
	                            	this.icon = ic_icon;
	                            	this.isBig = true;
	                            	this.setIcon(new BMap.Icon("../images/icon/sensor.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
		                        });
	                        	map.addOverlay(marker);
	                        }
                        }
                    }else{
                    	jQuery("[data-type='soil']").hide();
                    }
                }
            });
        }
        
        //气象传感器
        function weatherGis(){
        	Util.ajax({
                type: 'get', 
                url: '/homePage/deviceInfo',
                data: {
                    projectId: projectId,
                    page: 0,
        			size: 10000
                },
                success:function(res){
    				var wet_icon = new BMap.Icon("../images/icon/weather.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
                    if(res && res.content && res.content.length > 0){
                    	jQuery("[data-type='weather']").show();
                        for (var i = 0,len = res.content.length; i < len; i++) {
                        	var dev = res.content[i];
	                        var marker, type = dev.deviceType;
	                        if(type == 'W'){
		                        marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: wet_icon });
		                        marker.dataInfo = dev;
		                        marker.addEventListener('click', function(e) {
		                        	var allOverlay = map.getOverlays();
									for (var i = 0;i < allOverlay.length;i++) {
										if (allOverlay[i].isBig) {
											allOverlay[i].setIcon(allOverlay[i].icon);
										}
									}
		                            var p = e.target;
		                            this.setIcon(new BMap.Icon("../images/icon/weather.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
	                            	showWeatherInfo(this.dataInfo);
	                            	showWindow(p,'weather');
	                            	this.icon = wet_icon;
	                            	this.isBig = true;
		                        });
	                        	map.addOverlay(marker);
	                        }
                        }
                    }else{
                    	jQuery("[data-type='weather']").hide();
                    }
                }
            });
        }
        
        //烟感设备
        function smokeGis(){
        	Util.ajax({
                type: 'get', 
                url: '/dataSmoke/getSmokeByProjectId',
                data: {
                    projectId: projectId
                },
                success:function(res){
    				var smoke_icon = new BMap.Icon("../images/icon/smoke.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var smokepowerLow_icon = new BMap.Icon("../images/icon/smokepowerLow.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var smoke_alarm_icon = new BMap.Icon("../images/icon/smoke_alarm.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var smoke_alarmHight_icon = new BMap.Icon("../images/icon/smoke_alarmHight.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var smokeLost_icon = new BMap.Icon("../images/icon/smokeLost.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
                    if(res && res.length > 0){
                    	jQuery("[data-type='smoke']").show();
                        for (var i = 0,len = res.length; i < len; i++) {
                        	var dev = res[i],marker;
                        	//根据当前的烟感设备状态进行判断，status ： 0  "正常" ，1 "低电量"，3 "微烟",4 "浓烟"
                            switch(dev.status){
                            	case "0":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: smoke_icon });
                            		break;
                            	case "1":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: smokepowerLow_icon });
                            		break;
                            	case "3":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: smoke_alarm_icon });
                            		break;
                            	case "4":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: smoke_alarmHight_icon });
                            		break;
                            	default:
                            	    marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: smokeLost_icon });
                            		break;	
                            }
	                        
	                        marker.dataInfo = dev;
	                        marker.addEventListener('click', function(e) {
	                        	jQuery('#chart-weather').hide();
	                        	var allOverlay = map.getOverlays();
								for (var i = 0;i < allOverlay.length;i++) {
									if (allOverlay[i].isBig) {
										allOverlay[i].setIcon(allOverlay[i].icon);
									}
								}
	                            var p = e.target;
	                            //根据当前的烟感设备状态进行判断，status ： 0  "正常" ，1 "低电量"，3 "微烟",4 "浓烟"
	                            switch(this.dataInfo.status){
	                            	case "0":
	                            		this.setIcon(new BMap.Icon("../images/icon/smoke.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = smoke_icon;
	                            		break;
	                            	case "1":
	                            		this.setIcon(new BMap.Icon("../images/icon/smokepowerLow.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = smokepowerLow_icon;
	                            		break;
	                            	case "3":
	                            		this.setIcon(new BMap.Icon("../images/icon/smoke_alarm.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = smoke_alarm_icon;
	                            		break;
	                            	case "4":
	                            		this.setIcon(new BMap.Icon("../images/icon/smoke_alarmHight.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = smoke_alarmHight_icon;
	                            		break;
	                            	default :
	                            		this.setIcon(new BMap.Icon("../images/icon/smokeLost.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = smokeLost_icon;
	                            }
                            	showWindow(p,'smoke');
                            	this.isBig = true;
	                        });
                        	map.addOverlay(marker);
	                        
                        }
                    }else{
                    	jQuery("[data-type='smoke']").hide();
                    }
                }
            });
        }
        
         //垃圾桶设备
        function trashGis(){
        	Util.ajax({
                type: 'get', 
                url: '/dataTrash/getTrashByProjectId',
                data: {
                    projectId: projectId
                },
                success:function(res){
    				var trash_icon = new BMap.Icon("../images/icon/trash.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var trashFull_icon = new BMap.Icon("../images/icon/trashFull.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
    				var trashLost_icon = new BMap.Icon("../images/icon/trashLost.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
                    if(res && res.length > 0){
                    	jQuery("[data-type='trash']").show();
                        for (var i = 0,len = res.length; i < len; i++) {
                        	var dev = res[i],marker;
                        	//根据当前的垃圾桶设备状态进行判断，status ： 0  "正常" ，1 "溢满"，B "失联"
                        	switch(dev.status){
                        		case "0":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: trash_icon });
                        			break;
                            	case "1":
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: trashFull_icon });
                        			break;
                            	default:
                            		marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: trashLost_icon });
                        			break;
                        	}
	                        marker.dataInfo = dev;
	                        marker.addEventListener('click', function(e) {
	                        	jQuery('#chart-weather').hide();
	                        	var allOverlay = map.getOverlays();
								for (var i = 0;i < allOverlay.length;i++) {
									if (allOverlay[i].isBig) {
										allOverlay[i].setIcon(allOverlay[i].icon);
									}
								}
	                            var p = e.target;
	                            //根据当前的垃圾桶设备状态进行判断，status ： 0  "正常" ，1 "溢满"，B "失联"
	                            switch(this.dataInfo.status){
	                            	case "0":
	                            		this.setIcon(new BMap.Icon("../images/icon/trash.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = trash_icon;
                            			break;
	                            	case "1":
	                            		this.setIcon(new BMap.Icon("../images/icon/trashFull.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = trashFull_icon;
                            			break;
	                            	default:
	                            		this.setIcon(new BMap.Icon("../images/icon/trashLost.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            			this.icon = trashLost_icon;
                            			break;
	                            }
                            	showWindow(p,'trash');
                            	this.isBig = true;
	                        });
                        	map.addOverlay(marker);
	                        
                        }
                    }else{
                    	jQuery("[data-type='trash']").hide();
                    }
                }
            });
        }
        
        //监控摄像头
        function camGis(){
        	Util.ajax({
                type: 'get', 
                url: '/device/all',
                data: {
                	page:0,
                	size:9999,
                	deviceType:'CA',
                    projectId: projectId
                },
                success:function(res){
                	if(res.totalElements && res.totalElements>0){
                		jQuery("[data-type='cam']").show();
                		var cam_icon = new BMap.Icon("../images/icon/cam.svg",new BMap.Size(30, 39),{ anchor: new BMap.Size(15, 39) });
                		var deviceList = res.content;
                		for (var i = 0,len = deviceList.length; i < len; i++) {
                        	var dev = deviceList[i],marker;
							marker = new BMap.Marker(new BMap.Point(dev.longitude,dev.latitude),{ icon: cam_icon });
	                        marker.dataInfo = dev;
	                        marker.addEventListener('click', function(e) {
	                        	//点击摄像头，请求接口，同时显示直播区域
	                        	jQuery('#liveVideo').show();
	                        	jQuery("#backdrop").show();
	                        	getVideoUrl(this.dataInfo.id);
	                        	
	                        	jQuery('#chart-weather').hide();
	                        	var allOverlay = map.getOverlays();
								for (var i = 0;i < allOverlay.length;i++) {
									if (allOverlay[i].isBig) {
										allOverlay[i].setIcon(allOverlay[i].icon);
									}
								}
	                            var p = e.target;
	                            this.setIcon(new BMap.Icon("../images/icon/cam.svg",new BMap.Size(60, 79),{ anchor: new BMap.Size(30, 79) }));
                            	this.icon = cam_icon;
                            	showWindow(p,'cam');
                            	this.isBig = true;
	                        });
                        	map.addOverlay(marker);
	                        
                        }
                	}else{
                		jQuery("[data-type='cam']").hide();
                	}
                }
         	});
        }
        
        //获取摄像头的视频地址
        function getVideoUrl(deviceId){
        	var accessToken = localStorage.getItem("accessToken");
			var expireTime = localStorage.getItem("expireTime");
			if(accessToken){
				//token 存储非空
				var now = new Date().getTime();
				if(now - expireTime > 0){
					getVideoToken();
				}
			}else{
				getVideoToken();
			}
			getVideoInfo(deviceId);
        }
        
        function getVideoToken(){
        	Util.ajax({
                type: 'get', 
                url: '/camera/gettoken/v1',
                success:function(res){
                	localStorage.setItem("accessToken",res.accessToken);
                	localStorage.setItem("expireTime",res.expireTime);
                },
                error:function(){
                	mui.toast('请求错误，请稍后重试');
                }
         	});
        }
        
        var liveAddress = "";
        var reviewAddress = "";
        function getVideoInfo(deviceId){
        	console.log(deviceId)
        	Util.ajax({
                type: 'get', 
                url: '/camera/getaddress/v1',
                data:{
                	deviceId:deviceId
                },
                success:function(res){
       				liveAddress = res.addressHd;
       				reviewAddress = res.ezopenHd;
   					jQuery("#myPlayer").empty().append("<source src=\""+ res.addressHd +"\">");
   					jQuery("#myPlayer")[0].play();
                },
                error:function(){
                	mui.toast('请求错误，请稍后重试');
                }
            });
        }
        
        //根据当前等级判断是否需要控制缩放
        function resizeMap(level){
        	var lon = map.getCenter().lng;
        	var lat = map.getCenter().lat;
        	if(level < 14){
        		point = new BMap.Point(lon,lat); // 创建点坐标  
            	map.centerAndZoom(point, 14);
            	mui.toast("地图缩放超出允许范围");
        	}
        }
        //根据道路等级输出当前道路的宽度
		function getRoadWidth(roadLevel,mapLevel){
		    //默认的道路宽度为10像素
		    var roadWidth = 10;
		    //一级道路的宽度是20像素
		    roadLevel == 1 ? roadWidth = 20 : roadWidth = 10   
		    //当地图等级在此范围
		    if(mapLevel > 14){// && mapLevel < 20
		        //判断需要除2的次数
		        var times = 4 - (mapLevel -15);
		        while (times > 0){
		            roadWidth = Math.ceil(roadWidth/2);
		            times--;
		        }
		        //当地图在17级以下不显示二级道路
		        if(roadLevel == 2 && mapLevel <16){
		            roadWidth = '0';
		        }
		        return roadWidth;
		    }else{
		        return '0';
		    }
		}
		
		//绘图
		function drawChart(){
			var myChart = echarts.init(mui('#chart-worker')[0]);
			var option = {
			    color:['#88d8d7','#ffa76f','#9e9e9e'],//'#feda63',
			    series: [
			        {
			            name:'人员出勤',
			            type:'pie',
			            radius: ['40%', '65%'],
			            avoidLabelOverlap: true,
			            label: {
                            normal: {
                                show: true,
                                formatter: '{x|{b}}:{y|{c} 位}',
                                rich: {
                                    x: {
                                        color: '#9e9e9e',
                                        fontSize: 14
                                    },
                                    y: {
                                        color: '#585858',
                                        fontSize: 14
                                    }
                                }
                            },
			                emphasis: {
			                    show: true
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: true
			                }
			            },
			            data:persondata
			        }
			    ]
			};
			myChart.setOption(option);
		}
	
})(mui, document);