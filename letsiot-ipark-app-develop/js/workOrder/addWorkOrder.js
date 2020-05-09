(function($, doc) {
				$.init();
				var projectId = localStorage.getItem("IPARK_APP_PROJECTID");
				/* var dailyBudget = 0;
                var personAveragePrice = 0; */
                var count = 0;
				var year;
				var month;
				var day;
				var dataIds = [];//存图片
				window.addEventListener('resetPage',function(event){
					plus.webview.currentWebview().reload();
				});
				//工单主题  
				
				mui("#addWorkOrder").on('tap','#work-theme',function () {
					//调接口获取
					$.ajax({
					     url:'http://ipark.bplusiot.com/iPark/APIs/monthProducePlan/addMonthWorkGuideProjectList',
					     type: 'get',
					     dataType: "json",  
					    success: function(data){
						   console.log(5555555);
						     console.log(JSON.stringify(data));
							  console.log(JSON.stringify(data.maintActionList));
							    var arr=[];
							  for(i=0;i<data.maintActionList.length;i++){
								var workid=data.maintActionList[i].id;
								var workname=data.maintActionList[i].name;
								 arr.push({userid:workid,text:workname});
							  }
							//var arr=[{id:'1',text:'董事长 叶文洁'},{id:'2',text:'总经理 艾AA'},{id:'3',text:'云天明'},{id:'4',text:'章北海'},{id:'5',text:'关一帆'}];
							var picker=new mui.PopPicker();
							picker.setData(arr);
							picker.show(function (success) {
							   var userId=success[0].userid;
							   var item=success[0].text;
							   //console.log(userId);
							    document.getElementById('theme').setAttribute('userid',userId);//指派人员添加 userid
								document.getElementById('theme').innerHTML=item;
				
							   picker.dispose();
							});
							  
					   },
					     error:function(e){  
							 mui.toast("获取指派人员列表失败:"+JSON.stringify(e));
					      console.log(JSON.stringify(e));  
					     }  
					 }); 
				
				
				  });
				/* 获取当前时间 */
				var setinter=setInterval(function(){
					var date=new Date();
					year = date.getFullYear();
					month = date.getMonth() + 1;
					day = date.getDate();
				  var hour=date.getHours();
				  var minute=date.getMinutes();
				  if(minute<10){
				    minute=0+minute;
				  }
				  document.getElementById('startTime').innerHTML=year+"-"+month+"-"+day+" "+hour+":"+minute;
				  document.getElementById('stopTme').innerHTML=year+"-"+month+"-"+day+" "+hour+":"+minute;
				},200);
				/* 开始时间 */
				mui("#addWorkOrder").on('tap','#startTime',function () {
				 window.clearInterval(setinter);
			  var picker =new mui.DtPicker({'type':'time'}); //在外面没有设置$是mui的时候直接写mui
			  picker.show(function(rs) {
			
			    document.getElementById('startTime').innerHTML=year+"-"+month+"-"+day+" "+rs.text;
			    //return false;    //这是阻止对话框关闭的
			    picker.dispose();
			  });
			
			});
				/* 结束时间 */
				mui("#addWorkOrder").on('tap','#stopTme',function () {
					 window.clearInterval(setinter);
				  var picker =new mui.DtPicker({'type':'time'}); //在外面没有设置$是mui的时候直接写mui
				  picker.show(function(rs) {
				
				    document.getElementById('stopTme').innerHTML=year+"-"+month+"-"+day+" "+rs.text;
				    //return false;    //这是阻止对话框关闭的
				    picker.dispose();
				  });
				
				});
				/* 指派人员 */
				mui("#addWorkOrder").on('tap','#appointees',function () {
					//调接口获取
					$.ajax({
					     url:'http://ipark.bplusiot.com/iPark/APIs/project/getUsersByProject',
					     type: 'get',
					    data: {
					        projectId:projectId ,
					    },
					     dataType: "json",  
					    success: function(data){
						   /* console.log(5555555);
						     console.log(JSON.stringify(data));
							  console.log(JSON.stringify(data.content)); */
							    var arr=[];
							  for(i=0;i<data.content.length;i++){
								var userid=data.content[i].userId;
								var username=data.content[i].userName;
								 arr.push({userid:userid,text:username});
							  }
							//var arr=[{id:'1',text:'董事长 叶文洁'},{id:'2',text:'总经理 艾AA'},{id:'3',text:'云天明'},{id:'4',text:'章北海'},{id:'5',text:'关一帆'}];
							var picker=new mui.PopPicker();
							picker.setData(arr);
							picker.show(function (success) {
							   var userId=success[0].userid;
							   var item=success[0].text;
							   //console.log(userId);
							    document.getElementById('appoin').setAttribute('userid',userId);//指派人员添加 userid
								document.getElementById('appoin').innerHTML=item;
				
							   picker.dispose();
							});
							  
					   },
					     error:function(e){  
							 mui.toast("获取指派人员列表失败:"+JSON.stringify(e));
					      console.log(JSON.stringify(e));  
					     }  
					 }); 
				
				
				  });
					//百度地图定位
					 mui.init();
					 document.getElementById("allmap").style.display="none";	 
					   mui.plusReady(function () {
					   		mui("#addWorkOrder").on('tap','#locat',function () {	
								document.getElementById("allmap").style.display="block";
								var longitude, latitude;
								plus.geolocation.getCurrentPosition(translatePoint, function(e) {
								  mui.toast("异常:" + e.message);
								});
					   			function translatePoint(position) {
					   			  var currentLon = position.coords.longitude;
					   			  var currentLat = position.coords.latitude;
					   			  var gpsPoint = new BMap.Point(currentLon, currentLat);
					   			  BMap.Convertor.translate(gpsPoint, 2, initMap); //坐标转换
					   			
					   			}
					   								  
					   			function initMap(point) {
					   										 /* console.log(33333333333333);
					   										  console.log(JSON.stringify(point)); */
					   			  map = new BMap.Map("allmap"); //创建地图
					   			  map.addControl(new BMap.NavigationControl());
					   			  map.addControl(new BMap.ScaleControl());
					   			  map.addControl(new BMap.OverviewMapControl());
					   			  map.centerAndZoom(point, 19);
					   			  map.addOverlay(new BMap.Marker(point));
					   										//百度地图 根据坐标转换成街道地址
					   										var geoc = new BMap.Geocoder();  
					   										geoc.getLocation(point, function(rs){
					   								  			var addComp = rs.addressComponents;
					   											//将地址填写到 作业区域的div中
					   								  			document.getElementById("locont").innerHTML=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
					   								  		});        
					   			}
							});
					 });
			//录音
			
			
			/* 以下为图片部分 */	
			$.plusReady(function(){
				mui("body").on("tap",".imageup",function(){
			           page.imgUp();  
			    });
				//提交
				mui("#addWorkOrder").on('tap','#submitBtn',function () {
					//获取工单主题
					var workthem=document.getElementById('theme').getAttribute('userid');//工单主题获取 工单 id
					var them=document.getElementById("theme").innerHTML;
					//获取工单内容
					var themeTxt=document.getElementById("themeTxt").value;
					//图片集合----dataIds
					jQuery("img.mui-img-upload","#imgList").each(function(i){
						var id = jQuery(this).attr("id");
						dataIds.push(id);
					});
					console.log(3333333);
					console.log(dataIds);
					//获取定位信息
					var locont=document.getElementById("locont").innerHTML;
					//获取开始时间
					var startTime=document.getElementById("startTime").innerHTML;
					console.log(232323);
					console.log(startTime);
					//获取结束时间
					var stopTme=document.getElementById("stopTme").innerHTML;
					//获取指派人
					var assignor=document.getElementById('appoin').getAttribute('userid');//指派人员获取 userid
					var  zpr=document.getElementById('appoin').innerHTML;
					console.log("222222222");
					console.log(them);
					console.log(themeTxt);
					 if(them == ""){
						  mui.toast('请输入工单主题');
						  return;
					  }
					   if(themeTxt == ""){
						  mui.toast('请输入工单内容');
						  return;
					  }
					   if(locont == ""){ //定位
						  mui.toast('请选择作业区域');
						  return;
					  }
					   if(zpr == ""){
						  mui.toast('请选择指派人');
						  return;
					  }
					$.ajax({
					  		 url:'http://ipark.bplusiot.com/iPark/APIs/workorderManage/createTaskWO',
					  		 type: 'post',
					  		data: {
									maintAction:workthem,
									remark: themeTxt,
									operatingArea: locont,
									voice:"", //音频文件
									startTime: startTime,
									endTime: stopTme,
									imageList: dataIds,
									assignor: assignor
									},
								dataType: "json",  
								headers: {'Content-Type':'application/json'},
					  		success: function(data){
							   mui.toast("提交成功");	
					  		   //console.log("******************提交工单***********************");
					  		   //console.log(JSON.stringify(data));
					  		},
					  		 error:function(e){  
							 mui.toast("提交失败");	
					  		  console.log(JSON.stringify(e));  
					  		 }  
					});
				});
				
			});
				var page=null;  
		        page={
		            imgUp:function(){  
		                var m=this;  
		                plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
		                    {title:"拍照"},  
		                    {title:"从相册中选择"}  
		                ]}, function(e){//1 是拍照  2 从相册中选择  
		                    switch(e.index){  
		                        case 1:appendByCamera();break;  
		                        case 2:appendByGallery();break;  
		                    }
		                });
		            }
		        }  
		          
		        // 拍照添加文件
		        function appendByCamera(){
		            plus.camera.getCamera().captureImage(function(e){
		                console.log(e);
		                plus.io.resolveLocalFileSystemURL(e, function(entry) { 
		                	var path = entry.toLocalURL();
		                	baiduPosition(path);
		                }, function(e) { 
		                    mui.toast("读取拍照文件错误：" + e.message); 
		                }); 
		
		            });    
		        }
		        // 从相册添加文件
		        function appendByGallery(){
		            plus.gallery.pick(function(path){
		                //okdocument.getElementById("headimg").src = path;
		                baiduPosition(path);
		            });
		        }
				var lng = 0;
				var lat = 0;
		        // 上传文件
		        function upload(url){
		        	console.log(lng+","+lat);
		        	var server =  app.configures.URL + "/iPark/APIs/resources/uploadimage?type=WC&longitude="+lng+"&latitude="+lat;
		            var wt=plus.nativeUI.showWaiting();
		            var task=plus.uploader.createUpload(server,
		                {method:"POST"},
		                function(t,status){ //上传完成
						/* console.log(55555555555);
						console.log(JSON.stringify(t));
						console.log(status); */
		                    if(status==200){
		                    	var response = JSON.parse(t.responseText);
		                    	console.log(JSON.stringify(response));
		                    	var imgId = response.id;
		                    	var imgurl = app.configures.URL + "/iPark/APIs/maintGuide/getImageByPath?imagePath=" + response.resourceMinimal;
		                    	var mediumImgUrl = app.configures.URL + "/iPark/APIs/maintGuide/getImageByPath?imagePath=" + response.resourceMedium;
		                    	html = "<a class='imgItem' href='javascript:void(0);'><img class='mui-img-uni' src='../images/close.png'/><img class='mui-img-upload' id='"+imgId+"' data-src='"+mediumImgUrl+"' src='"+imgurl+"'/></a>";
		                        jQuery("#imgList").append(html);
		                        check();//检查上传图片的个数
		                        wt.close(); //关闭等待提示按钮
		                        jQuery(".mui-img-upload").off();
		                        jQuery(".mui-img-upload").on("click",function(){
									var src = jQuery(this).data('src');
									var result = "<img src='"+src+"'/>";
									jQuery("#backdrop").attr('class','mui-backdrop').html(result).show();
								});
								jQuery("#backdrop").off();
								jQuery("#backdrop").on("click",function(){
									jQuery("#backdrop").attr('class','').html('').hide();	
								});
		                    }else{
		                        alert("上传失败："+status);
		                        wt.close();//关闭等待提示按钮
		                    }
		                }
		            );
		            //添加其他参数
		            task.addData("name","file");
		            task.addFile(url,{key:"file"});
		            task.start();
		        }
		        function check(){
		        	var length = jQuery('#imgList').children('.imgItem').length;
	                if(length >= 5){
	                	jQuery('#imgList .imageup').hide();
	                }else{
	                	jQuery('#imgList .imageup').show();
	                }
		        }
		        
		        //获取经纬度
				function baiduPosition(path){
					plus.geolocation.getCurrentPosition(function(e){
		        		lng = e.coords.longitude;
					    lat = e.coords.latitude;
					    upload(path);
		        	}, function(e){
				 		var geolocation = new BMap.Geolocation();
					    geolocation.getCurrentPosition(function(r){
					        if(this.getStatus() == BMAP_STATUS_SUCCESS){
					        	lng = r.point.lng;
					        	lat = r.point.lat;
					        	upload(path);
					        }else {
					            mui.alert('获取位置失败,请确定您已开启定位服务');
					        }
					    },{enableHighAccuracy: true});
			        },{enableHighAccuracy:true,coordsType:'bd09ll',timeout:6000,maximumAge:5000,provider:'baidu'});
				    
				}
		        
		        jQuery('body').on('tap','.mui-img-uni',function(){
		        	jQuery(this).parent('.imgItem').remove();
		        	check();//检查上传图片的个数
		        });
				
				
			})(mui, document);