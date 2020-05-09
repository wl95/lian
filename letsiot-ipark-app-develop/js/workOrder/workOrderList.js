var status="";
var action="";
var size=10;
var page=0;
var vue = new Vue({
	el: '#cont',
	data: {
		whole:[
			/* {
				statusStr:"已关闭",
				maintActionName:"1213",
				backTime:"sds"
			} */
		]
	}, 
	methods: {
		/* "woStatus" : WD-待分配;FE-待反馈;BP-处理中;RE-再处理;OD-延期;TC-待确认;CO-完成;CA-取消, 空 全部
			"woAction" : 养护动作,
			"projectId" : 项目编号
			*/
		   //跳转详情
		   poin:function (index,id,stat){
						if(stat=="待分配"){
							mui.openWindow({
							    url: './orderList.html', //跳转至待分配页
							    id: 'orderList',
							    extras: {  
							        workid: id
							    } 
							});
						}else if(stat=="待确认"){
							mui.openWindow({
							    url: './confirmOrder.html', //跳转至待确定页
							    id: 'confirmOrder',
							    extras: {  
							        workid: id
							    } 
							});
						}else if(stat=="已关闭"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至已关闭页
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}else if(stat=="待反馈"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至待反馈页
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}else if(stat=="延期"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至详情页 
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}else if(stat=="处理中"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至详情页
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}else if(stat=="再处理"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至详情页
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}else if(stat=="取消"){
							mui.openWindow({
							    url: './haveBeenThrough.html', //跳转至详情页
							    id: 'haveBeenThrough',
							    extras: {  
							        workid: id,
									stat:stat
							    } 
							});
						}
		           },
	
	},
	beforeCreate() {
		// 这是第一个生命周期函数，表示实例完全被创建出来之前，会执行它
		// 注意：在beforeCreate生命周期函数执行的时候，data和methods中的数据都还没有没初始化
	},
	created() {
		// 这是第二个生命周期函数
		// 在 created 中，data 和 methods 都已经被初始化好了！
		// 如果要调用methods中的方法，或者操作 data 中的数据，最早只能在 created 中操作
	},
	beforeMount() {
		// 这是第3个生命周期函数，表示模板已经在内存中编辑完成了，但是尚未把 模板渲染到 页面中
		// 在 beforeMount 执行的时候，页面中的元素，还没有被真正替换过来，只是之前写的一些模板字符串
	},
	mounted() {
		// 这是遇到的第4个生命周期函数，表示，内存中的模板，已经真实的挂载到了页面中，用户已经可以看到渲染好的页面了
		// 注意：mounted是实例创建期间的最后一个生命周期函数，当执行完mounted就表示，实例已经被完全创建好了

	},

	// 接下来的是运行中的两个事件
	beforeUpdate() {
		// 这时候，表示 我们的界面还没有被更新【数据被更新了吗？  数据肯定被更新了】
		// 得出结论： 当执行beforeUpdate的时候，页面中的显示的数据，还是旧的，此时data数据是最新的，页面尚未和最新的数据保持同步
	},
	updated() {
		//当页面中的元素发生变化的时候进行监听
		// updated 事件执行的时候，页面和 data 数据已经保持同步了，都是最新的
	},
	beforeDestroy() {

	},
	destroyed() {

	}
});
//刷新加载
	mui('#scroll1').pullRefresh({
			down: {
				contentdown: "加载中", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "加载中", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "Loading...",
				callback: function() {
					alert("刷新");
					status = "WD";//待分配
					action = "";
					size=10;
					page=0;
					ajx(status,action,size,page);
					mui("#scroll1").pullRefresh().endPullupToRefresh(true);
				}
			},
			up: {
				contentrefresh: "加载中...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: "没有更多数据", //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: function() {
					alert("加载");
					status = "WD";//待分配
					action = "";
					size=10;
					page=page+1;
					ajx(status,action,size,page);
					mui("#scroll1").pullRefresh().endPullupToRefresh(true);
				}
			}
		});
	mui('#scroll2').pullRefresh({
			down: {
				contentdown: "加载中", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "加载中", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "Loading...",
				callback: function() {
					alert("刷新");
					status = "TC";  //待确认
					action = "";
					size=10;
					page=0;
					vue.whole=[
						{ 
							maintActionName:"123",
							startTime:"12312"
						},
					]
					ajx(status,action,size,page);
					mui("#scroll2").pullRefresh().endPullupToRefresh(true);

				}
			},
			up: {
				contentrefresh: "加载中...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: "没有更多数据", //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: function() {
					alert("加载");
					size=10;
					page=page+1;
					ajx(status,action,size,page);
					mui("#scroll2").pullRefresh().endPullupToRefresh(true);
				}
			}
		});	
	mui('#scroll3').pullRefresh({
		down: {
			contentdown: "加载中", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "加载中", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "Loading...",
			callback: function() {
				alert("刷新");
				status = "";  //全部
				action = "";
				size=10;
				page=0;
					mui("#scroll3").pullRefresh().endPulldownToRefresh(true);
				ajx(status,action,size,page);
	
			}
		},
		up: {
			contentrefresh: "加载中...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: "没有更多数据", //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: function() {
				status = "TC";  //待确认
				action = "";
				size=10;
				page=page+1;
				 mui("#scroll3").pullRefresh().endPullupToRefresh(true);
				ajx(status,action,size,page);
			}
		}
	});

