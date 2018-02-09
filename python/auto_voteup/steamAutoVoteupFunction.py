# -*- coding: utf-8 -*-
import logging
import sys

import time

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

from python.auto_voteup.steamAutoVoteupConfig import load_user_login_config, get_cookie_content, set_cookie_content, \
    get_check_is_login_url

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 写入登录cookie内容
def write_login_cookie_to_browser_content(driver):
    cookie_content = get_cookie_content()
    if cookie_content is not None :
        logging.info('读取到的cookie内容为 ->' + cookie_content)
        cookies_dict = eval(cookie_content)
        for cookie in cookies_dict:
            logging.info('添加cookie ->' + str({'name' : cookie['name'], 'value' : cookie['value']}))
            driver.add_cookie({'name' : cookie['name'], 'value' : cookie['value']})
            # 添加好cookie后要刷新
            driver.get(get_check_is_login_url('oneness629'))
    else:
        logging.info("cookie临时文件为空，不设置登录cookie")
    pass

# 检查用户是否登录 true 已经登录，false 未登录
def check_steam_user_is_login(driver):
    try:
        loginform = driver.find_element_by_id('loginForm')
        logging.info("登录表单："+str(loginform))
        if loginform is not None:
            return False
        else:
            return True
    except NoSuchElementException as e:
        logging.info('没有读取到登录表单，说明已经登录 -> ' + e.message)
        return True
    except BaseException as e:
        logging.exception(e)
    return False

# 用户表单登录
def login_from(driver):
    try:
        user_dict = load_user_login_config()
        if user_dict is None:
            logging.warn('读取用户配置信息失败')
            return '读取用户配置信息失败'

        # 直接用API
        # WebDriver.find_element_by_id().is_displayed()
        driver.find_element_by_id('steamAccountName').send_keys(user_dict['steam_id'])
        driver.find_element_by_id('steamPassword').send_keys(user_dict['steam_password'])
        driver.find_element_by_id('loginForm').submit()

        # 检查2次登录弹窗是否显示
        # （login_twofactorauth_buttonsets 或者 login_twofactorauth_buttonset_entercode是2个提交和请求协助按钮的父div的id）
        WebDriverWait(driver, 5, 1).until(lambda driver_param : driver_param.find_element_by_id('login_twofactorauth_buttonset_entercode').is_displayed())

        login_code = raw_input("请输入2次验证码：")

        # 输入验证码并输入回车
        driver.find_element_by_id('twofactorcode_entry').send_keys(login_code)
        driver.find_element_by_id('twofactorcode_entry').send_keys(Keys.ENTER)

        # 需要等待并检查页面内容 否者不能确定是否成功 暂时等待10s
        logging.info('等待10s')
        time.sleep(10)

        # 写入cookie以便下次使用
        set_cookie_content(str(driver.get_cookies()))

        return True
    except BaseException as e:
        logging.exception(e)
        return False

# 设置点赞cookie
def set_voteup_cookie(driver):
    script = open('./script/voteupCookie.js').read();
    driver.execute_script(script);
    return True

# 执行steam自动点赞js脚本
def exec_steam_auto_voteup_batch_script(driver):
    script = open('./../../steam_auto_voteup_batch.user.js').read();
    driver.execute_script(script);
    return True

# 获取steam用户名
def get_login_steam_name(driver):
    global_action_menu = driver.find_element_by_id('global_action_menu')
    if global_action_menu is not None:
        logging.info(global_action_menu)
        return global_action_menu


# 获取XPath命令执行的内容
def get_xpath_content(driver, xpath):
    content = None
    if driver is not None:
        element = driver.find_element_by_xpath(xpath)
        content = element.text
    return content