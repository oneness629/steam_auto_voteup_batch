# -*- coding: utf-8 -*-
import sys
import logging
import os

logging.basicConfig(level=logging.DEBUG)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 获取steamID64
def get_steamid64(driver):
    steamid64 = driver.execute_script('return g_rgProfileData["steamid"]')
    if steamid64 == None:
        logging.warn(u'无法获取到steamID64')
    else:
        logging.info('steamID64 : ' + str(steamid64) )
    return steamid64

# 获取在线状态
def get_online_state(driver):
    online_state_string = None
    if driver is not None:
        # 获取在线状态 .profile_in_game persona online .profile_in_game_header 字符串
        profile_in_game_div = driver.find_element_by_class_name('profile_in_game')
        if profile_in_game_div is not None:
            profile_in_game_header_div = profile_in_game_div.find_element_by_class_name('profile_in_game_header')
            if profile_in_game_header_div is not None:
                online_state_string = profile_in_game_header_div.text
        if online_state_string is None:
            logging.warn(u'无法获取到在线状态')
        else:
            logging.info('在线状态 : ' + str(online_state_string) )
    return online_state_string

# 获取背景图片URL
def get_background_image_url(driver):
    img = None
    if driver is not None:
        # 背景图
        # .responsive_page_template_content 
        # .no_header profile_page has_profile_background 
        # style="background-image: url( 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/370280/f76c6fe1e14cb55de947629fb516be7f379922e9.jpg' );"
        responsive_page_template_content = driver.find_element_by_class_name('responsive_page_template_content')
        if responsive_page_template_content is not None:
            profile_page = responsive_page_template_content.find_element_by_class_name('profile_page')
            if profile_page is not None:
                img = profile_page.get_attribute('style')
                img = img.replace('background-image: url("','')
                img = img.replace('");','')
    return img

# 右侧顶层DIV XPath语句
top_xpath_content = "//div[@class='profile_rightcol']/div[@class='responsive_count_link_area']"
# 通用 右侧DIV XPath语句
common_right_count_xpath_content = top_xpath_content + "/div[@class='profile_item_links']"
common_right_count_xpath_content += "/div[contains(@class,'profile_count_link')][#index#]/a/span[@class='profile_count_link_total']"

# 获取徽章数量
def get_badges_count(driver):
    xpath = top_xpath_content
    xpath += "/div[@class='profile_badges']/div[@class='profile_count_link_preview_ctn']"
    xpath += "/div[contains(@class,'profile_count_link')]/a/span[@class='profile_count_link_total']"
    return get_xpath_content(driver, xpath)
    
# 获取游戏数
def get_games_count(driver):
    return  get_xpath_content(driver, common_right_count_xpath_content.replace('#index#', '1'))

# 获取截图数
def get_screenshots_count(driver):
    return  get_xpath_content(driver, common_right_count_xpath_content.replace('#index#', '3'))

# 获取视频数
def get_videos_count(driver):
    return  get_xpath_content(driver, common_right_count_xpath_content.replace('#index#', '4'))

# 获取创意工坊数
def get_myworkshopfiles_count(driver):
    return  get_xpath_content(driver, common_right_count_xpath_content.replace('#index#', '5'))

# 获取评测数
def get_recommended_count(driver):
    return  get_xpath_content(driver, common_right_count_xpath_content.replace('#index#', '6'))

# 获取组数
def get_groups_count(driver):
    xpath = "//div[@class='profile_rightcol']/div[3]"
    xpath += "/div[contains(@class,'profile_count_link_preview_ctn')]"
    xpath += "/div[contains(@class,'profile_count_link')]/a/span[@class='profile_count_link_total']"
    return  get_xpath_content(driver, xpath)

# 获取好友数
def get_friends_count(driver):
    xpath = "//div[@class='profile_rightcol']/div[4]"
    xpath += "/div[contains(@class,'profile_count_link_preview_ctn')]"
    xpath += "/div[contains(@class,'profile_count_link')]/a/span[@class='profile_count_link_total']"
    return  get_xpath_content(driver, xpath)

    
# 获取XPath命令执行的内容
def get_xpath_content(driver, xpath):
    content = None
    if driver is not None:
        element = driver.find_element_by_xpath(xpath)
        content = element.text
    return content
    

