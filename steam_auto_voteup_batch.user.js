// ==UserScript==
// @name        Steam社区自动点赞脚本[测试版]
// @namespace   com.wt629.steam.voteup.auto.batch
// @description Steam社区自动点赞脚本,在steam动态页面上添加自动点赞.
// @include     http*://steamcommunity.com/id/*/home/ 
// @include     http*://steamcommunity.com/profiles/*/home/
// @version     1.9
// ==/UserScript==
var controlPanelHtml = `
<div id='wt629_com_controlPanel' style='font-size: 10px; position:fixed; top: 10px; left: 10px; background-color: red; z-index: 450; color: white; width : 300px;'>
	<div style='float: right;'>
		<span id='wt629_com_controlPanel_page_reload_tip' ></span>
		<span id='wt629_com_controlPanel_show_or_hide' >显示/隐藏</span>
	</div>
	<div class='wt629_com_controlPanel_main'>Steam社区自动点赞脚本控制台<br/>[缓慢开发中...]</div>
	<div class='wt629_com_controlPanel_main' style='margin-left:20px;'>
		<div>URL</div>
		<div style='margin-left:20px;' id='wt629_com_controlPanel_url'>
			
		</div>
		<div>选项</div>
		<div style='margin-left:20px;'>
			<div> 
				<input type="checkbox" id="wt629_com_is_enable" class="wt629_com_cpfrom">
				<span>启用自动点赞</span>
			</div>
			<div> 
				<input type="checkbox" id="wt629_com_is_show" class="wt629_com_cpfrom">
				<span>默认显示控制界面</span>
			</div>
			<div>
				<input type="checkbox" id="wt629_com_is_timed_refresh" class="wt629_com_cpfrom">
				<span>自动刷新页面</span>
			</div>
			<div>
				<input type="number" id="wt629_com_refresh_timeout" class="wt629_com_cpfrom" min="10" max="3600" style='width:50px;' />
				<span>自动刷新页面时间[10~3600秒]</span>
			</div>
		</div>
	</div>
	<hr/>
	<div class='wt629_com_controlPanel_main' style='margin-left:0px;'>
		<div>日志信息:</div>
		<div style='margin-left:0px;' id='wt629_com_controlPanel_msg'>显示日志内容</div>
	</div>
</div>
`;
jQuery('body').append(controlPanelHtml);

var cookieControlJsCode = `
;var wt629_com_setCookie = function(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
};
var wt629_com_getCookie = function(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1) {
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) {
				c_end=document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
};
`;

jQuery('body').append('<script type="text/javascript">' +cookieControlJsCode+ '</script>');

var thumbUpJsCode = `
var wt629_com_thumbUp = function() {
	wt629_com_log('开始点赞 ...',true);
	// 所有点赞按钮
	var thumb_up = jQuery('.thumb_up');
	var num = thumb_up.size();;
	var num_upClick = 0;
	var num_happyClick = 0;
	thumb_up.each(function(){
		try{
			var classStr = jQuery(this).parent().parent().attr('class');
			// 遍历没有点击的点赞按钮[包含未点击和点击欢乐的]
			if (!(classStr != null && classStr.indexOf('active') > -1)){
				// 点赞按钮
				var thumbUpA = jQuery(this).parent().parent();
				var thumbDownA = jQuery(thumbUpA).next('a');
				// 欢乐按钮html <i class="ico16 funny"></i>欢乐</span>
				// 分享按钮html <span>分享</span>
				var thumbHappyA = null;
				
				var isUp = true;
				var isDown = false;
				var isHappy = false;
				
				var isUpButton = false;
				var isHappyButton = false;
				
				// 是否有不支持按钮
				if(thumbDownA != null ){
					thumbHappyA = jQuery(thumbDownA).next('a');
					// 是否有不支持和欢乐按钮
					if (thumbDownA != null && thumbHappyA != null){
					
						// 确认不支持和欢乐按钮是否正确 thumb_down funny
						var downHtml = thumbDownA.html();
						var happyHtml = thumbHappyA.html();
						
						if (downHtml != null && downHtml.indexOf('thumb_down') > -1){
							// 不支持按钮正常
							isDown = true;
						}
						if (happyHtml != null && happyHtml.indexOf('funny') > -1){
							// 欢乐按钮正常
							isHappy = true;
						}
					}
				}
				if(isHappy){
					// 有欢乐按钮，说明是评测，检查评测状态
					var statusHtml = jQuery(thumbUpA).parent().parent().parent().prev().find('.thumb').html();
					// 如果存在thumbsUp.png，说明是支持，否则thumbsDown.png，不支持
					if (statusHtml.indexOf('thumbsUp.png') > -1){
						isUpButton = true;
						isHappyButton = false;
					}else if (statusHtml.indexOf('thumbsDown.png') > -1){
						isUpButton = false;
						isHappyButton = true;
					}else{
						// 没有找到是否支持，直接点赞
						isUpButton = true;
						isHappyButton = false;
					}
					
					if (isUpButton){
						jQuery(thumbUpA).html("["+ jQuery(thumbUpA).html() +"]");
						jQuery(thumbUpA).click();
						num_upClick ++;
					}
					if (isHappyButton){
						// 如果有欢乐按钮，确保欢乐按钮没有按下
						var happyHtml = thumbHappyA.html();
						if(thumbHappyA.attr('class').indexOf('active') > -1){
						}else{
							jQuery(thumbHappyA).html("["+ jQuery(thumbHappyA).html() +"]");
							jQuery(thumbHappyA).click();
							num_happyClick ++;
						}
					}
				} else {
					// 如果没有欢乐按钮 直接点赞
					jQuery(thumbUpA).html("["+ jQuery(thumbUpA).html() +"]");
					jQuery(thumbUpA).click();
					num_upClick ++;
				}
			}
		}catch(e){
			wt629_com_log('操作出现异常，' + e,true);
		}
	});
	wt629_com_log('一共' + num + '条动态，点赞' + num_upClick + '次，点欢乐'+ num_happyClick + '次。' ,true);
	wt629_com_log('点赞完成，但ajax并非全部完成，请等待一些时间 ... ',true);
};
`;
jQuery('body').append('<script type="text/javascript">' +thumbUpJsCode+ '</script>');

