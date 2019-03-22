// ==UserScript==
// @name        Steam社区自动点赞脚本[测试版]
// @namespace   com.wt629.steam.voteup.auto.batch
// @description Steam社区自动点赞脚本,在steam动态页面上添加自动点赞.
// @include     http*://steamcommunity.com/id/*/home/ 
// @include     http*://steamcommunity.com/profiles/*/home/
// @version     2.1
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==
(function() {
	'use strict';

	var wt629_com_js = {
		config: {
			isEnable: true,
			isShow: true,
			isTimedRefresh: false,
			refreshTimeout : 60,

			// 用户状态
			thumbUpUserStatus: true,
			// 收藏和发布艺术作品
			thumbUpWorkshopItemPublished: true,
			// 购买游戏
			thumbUpGamePurchase: true,
			// 截图
			thumbUpScreenshot  : true,
			// 评测
			thumbUpRecommendation: true,
			// 评测为不推荐的点欢乐
			thumbHappyByRecommendation: true,
		},

		// 添加到页面的HTML
		controlPanelHtml: "",

		log: function(content,isAppend){
			if (isAppend){
				$('#wt629_com_controlPanel_msg').html($('#wt629_com_controlPanel_msg').html() + '<br/>' + content);
			}else{
				$('#wt629_com_controlPanel_msg').html(content);
			}
		},

		setDefaultConfigData: function(){
			var config = {
				isEnable: true,
				isShow: true,
				isTimedRefresh: false,
				refreshTimeout : 60,
			};
			localStorage.setItem('wt629_com_auto_voteup_config',JSON.stringify(config));
		},

		saveConfig: function(){
			localStorage.setItem('wt629_com_auto_voteup_config',JSON.stringify(wt629_com_js.config));
		},

		//检查配置数据是否存在，或是否配置。如果没有配置，设置缺省数据
		checkIsConfig: function(){
			if (null == wt629_com_js.config || undefined == wt629_com_js.config ){
				wt629_com_js.log('初始化配置信息 ... ', false);
				wt629_com_js.setDefaultConfigData();
				wt629_com_js.log('初始化配置信息 完成 ', true);
			}
		},


		// 读取配置数据
		readConfigData: function(){
			var config = localStorage.getItem('wt629_com_auto_voteup_config');
			try{
				wt629_com_js.config = JSON.parse(config);
			}catch (e) {
				wt629_com_js.log('读取配置出错' + e, true);
				wt629_com_js.log('使用默认配置重置' , true);
				wt629_com_js.config = null;
				wt629_com_js.checkIsConfig();
			}
		},


		// 将配置数据显示到表单
		showConfigData: function(){
			wt629_com_js.log('显示配置表单信息 ... ', true);
			if (wt629_com_js.config.isEnable){
				$('#wt629_com_is_enable').attr('checked','checked');
			}
			if (wt629_com_js.config.isShow){
				$('#wt629_com_is_show').attr('checked','checked');
			}
			if (wt629_com_js.config.isTimedRefresh){
				$('#wt629_com_is_timed_refresh').attr('checked','checked');
			}
			if (wt629_com_js.config.refreshTimeout == null || wt629_com_js.config.refreshTimeout == '' || isNaN(wt629_com_js.config.refreshTimeout)){
				wt629_com_js.log('保存的超时时间无法解析或不是数值,修改为默认60s ...', true);
				wt629_com_js.config.refreshTimeout = 60;
				// 保存设置
				wt629_com_js.saveConfig();
			}
			$('#wt629_com_refresh_timeout').val(wt629_com_js.config.refreshTimeout);
			wt629_com_js.log('显示配置表单信息 完成 ', true);
		},


		// 显示控制面板
		showControlPanel: function(){
			$('#wt629_com_controlPanel').css('width','300px');
			$('.wt629_com_controlPanel_main').show();
		},

		// 隐藏控制面板
		hideControlPanel: function(){
			$('#wt629_com_controlPanel').css('width','100px');
			$('.wt629_com_controlPanel_main').hide();
		},

		// 检查面板是否显示
		checkIsShow: function(){
			if (wt629_com_js.config.isShow){
				wt629_com_js.showControlPanel();
			}else{
				wt629_com_js.hideControlPanel();
			}
		},

		//设置默认超时时间
		setDefaultTimeOut: function(){
			wt629_com_js.log('保存的超时时间无法解析或不是数值,修改为默认60秒 ...', true);
			wt629_com_js.config.refreshTimeout = 60;
			// 保存
			wt629_com_js.saveConfig();
		},


		// 设置事件
		setEvent: function(){
			// 显示隐藏事件
			$('#wt629_com_controlPanel_show_or_hide').click(function(){
				if ($('.wt629_com_controlPanel_main').is(':hidden')){
					$('#wt629_com_controlPanel').css('width','300px');
					$('.wt629_com_controlPanel_main').show();
				}else{
					$('#wt629_com_controlPanel').css('width','100px');
					$('.wt629_com_controlPanel_main').hide();
				}
			});


			// 表单 点击事件
			$('.wt629_com_cpfrom').click(function(){
				wt629_com_js.config.isEnable= $('#wt629_com_is_enable').is(':checked');
				wt629_com_js.config.isShow = $('#wt629_com_is_show').is(':checked');
				wt629_com_js.config.isTimedRefresh = $('#wt629_com_is_timed_refresh').is(':checked');
				wt629_com_js.config.refreshTimeout = $('#wt629_com_refresh_timeout').val();

				wt629_com_js.log('保存配置 ... ', true);
				// 保存
				wt629_com_js.saveConfig();
				wt629_com_js.log('保存配置 完成 请手动刷新页面加载新配置 ..  ', true);
			});
		},



		// 页面超时剩余时间
		pageTimeOut : -99,
		// 超时计时器
		interval: null,

		// 页面刷新超时
		pageReloadTimeOut: function(){
			var isTimedRefresh = wt629_com_js.config.isTimedRefresh;
			var refreshTimeout = wt629_com_js.config.refreshTimeout;
			if (isNaN(refreshTimeout)){
				wt629_com_js.setDefaultTimeOut();
			}
			if (wt629_com_js.pageTimeOut == -99){
				wt629_com_js.pageTimeOut = refreshTimeout;
			}
			if(!isTimedRefresh){
				$('#wt629_com_controlPanel_page_reload_tip').html('');
			}
			if (wt629_com_js.pageTimeOut <= 0){
				clearInterval(wt629_com_js.interval);
				$('#wt629_com_controlPanel_page_reload_tip').html('刷新中...');
				location.reload(true);
			}else{
				$('#wt629_com_controlPanel_page_reload_tip').html(wt629_com_js.pageTimeOut + '秒后刷新');
				wt629_com_js.pageTimeOut --;
			}
		},


		// 点赞事件
		thumbUpEvnet: function(){
			if (wt629_com_js.config.isEnable){
				wt629_com_js.log('点赞选项已启用 ...', false);
				// 批量点赞
				// wt629_com_js.thumbUp();
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_userstatus', false);
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_workshopitempublished', false);
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_gamepurchase', false);
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_screenshot', false);
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', true);
				wt629_com_js.log('批量点赞完成 ', true);

				var isTimedRefresh = wt629_com_js.config.isTimedRefresh;
				var refreshTimeout = wt629_com_js.config.refreshTimeout;
				if (isNaN(refreshTimeout)){
					wt629_com_js.setDefaultTimeOut();
				}
				if (wt629_com_js.config.isTimedRefresh){
					wt629_com_js.interval = setInterval(wt629_com_js.pageReloadTimeOut, 1000);
				}

			}else{
				wt629_com_js.log('点赞选项未启用 ...', false);
			}
		},

		thumbUpByClass: function(className, isThumbHappyByRecommendation) {
			// 所有点赞按钮
			// className = '.blotter_block  .blotter_workshopitempublished';
			var thumbUpObject = $(className);
			var thumbUpNum = thumbUpObject.length;
			var thumbUpActiveNum = 0;
			var thumbUpNotActiveNum = 0;
			thumbUpObject.each(function(){
				var activeObject = $(this).find('.active');
				if (activeObject == null || activeObject.length == 0){
					thumbUpNotActiveNum ++;
					var isThumbsUp = false;
					var isFunny = false;
					if (isThumbHappyByRecommendation){
						var thumb = $(this).find('.thumb');
						if (thumb != null && $(thumb).html() != null){
							var html = $(thumb).html();
							if (html.indexOf('thumbsUp.png') > -1){
								isThumbsUp = true;
							}else if (html.indexOf('thumbsDown.png') > -1){
								isFunny = true;
							}
						}
					}else{
						isThumbsUp = true;
					}
					if (isThumbsUp){
						var thumbUp = $(this).find('.thumb_up');
						if (thumbUp != null){
							$(thumbUp).css('border-bottom','1px solid #F00');
							$(thumbUp).parent().parent().click();
						}
					}
					if (isFunny){
						var funny = $(this).find('.funny');
						if (funny != null){
							$(funny).css('border-bottom','1px solid #F00');
							$(funny).parent().parent().click();
						}
					}
				}else{
					thumbUpActiveNum ++;
				}
			});
			console.log(thumbUpNum);
			console.log(thumbUpActiveNum);
			console.log(thumbUpNotActiveNum);
		},


		thumbUp: function() {
			wt629_com_js.log('开始点赞 ...',true);
			// 所有点赞按钮
			var thumb_up = $('.thumb_up');
			var num = thumb_up.size();
			var num_upClick = 0;
			var num_happyClick = 0;
			thumb_up.each(function(){

				try{
					var classStr = $(this).parent().parent().attr('class');
					// 遍历没有点击的点赞按钮[包含未点击和点击欢乐的]
					if (!(classStr != null && classStr.indexOf('active') > -1)){
						// 点赞按钮
						var thumbUpA = $(this).parent().parent();
						var thumbDownA = $(thumbUpA).next('a');
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
							thumbHappyA = $(thumbDownA).next('a');
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
							var statusHtml = $(thumbUpA).parent().parent().parent().prev().find('.thumb').html();
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
								// $(thumbUpA).html("["+ $(thumbUpA).html() +"]");
								$(thumbUpA).css('border-bottom','1px solid #F00');
								$(thumbUpA).click();
								num_upClick ++;
							}
							if (isHappyButton){
								// 如果有欢乐按钮，确保欢乐按钮没有按下
								var happyHtml = thumbHappyA.html();
								if(thumbHappyA.attr('class').indexOf('active') > -1){
								}else{
									// $(thumbHappyA).html("["+ $(thumbHappyA).html() +"]");
									$(thumbHappyA).css('border-bottom','1px solid #F00');
									$(thumbHappyA).click();
									num_happyClick ++;
								}
							}
						} else {
							// 如果没有欢乐按钮 直接点赞
							// $(thumbUpA).html("["+ $(thumbUpA).html() +"]");
							$(thumbUpA).css('border-bottom','1px solid #F00');
							$(thumbUpA).click();
							num_upClick ++;
						}
					}
				}catch(e){
					wt629_com_js.log('操作出现异常，' + e,true);
				}
			});
			wt629_com_js.log('一共' + num + '条动态，点赞' + num_upClick + '次，点欢乐'+ num_happyClick + '次。' ,true);
			wt629_com_js.log('点赞完成，但ajax并非全部完成，请等待一些时间 ... ',true);
		},


	};

	wt629_com_js.controlPanelHtml += "<div id='wt629_com_controlPanel' style='font-size: 10px; position:fixed; top: 10px; left: 10px; background-color: red; z-index: 450; color: white; width : 300px;'>";
	wt629_com_js.controlPanelHtml += "\t<div style='float: right;'>";
	wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_page_reload_tip' ></span>";
	wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_show_or_hide' >显示/隐藏</span>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main'>Steam社区自动点赞脚本控制台<br/>[缓慢开发中...]</div>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t<div>URL</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:20px;' id='wt629_com_controlPanel_url'>";
	wt629_com_js.controlPanelHtml += "\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div>选项</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div> ";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_enable\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<span>启用自动点赞</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div> ";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_show\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<span>默认显示控制界面</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_timed_refresh\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<span>自动刷新页面</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"number\" id=\"wt629_com_refresh_timeout\" class=\"wt629_com_cpfrom\" min=\"10\" max=\"3600\" style='width:50px;' />";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<span>自动刷新页面时间[10~3600秒]</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "\t<hr/>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:0px;'>";
	wt629_com_js.controlPanelHtml += "\t\t<div>日志信息:</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:0px;' id='wt629_com_controlPanel_msg'>显示日志内容</div>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "</div>";
	wt629_com_js.controlPanelHtml += "";



	$(document).ready(function() {
		$('body').append(wt629_com_js.controlPanelHtml);

		// 读取配置数据
		wt629_com_js.readConfigData();

		// 检查配置是否存在，不存在使用缺省
		wt629_com_js.checkIsConfig();

		// 检查是否可视
		wt629_com_js.checkIsShow();

		// 显示配置到表单
		wt629_com_js.showConfigData();

		// 设置事件
		wt629_com_js.setEvent();

		// 点赞事件
		wt629_com_js.thumbUpEvnet();

		var url = window.location.href;
		$('wt629_com_controlPanel_url').innerHTML = url;

	});


})();