// ==UserScript==
// @name        Steam社区自动点赞脚本[测试版]
// @namespace   com.wt629.steam.voteup.auto.batch
// @description Steam社区自动点赞脚本,在steam动态页面上添加自动点赞.
// @include     http://steamcommunity.com/id/*/home/
// @version     1.2
// ==/UserScript==
var controlPanelHtml = `
<div id='wt629_com_controlPanel' style='position:fixed; top: 10px; left: 10px; background-color: red; z-index: 450; color: white; width : 300px;'>
	<div style='float: right;'>显示/隐藏</div>
	<div>Steam自动点赞脚本控制台[开发中...]</div>
	<div style='margin-left:20px;'>
		<div>选项</div>
		<div style='margin-left:20px;'>
			<div> 
				<input type="checkbox" id="wt629_com_is_enable" class="wt629_com_cpfrom">
				<span>启用自动点赞</span>
			</div>
			<div>
				<input type="checkbox" id="wt629_com_is_timed_refresh" class="wt629_com_cpfrom">
				<span>自动刷新页面</span>
			</div>
			<div>
				<input type="number" id="wt629_com_refresh_timeout" class="wt629_com_cpfrom" min="1000" max="100000" style='width:50px;' />
				<span>自动刷新页面时间[1000ms~100000ms]</span>
			</div>
		</div>
	</div>
	<div style='margin-left:20px;'>
	<div>日志信息:</div>
	<div style='margin-left:20px;' id='wt629_com_controlPanel_msg'>显示日志内容</div>
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
	var num_noclick = 0;
	var num = 0;
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
					}
					if (isHappyButton){
						// 如果有欢乐按钮，确保欢乐按钮没有按下
						var happyHtml = thumbHappyA.html();
						if(thumbHappyA.attr('class').indexOf('active') > -1){
						}else{
							jQuery(thumbHappyA).html("["+ jQuery(thumbHappyA).html() +"]");
							jQuery(thumbHappyA).click();
						}
					}
				} else {
					// 如果没有欢乐按钮 直接点赞
					jQuery(thumbUpA).html("["+ jQuery(thumbUpA).html() +"]");
					jQuery(thumbUpA).click();
				}
			}
		}catch(e){
			wt629_com_log('操作出现异常，' + e,true);
		}
	});
	wt629_com_log('点赞操作完成，但是ajax请求并不一定全部完成，请等待一些时间 ... ',true);
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


jQuery(document).ready(function(){
	// 读取checkbox值
	var wt629_com_is_enable = wt629_com_getCookie('wt629_com_is_enable');
	var wt629_com_is_timed_refresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
	var wt629_com_refresh_timeout = wt629_com_getCookie('wt629_com_refresh_timeout');
	/*
	alert('wt629_com_is_enable:' + wt629_com_is_enable);
	alert('wt629_com_is_timed_refresh:' + wt629_com_is_timed_refresh);
	alert('wt629_com_refresh_timeout:' + wt629_com_refresh_timeout);
	*/
	if ('1' == wt629_com_is_enable){
		jQuery('#wt629_com_is_enable').attr('checked','checked');
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

	// checkbox 点击事件
	jQuery('.wt629_com_cpfrom').click(function(){
		var wt629_com_is_enable = jQuery('#wt629_com_is_enable').is(':checked');
		var wt629_com_is_timed_refresh = jQuery('#wt629_com_is_timed_refresh').is(':checked');
		var wt629_com_refresh_timeout = jQuery('#wt629_com_refresh_timeout').val();
		/*
		alert("wt629_com_is_enable :" + wt629_com_is_enable);
		alert("wt629_com_is_timed_refresh :" + wt629_com_is_timed_refresh);
		alert("wt629_com_refresh_timeout :" + wt629_com_refresh_timeout);
		*/
		if (wt629_com_is_enable){
			wt629_com_setCookie('wt629_com_is_enable','1',365);
		}else{
			wt629_com_setCookie('wt629_com_is_enable','0',365);
		}
		if (wt629_com_is_timed_refresh){
			wt629_com_setCookie('wt629_com_is_timed_refresh','1',365);
		}else{
			wt629_com_setCookie('wt629_com_is_timed_refresh','0',365);
		}
		if (wt629_com_refresh_timeout == null || wt629_com_refresh_timeout == '' || isNaN(wt629_com_refresh_timeout)){
			wt629_com_log('保存的超时时间无法解析或不是数值,修改为默认60000ms ...', true);
			wt629_com_refresh_timeout = 60000;
			wt629_com_setCookie('wt629_com_refresh_timeout',wt629_com_refresh_timeout,365);
		}
	});
	
	var isEnable = wt629_com_getCookie('wt629_com_is_enable');
	if ('1' == isEnable){
		wt629_com_log('点赞选项已启用 ...', false);
		// 批量点赞
		wt629_com_thumbUp();
		wt629_com_log('批量点赞完成 ', true);
		
		var isTimedRefresh = wt629_com_getCookie('wt629_com_is_timed_refresh');
		var refreshTimeout = wt629_com_getCookie('wt629_com_refresh_timeout');
		if (isNaN(refreshTimeout)){
			wt629_com_log('保存的超时时间无法解析或不是数值,修改为默认60000ms ...', true);
			refreshTimeout = 60000;
			wt629_com_setCookie('wt629_com_refresh_timeout','60000',365);
		}
		if ('1' == isTimedRefresh && !isNaN(refreshTimeout)){
			setTimeout("location.reload();", refreshTimeout);
		}
		
	}else{
		wt629_com_log('点赞选项未启用 ...', false);
	}
	
}); 