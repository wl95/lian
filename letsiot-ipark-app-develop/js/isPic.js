(function ($) {
	 $.fn.addList = function(data){
	 	var _this=$(this);
	 	var m_box='';
		if(data=='防寒、防冻'){
			m_box='<img src="../images/common/fanghanfangdong.png" />'
			_this.append(m_box)
		};
		if(data=='其他'){
			m_box='<img src="../images/common/qita.png" />'
			_this.append(m_box)
		};
		if(data=='保洁'){
			m_box='<img src="../images/common/baojie.png" />'
			_this.append(m_box)
		};
		if(data=='病虫害防治'){
			m_box='<img src="../images/common/bingchong.png" />'
			_this.append(m_box)
		};
		if(data=='补栽'){
			m_box='<img src="../images/common/buzai.png" />'
			_this.append(m_box)
		};
		if(data=='除草'){
			m_box='<img src="../images/common/chucao.png" />'
			_this.append(m_box)
		};
		if(data=='浇水'){
			m_box='<img src="../images/common/jiaoshui.png" />'
			_this.append(m_box)
		};
		if(data=='排水'){
			m_box='<img src="../images/common/paishui.png" />'
			_this.append(m_box)
		};
		if(data=='切边'){
			m_box='<img src="../images/common/qiebian.png" />'
			_this.append(m_box)
		};
		if(data=='施肥'){
			m_box='<img src="../images/common/shifei.png" />'
			_this.append(m_box)
		};
		if(data=='松土'){
			m_box='<img src="../images/common/songtu.png" />'
			_this.append(m_box)
		};
		if(data=='涂白'){
			m_box='<img src="../images/common/tubai.png" />'
			_this.append(m_box)
		};
		if(data=='修剪'){
			m_box='<img src="../images/common/xiujian.png" />'
			_this.append(m_box)
		};
		if(data=='支撑、扶正'){
			m_box='<img src="../images/common/zhicheng.png" />'
			_this.append(m_box)
		};
	 }
})(jQuery)




