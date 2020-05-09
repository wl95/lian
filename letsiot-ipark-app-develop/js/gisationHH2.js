(function($, doc) {
	$.init();
	
	window.addEventListener('resetPage',function(event){
		plus.webview.currentWebview().reload();
	});
	
	
	
		//地图初始化
		function initMap(){
			var map = new BMap.Map("map");
			  var point = new BMap.Point(118.688165,32.070343); //114.00100,22.550000
			  map.centerAndZoom(point,18);
			  map.enableScrollWheelZoom(true);//  启用滚轮放大缩小，默认禁用。
			  map.enableDoubleClickZoom();//启用双击放大，默认启用。   
			  var points=[];
			    //批量打点
			    var data_info = [
			      {longitude:118.688165,latitude:32.070343,title:"A",con:"我是A"},
			      {longitude:114.00130,latitude:22.550000,title:"B",con:"我是B"},
			      {longitude:114.00160,latitude:22.550000,title:"C",con:"我是C"},
			      {longitude:114.00200,latitude:22.550000,title:"D",con:"我是D"},
			  
			    ];
			  
			    var opts = {
			      width : 250,     // 信息窗口宽度
			      height: 50,     // 信息窗口高度
			      offset:{width:0,height:-13} , //窗口的偏移量
			      title : "信息窗口" , // 信息窗口标题
			      //enableMessage:true//设置允许信息窗发送短息
			    };
			  
			    for(var i=0;i<data_info.length;i++){
			      //console.log(data_info[i].title);
			  
			      var img="";
			      if(data_info[i].title==="C"){
			        img="didian.png";
			      }else if(data_info[i].title==="A"){
			        img="jtsj2.png";
			      }else{
			        img="jtsj.png";
			      }
			  
			      var myIcon = new BMap.Icon(img, new BMap.Size(30,30),{
			        anchor:new BMap.Size(13,15),
			        imageOffset:new BMap.Size(0,0),
			      });
			  
			      let marker = new BMap.Marker(new BMap.Point(data_info[i].longitude,data_info[i].latitude),{icon:myIcon});
			      map.addOverlay(marker);// 将标注添加到地图中
			  
			  
			      var content = '<div class="mapCont"><div class="map-cont">'+data_info[i].title+'</div></div>';  
			      console.log(document.getElementsByClassName(".mapCont"));
			      addClickHandler(content,marker);
			      points.push(new BMap.Point(data_info[i].longitude,data_info[i].latitude));
			    }
			  
			    
			    function addClickHandler(content,marker){
			      marker.addEventListener("click",function(e){
			          openInfo(content,e);
			        }
			  
			      );
			    }
			    function openInfo(content,e){
			      var p = e.target;
			      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
			      var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
			      map.openInfoWindow(infoWindow,point); //开启信息窗口
			    }
		}
		
	
	
})(mui, document);