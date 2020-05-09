
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.configures = {
		/* URL : 'http://101.132.42.153:18081',
		API_URL : 'http://101.132.42.153:18081/iPark/APIs' */   //进入   login.html
		URL : 'http://ipark.bplusiot.com',
		API_URL : 'http://ipark.bplusiot.com/iPark/APIs'
	}
	owner.login = function(loginInfo, callback) {
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var url = owner.configures.URL+'/iPark/login';
		/*jQuery.ajax({
			type: "post",
			url: url,
			data:{
				loginName: loginInfo.account,
				password: loginInfo.password,
				verifycode: loginInfo.identifyCode
			},
			dataType: "json",
			headers: {"X-Requested-With":"XMLHttpRequest"},
		    success: function (data) {
				if(data.code=="200"){
					var state = owner.getState();
					state.account = name;
					owner.setState(state);
					return callback();
				}else{
					return callback(data.message);
				}
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown){
		    	alert(2);
		    	return callback('登录异常，请联系管理员！');
		    }
		});*/
		mui.ajax(url, {
			data: {
				loginName: loginInfo.account,
				password: loginInfo.password,
				verifycode: loginInfo.identifyCode
				//verifycode: "code"
			},
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,
			type: 'post', //HTTP请求类型
			headers: {"X-Requested-With":"XMLHttpRequest"},
			success: function(data) {
				/*console.log(JSON.stringify(data));
				if(data.code=="200"){
					var state = owner.getState();
					state.account = name;
					owner.setState(state);
					return callback();
				}else{
					return callback(data.message);
				}*/
				return owner.getUserInfo(callback);
			},
			error: function(xhr, type, errorThrown) {
				//alert(type);
				console.log(type);
				if(type =="timeout"){
					callback("网络连接超时，请检查网络后重试");
				}else if(type=='abort'){
					callback("登录异常，请联系管理员！");
				}else{
					var message = JSON.parse(xhr.response).message || '登录异常，请联系管理员！';
					console.log(message);
					callback(message);
					/*$.alert(message, '错误', function() {
						callback(message);
					});*/
				}
			}
		});
	};
	owner.pageToLogin = function(str,callback){
		var url = owner.configures.URL+'/backend/unsafe/isLogined'
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,
			type: 'get', //HTTP请求类型
			success: function(data) {
				if(data.code == '0') {
					return callback(str);
				} else {
					var curr = plus.webview.currentWebview();
					var relationWv = [curr];
					var currParent = plus.webview.currentWebview().parent();
					if(currParent != null){
						relationWv.push(currParent);
						var parents = currParent.parent();
						if(parents != null){
							relationWv.push(parents);
						}
					}
					var wvs = plus.webview.all();
					for (var i = 0, len = wvs.length; i < len; i++) {
						//关闭除当前页面外的其他页面
						var isClose = false;
						for (var j = 0;j<relationWv.length;j++) {
							if(wvs[i].getURL() == relationWv[j].getURL()){
								isClose = true;
							}
						}
						if(isClose)
						continue;
						plus.webview.close(wvs[i]);
					}
					plus.webview.open('../login.html');
					for (var i = 0;i<relationWv.length;i++) {
						relationWv[(relationWv.length-1)-i].close();
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.alert('网络异常');
			}
		});
		
	};
	owner.createState = function(name, callback) {
		var url = owner.configures.URL+'/backend/uc/memberManage/self?_='+new Date().getTime();
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,
			type: 'get', //HTTP请求类型
			success: function(data) {
				if(data.code=="0"){
					var state = owner.getState();
					state.account = name;
					state.companyId = data.item.companyId;
					owner.setState(state);
					return callback();
				}else{
					return callback(data.message);
				}
			},
			error: function(xhr, type, errorThrown) {
				return callback("获取角色失败");
			}
		});
	};
	
	/**
	 * 获取用户信息
	 **/
	owner.getUserInfo = function(callback){
		var url = owner.configures.API_URL+'/user/CheckInfo';
		mui.ajax(url, {
			dataType: 'json', 
			timeout: 10000,
			type: 'get', 
			success: function(data) {
				var role = data.role,userId = data.userId;
				if(data.role){
					if(role == "1" || role == "2" || role == "3" || role == "4" || role == "5" || role == "6" || role == "7"){
						var state = owner.getState();
						state.role = role;
						state.userId = userId;
						owner.setState(state);
						return callback();
					}else{
						var message = "智慧园林移动端暂不支持该角色登陆！";
						return callback(message);
					}
				}else{
					var message = "登录异常，请联系管理员！";
					return callback(message);
				}
				
			},
			error: function(xhr, type, errorThrown) {
				var message = JSON.parse(xhr.response).message || '登录异常，请联系管理员！';
				$.alert(message, '错误', function() {
					callback(message);
				});
			}
		});
	}

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));