var logControlJsCode = `
;var wt629_com_log = function(content,isAppend){
	if (isAppend){
		jQuery('#wt629_com_controlPanel_msg').html(jQuery('#wt629_com_controlPanel_msg').html() + '<br/>' + content);
	}else{
		jQuery('#wt629_com_controlPanel_msg').html(content);
	}
};
`;
jQuery('body').append('<script type="text/javascript">' +logControlJsCode+ '</script>');

// 读取保存的配置数据
var wt629_com_is_enable = wt629_com_getCookie('wt629_com_is_enable');
var wt629_com_is_show = wt629_com_getCookie('wt629_com_is_show');
var wt629_com_is_timed_refresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
var wt629_com_refresh_timeout = wt629_com_getCookie('wt629_com_refresh_timeout');


// 设置默认配置数据
var setDefaultConfigData = function(){
	wt629_com_setCookie('wt629_com_is_enable','0',365);
	wt629_com_setCookie('wt629_com_is_show','1',365);
	wt629_com_setCookie('wt629_com_is_timed_refresh','0',365);
	wt629_com_setCookie('wt629_com_refresh_timeout',60000,365);
};

//检查配置数据是否存在，或是否配置。如果没有配置，设置缺省数据
var checkIsConfig = function(){
	if (null == wt629_com_is_enable || undefined == wt629_com_is_enable || '' == wt629_com_is_enable){
		wt629_com_log('初始化配置信息 ... ', false);
		setDefaultConfigData();
		wt629_com_log('初始化配置信息 完成 ', true);
	}
};

// 读取配置数据
var readConfigData = function(){
	wt629_com_is_enable = wt629_com_getCookie('wt629_com_is_enable');
	wt629_com_is_show = wt629_com_getCookie('wt629_com_is_show');
	wt629_com_is_timed_refresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
	wt629_com_refresh_timeout = wt629_com_getCookie('wt629_com_refresh_timeout');
	/*
	alert('wt629_com_is_enable:' + wt629_com_is_enable);
	alert('wt629_com_is_show:' + wt629_com_is_show);
	alert('wt629_com_is_timed_refresh:' + wt629_com_is_timed_refresh);
	alert('wt629_com_refresh_timeout:' + wt629_com_refresh_timeout);
	*/
};



// 将配置数据显示到表单
var showConfigData = function(){
	wt629_com_log('显示配置表单信息 ... ', true);
	if ('1' == wt629_com_is_enable){
		jQuery('#wt629_com_is_enable').attr('checked','checked');
	}
	if ('1' == wt629_com_is_show){
		jQuery('#wt629_com_is_show').attr('checked','checked');
	}
	if ('1' == wt629_com_is_timed_refresh){
		jQuery('#wt629_com_is_timed_refresh').attr('checked','checked');
	}
	if (wt629_com_refresh_timeout == null || wt629_com_refresh_timeout == '' || isNaN(wt629_com_refresh_timeout)){
		wt629_com_log('保存的超时时间无法解析或不是数值,修改为默认60000ms ...', true);
		wt629_com_refresh_timeout = 60000;
		wt629_com_setCookie('wt629_com_refresh_timeout',wt629_com_refresh_timeout,365);
	}
	jQuery('#wt629_com_refresh_timeout').val(wt629_com_refresh_timeout);
	wt629_com_log('显示配置表单信息 完成 ', true);
};

// 显示控制面板
var showControlPanel = function(){
	jQuery('#wt629_com_controlPanel').css('width','300px');
	jQuery('.wt629_com_controlPanel_main').show();
};

// 隐藏控制面板
var hideControlPanel = function(){
	jQuery('#wt629_com_controlPanel').css('width','100px');
	jQuery('.wt629_com_controlPanel_main').hide();
};

// 检查面板是否显示
var checkIsShow = function(){
	if ('1' == wt629_com_is_show){
		showControlPanel();
	}else{
		hideControlPanel();
	}
};

