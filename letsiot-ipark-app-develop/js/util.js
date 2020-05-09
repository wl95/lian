(function($, util) {
	//var API_HOST = 'http://192.168.1.134:8080/',
	//var API_HOST = 'http://192.168.1.125:8080/',
	//var API_HOST = 'http://192.168.1.245:8001/',
	//var API_HOST = 'http://101.132.42.153:18081/',
	//http://139.196.72.73:18081/
	var API_HOST = 'http://ipark.bplusiot.com/',
		API_PREFIX = 'iPark/APIs/',
		defaultOpt = {
			dataType: 'json',//服务器返回json格式数据
			type: 'get',//HTTP请求类型
			timeout: 10000,//超时时间设置为10秒；
			headers: {'Content-Type':'application/json'}
		};
	var alertShow = false;
	var serializeParam = util.serializeParam =function(params){
		var str = '?';
		for (var key in params) {
			//去除无效值的影响
			if(params[key] != ''){
				//判断参数是否为数组
				if(params[key] instanceof Array){
					for(var i=0; i<params[key].length ; i++){
						str += key+"[]="+params[key][i]+"&";
					}
				}else{
					str += key+"="+params[key]+"&";
				}
			}
		}
		return str.length>1 ? str.substr(0, str.length-1):str;
	}
	
	util.ajax = function(setting){
		var url = API_HOST + API_PREFIX + setting.url,
			type = (setting.type || 'get').toLocaleLowerCase(),
            param = setting.data;
			//console.log(JSON.stringify(param));
        var async = true;
        if (setting.async === false) {
            async = false;
        }
		if('get'== type){
            url += serializeParam(param);
            param = null;
			}

		var opt = $.extend({}, defaultOpt, {
            type: type,
            async: async,
			success:function(data){
				//console.log(JSON.stringify(data));
				setting.success && setting.success(data);
			},
			error:function(xhr,type,errorThrown){
				//console.log(JSON.stringify(xhr.response));
				if(type=='abort'){
					if(!alertShow){
						alertShow = true;
						$.alert('网络异常，请检查网络后重试！', '错误', function() {
							alertShow = false;
							localStorage.removeItem("APP_USER"); 
					        localStorage.removeItem("APP_PASSWORD"); 
							var all = plus.webview.all();
					        var launch = plus.webview.getLaunchWebview() //基座，不可以关掉
					        for(var i = 0; i < all.length; i++) {
					            if(all[i] === launch)
					                continue;
					            all[i].close();
					            all[i].clear();
					        }
					        launch.show();
						});
					}
				}else{
					//console.log(JSON.parse(xhr.response).code);
					if(JSON.parse(xhr.response).code == "2001"){
					    localStorage.removeItem("APP_USER"); 
				        localStorage.removeItem("APP_PASSWORD"); 
						var all = plus.webview.all();
				        var launch = plus.webview.getLaunchWebview() //基座，不可以关掉
				        for(var i = 0; i < all.length; i++) {
				            if(all[i] === launch)
				                continue;
				            all[i].close();
				            all[i].clear();
				        }
				        launch.show();
					}else{
						var message = JSON.parse(xhr.response).message || '系统错误，请联系管理员！';
						$.alert(message, '错误', function() {
							setting.error && setting.error(xhr);
						});
					}
				}
			}
		});
		if(param){
			opt.data = param;
		}
		// console.log(JSON.stringify(opt));
		// console.log(url);
		$.ajax(url,opt);
	};
	
	/*页面顶部进度条*/
	var progressTimeout = null;
    function simulateLoading(progress) {
        var container = 'body';
        clearTimeout(progressTimeout);
        progressTimeout = setTimeout(function() {
            progress += Math.random() * 20;
            $(container).progressbar().setProgress(progress);
            if (progress < 75) {
                simulateLoading(progress);
            }
        }, Math.random() * 200 + 200);
    }
    
	util.showProgressBar = function(){
		$('body').progressbar({
            progress: 0
        }).show();
        simulateLoading(0);
	};
    
	util.hideProgressBar = function(){
		clearTimeout(progressTimeout);
        $('body').progressbar().setProgress(100);
        setTimeout(function() {$('body').progressbar().hide();}, 300);
	};

	Util.formatWindDir = function(dir){
		var result = "";
		switch(dir){
			case 'N':
				result = "北风";
				break;
			case 'NNE':
			case 'NE':
			case 'ENE':
				result = "东北风";
				break;
			case 'E':
				result = "东风";
				break;
			case 'ESE':
			case 'SE':
			case 'SSE':
				result = "东南风";
				break;
			case 'S':
				result = "南风";
				break;
			case 'SSW':
			case 'SW':
			case 'WSW':
				result = "西南风";
				break;
			case 'W':
				result = "西风";
				break;
			case 'WNW':
			case 'NW':
			case 'NNW':
				result = "西北风";
				break;
			case 'Calm':
				result = "微风";
				break;
			case 'Whirlwind':
				result = "旋转风";
				break;
		}
		return result;
	};
	
	util.formatWind = function(level){
		var result = "";
		switch(level){
			case '0':
				result = "无风";
				break;
			case '1':
				result = "软风";
				break;
			case '2':
				result = "轻风";
				break;
			case '3':
				result = "微风";
				break;
			case '4':
				result = "和风";
				break;
			case '5':
				result = "轻劲风";
				break;
			case '6':
				result = "强风";
				break;
			case '7':
				result = "疾风";
				break;
			case '8':
				result = "大风";
				break;
			case '9':
				result = "烈风";
				break;
			case '10':
				result = "狂风";
				break;
			case '11':
				result = "暴风";
				break;
			default:
				result = "台风";
				break;
		}
		return result;
	};
}(mui, window.Util = {}));