//获取搜索框中的数据
	mui("body").on('tap','#butt',function () {
		action=$("#item1-input").val();
		status = "WD";//待分配
		size=10;
		page=0;
		ajx(status,action,size,page);
		//清空搜索框并且失去焦点
		$("#item1-input").val("");
		$("#item1-input").blur();
	});
	mui("body").on('tap','#butt2',function () {
		action=$("#item2-input").val();
		status = "TC";//待确认
		size=10;
		page=0;
		ajx(status,action,size,page);
		$("#item2-input").val("");
		$("#item2-input").blur();
	});
	mui("body").on('tap','#butt3',function () {
		action=$("#item3-input").val();
		status = "";//全部
		size=10;
		page=0;
		ajx(status,action,size,page);
		$("#item3-input").val("");
		$("#item3-input").blur();
	});


stat();
ajx(status,action,size,page);
function ajx(getStatus,action,size,page) {
	//alert(action);
			var projectId = localStorage.getItem("IPARK_APP_PROJECTID");
			var tht = this;
			//console.log(projectId);
			console.log(33333333333);
		    console.log(action);
			$.ajax({
				url: 'http://ipark.bplusiot.com/iPark/APIs/workorderManage/selectWoByStatusAction',
				type: 'post',
				data: {
					woStatus: getStatus, 
					woAction: action,
					projectId: projectId,
					size:size,
					page:page
				},
				dataType: "json",
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					console.log("列表数据加载了");
					console.log(JSON.stringify(data.content));
					if(page!=0){
						vue.whole = vue.whole.concat(data.content);
					}else{
						vue.whole = data.content;
					}
					
				},
				error: function(e) {
					console.log(JSON.stringify(e));
				}
			});
		}
//滑动状态 切换
/* document.getElementById('slider').addEventListener('slide', function(e) {
		//console.log(e);
		//改变 Tab 顶部字体颜色
		$("#sliderSegmentedControl").find("a").attr("class", "mui-control-item");
		$("#sliderSegmentedControl").find("a").eq(e.detail.slideNumber).attr("class","mui-control-item mui-active");
		if (e.detail.slideNumber === 1) {
			status = "TC";
			action = "";
			size=10;
			page=0;
			ajx(status,action,size,page);

			console.log(status);
			
		} else if (e.detail.slideNumber === 2) {
			status = "";
			action = "";
			size=10;
			page=0;
			ajx(status,action,size,page);

			console.log(status);
		} else {
			status = "WD";
			action = "";
			size=10;
			page=0;
			ajx(status,action,size,page);

			console.log(status);
		}
	});

 */
//判断进入页面的入口及Tab状态
function stat(){
			var stat = window.localStorage.getItem("stat");// 0 待分配 1 待确认  2 全部
			console.log(33333333333333);
			console.log(stat);
			if (stat == "0") {
				mui.trigger(document.getElementById("dfp"),'touchstart');
				mui.trigger(document.getElementById("dfp"),'tap');
				$("#sliderSegmentedControl").find(".item1mobile").attr("class", "mui-control-item");
				$("#sliderSegmentedControl").find(".item1mobile").attr("class", "mui-control-item mui-active");
				status = "WD";
				action = "";
				size=10;
				page=0;
				ajx(status,action,size,page);


			} else if (stat == "1") {
				mui.trigger(document.getElementById("confirm"),'touchstart');
				mui.trigger(document.getElementById("confirm"),'tap');
				$("#sliderSegmentedControl").find(".item2mobile").attr("class", "mui-control-item");
				$("#sliderSegmentedControl").find(".item2mobile").attr("class", "mui-control-item mui-active");
				status = "TC";
				action = "";
				size=10;
				page=0;
				ajx(status,action,size,page);


			} else if (stat == "2") {
				mui.trigger(document.getElementById("dhttest"),'touchstart');
				mui.trigger(document.getElementById("dhttest"),'tap');
				$("#sliderSegmentedControl").find(".item3mobile").attr("class", "mui-control-item");
				$("#sliderSegmentedControl").find(".item3mobile").attr("class", "mui-control-item mui-active");
				status = "";
				action = "";
				size=10;
				page=0;
				ajx(status,action,size,page);

			}
	window.localStorage.removeItem("stat");
		}


