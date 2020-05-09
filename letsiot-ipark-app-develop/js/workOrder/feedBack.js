var vue = new Vue({
    el: '#feedback',
    data:{
       feed:[ //待反馈
		   {
			   maintActionName:"修剪",
			   startTime:"2018-7-20  07:30",
			   endTime:"2018-7-22  07:30",
			   runStatus:"FE",
			   runStatusStr:"待反馈"
		   },
		   {
		   maintActionName:"修剪",
		   startTime:"2018-7-20  07:30",
		   endTime:"2018-7-22  07:30",
		   runStatus:"FE",
		   runStatusStr:"待反馈"
		   },
		   
	   ],
	   whole:[//全部
		   {
		   maintActionName:"修剪",
		   startTime:"2018-7-20  07:30",
		   endTime:"2018-7-22  07:30",
		   runStatus:"FE",
		   runStatusStr:"待反馈"
		   },
		   {
		   maintActionName:"修剪",
		   endTime:"2018-7-22  07:30",
		   runStatus:"CA",
		   runStatusStr:"已关闭"
		   },
	   ],
	   getStatus:"FE", //头部状态
	   action:"", //搜索框中的养护动作
    },
    methods: {
		Status:function(){
		var	tht=this;
			document.getElementById('slider').addEventListener('slide', function(e) {
							//console.log(e);
							//改变 Tab 顶部字体颜色
						$("#sliderSegmentedControl").find("a").attr("class","mui-control-item");
						$("#sliderSegmentedControl").find("a").eq(e.detail.slideNumber).attr("class","mui-control-item mui-active");
						/* 	WD-待分配;FE-待反馈;BP-处理中;RE-再处理;OD-延期;TC-待确认;CO-完成;CA-
							取消, 空-全部
							*/
							 if (e.detail.slideNumber === 1) {
								tht.getStatus="";
								console.log(tht.getStatus);
								tht.ajx(tht.getStatus);
							}else{
								tht.getStatus="FE";
								console.log(tht.getStatus);
								tht.ajx(tht.getStatus);
							}
						});
		},
		  
     ajx:function(getStatus){
		 var tht=this;
		 console.log(333333333333333);
		 console.log(getStatus);
		 $.ajax({
		      url:'http://ipark.bplusiot.com/iPark/APIs/workorderManage/selectWoByStatusAction',
		      type: 'post',
		     data: {
		         status:getStatus,
				 action:"",
		     },
		      dataType: "json",  
		     success: function(data){
		 	   console.log(5555555);
		 	     console.log(JSON.stringify(data));
		 	   
		    },
		      error:function(e){  
		       console.log(JSON.stringify(e));  
		      }  
		  });
	 }
        
    },
    beforeCreate() {
        // 这是第一个生命周期函数，表示实例完全被创建出来之前，会执行它
        // 注意：在beforeCreate生命周期函数执行的时候，data和methods中的数据都还没有没初始化
    },
    created() {
		
       this.ajx(this.getStatus);
       

        // 这是第二个生命周期函数
        // 在 created 中，data 和 methods 都已经被初始化好了！
        // 如果要调用methods中的方法，或者操作 data 中的数据，最早只能在 created 中操作
    },
    beforeMount() {
        // 这是第3个生命周期函数，表示模板已经在内存中编辑完成了，但是尚未把 模板渲染到 页面中
        // 在 beforeMount 执行的时候，页面中的元素，还没有被真正替换过来，只是之前写的一些模板字符串
    },
    mounted() {
		 var that=this;
		that.Status();
		
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