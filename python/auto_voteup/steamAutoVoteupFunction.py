# -*- coding: utf-8 -*-
import logging
import sys

from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.firefox.webelement import FirefoxWebElement

from python.auto_voteup.steamAutoVoteupConfig import load_user_login_config

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 检查用户是否登录
def check_steam_user_is_login(driver):
    try:
        loginform = driver.find_element_by_id('loginForm')
        logging.info("登录表单："+str(loginform))
        if loginform is not None:
            return False
        else:
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

        script = open('./script/loginFrom.js').read();
        script = script.replace('#steam_id#',user_dict['steam_id'])
        script = script.replace('#steam_password#',user_dict['steam_password'])
        driver.execute_script(script);

        login_code = raw_input("请输入2次验证码：")

        script = open('./script/loginTwoFrom.js').read();
        script = script.replace('#login_code#',login_code)
        driver.execute_script(script);

        return True
    except BaseException as e:
        logging.exception(e)
        return False


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