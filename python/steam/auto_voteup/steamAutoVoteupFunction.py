# -*- coding: utf-8 -*-
import logging
import sys

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait

from commom.config import get_cookie_content, set_cookie_content
from driver.browserFunction import check_element_is_exist
from steam.config.steamConfig import load_user_login_config


# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 写入登录cookie内容
def write_login_cookie_to_browser_content(driver):
    cookie_content = get_cookie_content()
    if cookie_content is not None and len(cookie_content) > 0:
        logging.debug('读取到的cookie内容为 ->' + cookie_content)
        cookies_dict = eval(cookie_content)
        for cookie in cookies_dict:
            logging.debug('添加cookie ->' + str({'name' : cookie['name'], 'value' : cookie['value']}))
            driver.add_cookie({'name' : cookie['name'], 'value' : cookie['value']})
        # 添加好cookie后要刷新
        logging.info('读取cookie并重新写入到浏览器成功，重新刷新页面')
        driver.refresh()
        return True
    else:
        logging.info("cookie临时文件为空，不设置登录cookie")
        return False

# 检查用户是否登录 true 已经登录，false 未登录
def check_steam_user_is_login(driver):
    is_exist_login_form = check_element_is_exist(driver, 'loginForm')
    if is_exist_login_form is True:
        logging.info('读取到登录表单(loginForm)，用户未登录。')
        return False
    else:
        is_exist_login_form = check_element_is_exist(driver, 'login_form')
        if is_exist_login_form is True:
            logging.info('读取到登录表单(login_form)，用户未登录。')
            return False
        else:
            logging.info('没有读取到登录表单，用户已登录。')
            return True

def get_steam_login_form_id(driver):
    is_exist_login_form = check_element_is_exist(driver, 'loginForm')
    if is_exist_login_form is True:
        return 'loginForm'
    else:
        is_exist_login_form = check_element_is_exist(driver, 'login_form')
        if is_exist_login_form is True:
            return 'login_form'
        else:
            logging.info('该页面没有steam登录表单')
            return None

# 用户表单登录
def login_from(driver):
    user_dict = load_user_login_config()
    if user_dict is None:
        logging.warn('读取用户配置信息失败')
        return False

    # 检查是否有 remember_login 在这台电脑上记住我 复选框
    try:
        remember_login = driver.find_element_by_id('remember_login')
        if remember_login is not None:
            #  按空格自动checked
            remember_login.send_keys(Keys.SPACE)
            logging.info("勾选 在这台电脑上记住我（div id : remember_login） 复选框。")
    except BaseException as e:
        logging.exception("没有找到 在这台电脑上记住我（div id : remember_login） 复选框，不进行勾选操作。")

    # steam 登录页面存在2种不同的表单和对应值
    login_from_id = get_steam_login_form_id(driver)
    if login_from_id == 'loginForm':
        driver.find_element_by_id('steamAccountName').send_keys(user_dict['steam_id'])
        driver.find_element_by_id('steamPassword').send_keys(user_dict['steam_password'])
        driver.find_element_by_id('steamPassword').send_keys(Keys.ENTER)
    elif  login_from_id == 'login_form':
        driver.find_element_by_id('input_username').send_keys(user_dict['steam_id'])
        driver.find_element_by_id('input_password').send_keys(user_dict['steam_password'])
        driver.find_element_by_id('input_password').send_keys(Keys.ENTER)

    # 检查用户名密码是否正确
    WebDriverWait(driver, 20, 1).until(_check_user_and_password_is_success, '检查超时:检查用户名密码是否正确超时')

    login_code = ''
    is_auto_login_not_tip = user_dict['is_auto_login_not_tip']
    if is_auto_login_not_tip is False:
        login_code = raw_input("请输入2次验证码：")
    else:
        # 读取备用验证码数组文件
        array = eval(open('../config/twofactor_emergency_code.array', 'r').read())
        if array is not None and array[0] is not None:
            logging.warn('使用备用码>' + str(array[0]))
            login_code = array[0]
            array.remove(array[0])
            logging.warn('剩余' + str(len(array)) + '个备用码')
            open('../config/twofactor_emergency_code.array', 'w+').write(str(array))
        pass

    # 输入验证码并输入回车
    driver.find_element_by_id('twofactorcode_entry').send_keys(login_code)
    driver.find_element_by_id('twofactorcode_entry').send_keys(Keys.ENTER)

    # 需要等待并检查页面内容 否则不能确定是否成功
    # 检查 id： account_pulldown的element的text是否包含用户名，不存在都算失败
    # WebDriverWait(driver, 10, 2).until(lambda driver_param : driver_param.find_element_by_id('account_pulldown').is_displayed())
    WebDriverWait(driver, 20, 2).until(_check_user_is_login_success, '检查超时:无法获取到用户是否登录成功标签DIV信息')

    logging.info('用户登录成功')

    # 写入cookie以便下次使用
    set_cookie_content(str(driver.get_cookies()))

    return True

# 检查用户名密码是否正确
def _check_user_and_password_is_success(driver):
    # error_display 错误提示div id
    error_display = driver.find_element_by_id('error_display')
    if error_display is None:
        logging.info('检查用户密码是否正确标签DIV为空，稍后再试。')
        return False
    if error_display is not None and error_display.is_displayed():
        raise BaseException('登录异常，提示信息为：' + error_display.text)
    else:
        # 如果没有找到error_display 用户密码正确，要求输入2次验证码
        # login_twofactorauth_buttonset_entercode  2次验证码弹出DIV
        login_twofactorauth_buttonset_entercode = driver.find_element_by_id('login_twofactorauth_buttonset_entercode')
        if login_twofactorauth_buttonset_entercode is not None and login_twofactorauth_buttonset_entercode.is_displayed():
            return True
    return False

# 检查用户是否登录成功
def _check_user_is_login_success(driver):
    global_action_menu = driver.find_element_by_id('global_action_menu')
    if global_action_menu is not None:
        global_action_menu_text = global_action_menu.text
        logging.info('用户是否成功检查标记内容: ' + global_action_menu_text)
        # 如果登录成功，这个div中将显示用户名
        if global_action_menu_text.find('oneness629') != -1:
            logging.info('检查到用户登录')
            return True
    else:
        logging.info('用户是否成功检查标记内容为空，稍后再次尝试。')
    return False


# 设置点赞cookie
def set_voteup_cookie(driver):
    script = open('../config/js/voteupCookie.js').read();
    driver.execute_script(script);
    return True

# 执行steam自动点赞js脚本
def exec_steam_auto_voteup_batch_script(driver):
    script = open('../../steam_auto_voteup_batch.user.js').read();
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