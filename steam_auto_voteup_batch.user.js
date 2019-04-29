// ==UserScript==
// @name        Steam社区自动点赞脚本[测试版]
// @namespace   com.wt629.steam.voteup.auto.batch
// @description Steam社区自动点赞脚本,在steam动态页面上添加自动点赞.
// @include     http*://steamcommunity.com/id/*/home/ 
// @include     http*://steamcommunity.com/profiles/*/home/
// @version     2.7
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
				isEnable: false,
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
			};
			localStorage.setItem('wt629_com_auto_voteup_config',JSON.stringify(config));
			wt629_com_js.log('使用默认配置重置脚本设置完成' , true);
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
				wt629_com_js.readConfigData();
			}
		},


		// 读取配置数据
		readConfigData: function(){
			var config = localStorage.getItem('wt629_com_auto_voteup_config');
			try{
				wt629_com_js.config = JSON.parse(config);
				wt629_com_js.checkIsConfig();
			}catch (e) {
				wt629_com_js.log('读取配置出错' + e, true);
				wt629_com_js.log('使用默认配置重置' , true);
				wt629_com_js.config = null;
				wt629_com_js.checkIsConfig();
			}
		},


		// 同步设置到表单
		syncConfigDataToForm: function(){
			wt629_com_js.log('同步设置到表单 ... ', true);
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

			// 空值检查
			if (wt629_com_js.config.thumbHappyByRecommendation == null || wt629_com_js.config.thumbHappyByRecommendation == undefined) {
				wt629_com_js.config.thumbHappyByRecommendation = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpGamePurchase == null || wt629_com_js.config.thumbUpGamePurchase == undefined) {
				wt629_com_js.config.thumbUpGamePurchase = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpRecommendation == null || wt629_com_js.config.thumbUpRecommendation == undefined) {
				wt629_com_js.config.thumbUpRecommendation = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpScreenshot == null || wt629_com_js.config.thumbUpScreenshot == undefined) {
				wt629_com_js.config.thumbUpScreenshot = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpUserStatus == null || wt629_com_js.config.thumbUpUserStatus == undefined) {
				wt629_com_js.config.thumbUpUserStatus = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpWorkshopItemPublished == null || wt629_com_js.config.thumbUpWorkshopItemPublished == undefined) {
				wt629_com_js.config.thumbUpWorkshopItemPublished = true;
				wt629_com_js.saveConfig();
			}

			if (wt629_com_js.config.thumbHappyByRecommendation){
				$('#wt629_com_config_thumb_happy_by_recommendation').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpGamePurchase){
				$('#wt629_com_config_thumb_up_game_purchase').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpRecommendation){
				$('#wt629_com_config_thumb_up_recommendation').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpScreenshot){
				$('#wt629_com_config_thumb_up_screenshot').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpUserStatus){
				$('#wt629_com_config_thumb_up_user_status').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpWorkshopItemPublished){
				$('#wt629_com_config_thumb_up_workshop_item_published').attr('checked','checked');
			}

			wt629_com_js.log('同步设置到表单 完成 ', true);
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

				wt629_com_js.config.thumbHappyByRecommendation = $('#wt629_com_config_thumb_happy_by_recommendation').is(':checked');
				wt629_com_js.config.thumbUpGamePurchase = $('#wt629_com_config_thumb_up_game_purchase').is(':checked');
				wt629_com_js.config.thumbUpRecommendation = $('#wt629_com_config_thumb_up_recommendation').is(':checked');
				wt629_com_js.config.thumbUpScreenshot = $('#wt629_com_config_thumb_up_screenshot').is(':checked');
				wt629_com_js.config.thumbUpUserStatus = $('#wt629_com_config_thumb_up_user_status').is(':checked');
				wt629_com_js.config.thumbUpWorkshopItemPublished = $('#wt629_com_config_thumb_up_workshop_item_published').is(':checked');

				wt629_com_js.log('保存配置 ... ', true);
				// 保存
				wt629_com_js.saveConfig();
				wt629_com_js.log('保存配置 完成 请手动刷新页面加载新配置 ..  ', true);
			});

			// 手动点赞事件
			$('#wt629_com_config_thumb_happy_by_recommendation_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', true, '用户评测点赞（不推荐欢乐）');
			});
			$('#wt629_com_config_thumb_up_game_purchase_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_gamepurchase', false, '用户购买游戏');
			});
			$('#wt629_com_config_thumb_up_recommendation_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', false, '用户评测全点赞');
			});
			$('#wt629_com_config_thumb_up_screenshot_a').click(function() {
				// wt629_com_js.thumbUpByClass('.blotter_block  .blotter_screenshot', false, '用户截图');
                wt629_com_js.thumbUpByScreenshot('用户截图');
			});
			$('#wt629_com_config_thumb_up_user_status_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_userstatus', false, '用户发布的状态');
			});
			$('#wt629_com_config_thumb_up_workshop_item_published_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_workshopitempublished', false, '用户收藏和发布的艺术作品');
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
				wt629_com_js.log('点赞选项已启用 ...', true);
				// 批量点赞

				if (wt629_com_js.config.thumbUpGamePurchase){
					wt629_com_js.thumbUpByClass('.blotter_block  .blotter_gamepurchase', false, '用户购买游戏');
				}
				if (wt629_com_js.config.thumbUpRecommendation){
					if (wt629_com_js.config.thumbHappyByRecommendation){
						wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', true, '用户评测点赞（不推荐欢乐）');
					}else{
						wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', false, '用户评测全点赞');
					}
				}
				if (wt629_com_js.config.thumbUpScreenshot){
					wt629_com_js.thumbUpByScreenshot('用户截图');
				}
				if (wt629_com_js.config.thumbUpUserStatus){
					wt629_com_js.thumbUpByClass('.blotter_block .blotter_userstatus', false, '用户发布的状态');
				}
				if (wt629_com_js.config.thumbUpWorkshopItemPublished){
					wt629_com_js.thumbUpByClass('.blotter_block  .blotter_workshopitempublished', false, '用户收藏和发布的艺术作品');
				}

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
				wt629_com_js.log('点赞选项未启用 ...', true);
			}
		},


		thumbUpByClass: function(className, isThumbHappyByRecommendation, logType) {

            // 所有点赞按钮
            var thumbUpObject = $(className);
            // 所有可以点赞的数量
            var thumbUpNum = thumbUpObject.length;
            // 点赞的数量
            var thumbUpActiveNum = 0;
            // 点赞欢乐的数量
            var thumbUpHappyNum = 0;
            // 未点赞的数量
            var thumbUpNotActiveNum = 0;
            // 已经点赞的数量
            var thumbUpAlreadyActiveNum = 0;
            thumbUpObject.each(function(){
                var activeObject = $(this).find('.active');
                var activeBtnObject = $(this).find('.btn_active');
                /*console.log('activeObject');
                console.log(activeObject);
                console.log(activeBtnObject);*/
                if ((activeObject == null || activeObject.length == 0)&&(activeBtnObject == null || activeBtnObject.length == 0)){
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
                        thumbUpActiveNum ++;
                        var thumbUp = $(this).find('.thumb_up');
                        if (thumbUp != null){
                            $(thumbUp).css('border-bottom','1px solid #F00');
                            $(thumbUp).parent().parent().click();
                        }
                    }
                    if (isFunny){
                        thumbUpHappyNum ++;
                        var funny = $(this).find('.funny');
                        if (funny != null){
                            $(funny).css('border-bottom','1px solid #F00');
                            $(funny).parent().parent().click();
                        }
                    }
                }else{
                    thumbUpAlreadyActiveNum ++;
                }
            });
            wt629_com_js.log(logType + '点赞完成', true);
            wt629_com_js.log('共' + thumbUpNum + '次->已点赞' + thumbUpAlreadyActiveNum + '次，本次(点赞' + thumbUpActiveNum + '次，欢乐' + thumbUpHappyNum + '次)', true);
		},

        thumbUpByScreenshot: function(logType) {
            // 所有点赞按钮
            var thumbUpObject = $('.blotter_block  .blotter_screenshot .thumb_up');
            // 所有可以点赞的数量
            var thumbUpNum = thumbUpObject.length;
            // 点赞的数量
            var thumbUpActiveNum = 0;
            // 未点赞的数量
            var thumbUpNotActiveNum = 0;
            // 已经点赞的数量
            var thumbUpAlreadyActiveNum = 0;
            thumbUpObject.each(function(){
                var activeObject = $(this).parent().parent().parent().find('.active');
                var activeBtnObject = $(this).parent().parent().parent().find('.btn_active');
                /*console.log('activeObject');
                console.log(activeObject);
                console.log(activeBtnObject);*/
                if ((activeObject == null || activeObject.length == 0)&&(activeBtnObject == null || activeBtnObject.length == 0)){
                    thumbUpNotActiveNum ++;
                    thumbUpActiveNum ++;
                    var thumbUp = $(this).parent().parent().parent().find('.thumb_up');
                    if (thumbUp != null){
                        $(thumbUp).css('border-bottom','1px solid #F00');
                        $(thumbUp).parent().parent().click();
                    }
                }else{
                    thumbUpAlreadyActiveNum ++;
                }
            });
            wt629_com_js.log(logType + '点赞完成', true);
            wt629_com_js.log('共' + thumbUpNum + '次->已点赞' + thumbUpAlreadyActiveNum + '次，本次(点赞' + thumbUpActiveNum + '次)', true);
        },

	};

	wt629_com_js.controlPanelHtml += "<div id='wt629_com_controlPanel' style='font-size: 10px; position:fixed; top: 10px; left: 10px; background-color: rgb(66, 56, 56); z-index: 450; color: white; width : 300px; opacity: 0.9;'>";
	wt629_com_js.controlPanelHtml += "\t<div style='float: right;'>";
	wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_page_reload_tip' ></span>";
	wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_show_or_hide' ><a href='javascript:void(0);' style='color: red;'>显示/隐藏</a></span>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main'>Steam社区自动点赞脚本控制台<br/>[v2.7版->极度缓慢开发中...]-><a href='https://steamcommunity.com/sharedfiles/filedetails/?id=1690131781'>使用详细说明（Steam指南）</a></div>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t<div>选项</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div> ";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_enable\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<span>启用自动点赞</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t<div style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div> ";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_show\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>默认显示控制界面</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_timed_refresh\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>自动刷新页面</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"number\" id=\"wt629_com_refresh_timeout\" class=\"wt629_com_cpfrom\" min=\"10\" max=\"3600\" style='width:50px;' />";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>自动刷新页面时间[10~3600秒]</span>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div><br/>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_user_status\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>内容->用户发布的状态-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_user_status_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_workshop_item_published\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>内容->用户收藏和发布的艺术作品-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_workshop_item_published_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_game_purchase\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>内容->用户购买游戏-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_game_purchase_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_screenshot\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>内容->用户截图-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_screenshot_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_recommendation\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>内容->用户评测-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_recommendation_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t<div style='margin-left:20px;'>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t<div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_happy_by_recommendation\" class=\"wt629_com_cpfrom\">";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t\t<span>评测结果为不推荐的点欢乐-></span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_happy_by_recommendation_a\" style='color: red;'>手动点赞</a>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t\t</div>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:0px; border-top: 1px solid white;'>";
	wt629_com_js.controlPanelHtml += "\t\t<div>日志信息:</div>";
	wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:10px;' id='wt629_com_controlPanel_msg'></div>";
	wt629_com_js.controlPanelHtml += "\t</div>";
	wt629_com_js.controlPanelHtml += "</div>";
	wt629_com_js.controlPanelHtml += "";


	$(document).ready(function() {
		try{
			$('body').append(wt629_com_js.controlPanelHtml);

			// 读取配置数据
			wt629_com_js.readConfigData();

			// 检查是否可视
			wt629_com_js.checkIsShow();

			// 显示配置到表单
			wt629_com_js.syncConfigDataToForm();

			// 设置事件
			wt629_com_js.setEvent();

			// 点赞事件
			wt629_com_js.thumbUpEvnet();
		}catch (e) {
			wt629_com_js.log("脚本出现异常，请与制作人联系！", e);
		}

	});

})();