//设置默认超时时间
var setDefaultTimeOut = function(){
	wt629_com_log('保存的超时时间无法解析或不是数值,修改为默认60秒 ...', true);
	refreshTimeout = 60;
	wt629_com_setCookie('wt629_com_refresh_timeout','60',365);
};


// 设置事件
var setEvent = function(){
	// 显示隐藏事件
	jQuery('#wt629_com_controlPanel_show_or_hide').click(function(){
		if (jQuery('.wt629_com_controlPanel_main').is(':hidden')){
			jQuery('#wt629_com_controlPanel').css('width','300px');
			jQuery('.wt629_com_controlPanel_main').show();
		}else{
			jQuery('#wt629_com_controlPanel').css('width','100px');
			jQuery('.wt629_com_controlPanel_main').hide();
		}
	});
	
	
	// 表单 点击事件
	jQuery('.wt629_com_cpfrom').click(function(){
		var wt629_com_is_enable = jQuery('#wt629_com_is_enable').is(':checked');
		var wt629_com_is_show = jQuery('#wt629_com_is_show').is(':checked');
		var wt629_com_is_timed_refresh = jQuery('#wt629_com_is_timed_refresh').is(':checked');
		var wt629_com_refresh_timeout = jQuery('#wt629_com_refresh_timeout').val();
		/*
		alert("wt629_com_is_enable :" + wt629_com_is_enable);
		alert("wt629_com_is_timed_refresh :" + wt629_com_is_timed_refresh);
		alert("wt629_com_refresh_timeout :" + wt629_com_refresh_timeout);
		*/
		wt629_com_log('保存配置 ... ', true);
		if (wt629_com_is_enable){
			wt629_com_setCookie('wt629_com_is_enable','1',365);
		}else{
			wt629_com_setCookie('wt629_com_is_enable','0',365);
		}
		if (wt629_com_is_show){
			wt629_com_setCookie('wt629_com_is_show','1',365);
		}else{
			wt629_com_setCookie('wt629_com_is_show','0',365);
		}
		if (wt629_com_is_timed_refresh){
			wt629_com_setCookie('wt629_com_is_timed_refresh','1',365);
		}else{
			wt629_com_setCookie('wt629_com_is_timed_refresh','0',365);
		}
		if (wt629_com_refresh_timeout == null || wt629_com_refresh_timeout == '' || isNaN(wt629_com_refresh_timeout)){
			setDefaultTimeOut();
		}else{
			wt629_com_setCookie('wt629_com_refresh_timeout',wt629_com_refresh_timeout,365);
		}
		wt629_com_log('保存配置 完成 请手动刷新页面加载新配置 ..  ', true);
	});
};



// 页面超时剩余时间
var pageTimeOut = -99;
// 超时计时器
var interval;
// 页面刷新超时
var pageReloadTimeOut = function(){
	var isTimedRefresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
	var refreshTimeout = wt629_com_getCookie('wt629_com_refresh_timeout');
	if (isNaN(refreshTimeout)){
		setDefaultTimeOut();
	}
	if (pageTimeOut == -99){
		pageTimeOut = refreshTimeout;
	}
	if(!isTimedRefresh){
		jQuery('#wt629_com_controlPanel_page_reload_tip').html('');
	}
	if (pageTimeOut <= 0){
		clearInterval(interval);
		jQuery('#wt629_com_controlPanel_page_reload_tip').html('刷新中...');
		location.reload(true);
	}else{
		jQuery('#wt629_com_controlPanel_page_reload_tip').html(pageTimeOut + '秒后刷新');
		pageTimeOut --;
	}
};

// 点赞事件
var thumbUpEvnet = function(){
	var isEnable = wt629_com_getCookie('wt629_com_is_enable');
	if ('1' == isEnable){
		wt629_com_log('点赞选项已启用 ...', false);
		// 批量点赞
		wt629_com_thumbUp();
		wt629_com_log('批量点赞完成 ', true);
		
		var isTimedRefresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
		var refreshTimeout = wt629_com_getCookie('wt629_com_refresh_timeout');
		if (isNaN(refreshTimeout)){
			setDefaultTimeOut();
		}
		if ('1' == isTimedRefresh && !isNaN(refreshTimeout)){
			interval = setInterval(pageReloadTimeOut, 1000);
			// setTimeout("location.reload(true);", refreshTimeout);
		}
		
	}else{
		wt629_com_log('点赞选项未启用 ...', false);
	}
};


jQuery(document).ready(function(){
	// 读取配置数据
	readConfigData();
	
	// 检查配置是否存在，不存在使用缺省
	checkIsConfig();
	
	// 检查是否可视
	checkIsShow();
	
	// 显示配置到表单
	showConfigData();
	
	// 设置事件
	setEvent();
	
	// 点赞事件
	thumbUpEvnet();

	var url = window.location.href;
	$('wt629_com_controlPanel_url').innerHTML = url;
	var his = wt629_com_getCookie('wt629_com_his');
	if (his != null && his.length > 0 ){
		if (his.indexOf(url) == -1){
			wt629_com_setCookie('wt629_com_his',his + url + '\n\r',365);
		}
	}
}); 
