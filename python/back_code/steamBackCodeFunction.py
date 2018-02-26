# -*- coding: utf-8 -*-
import logging
import sys

from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

from auto_voteup.steamAutoVoteupConfig import load_user_login_config, get_cookie_content, set_cookie_content, \
    get_check_is_login_url

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 获取备用码并写入到文件
def get_backup_code_to_file(driver):
    steam_authenticator_emergency_codes = driver.find_element_by_id('steam_authenticator_emergency_codes')
    # 提交获取备用码表单
    steam_authenticator_emergency_codes.submit()

    WebDriverWait(driver, 20, 2).until(_check_twofactor_settings_input_is_displayed, '检查超时:检查输入2次验证码的输入文本框是否存在并显示操作超时')

    twofactor_settings_input = driver.find_element_by_class_name('twofactor_settings_input')
    login_code = raw_input("请输入2次验证码：")

    twofactor_settings_input.send_keys(login_code)
    twofactor_settings_input.send_keys(Keys.ENTER)

    WebDriverWait(driver, 20, 2).until(_check_twofactor_backup_code_is_show, '检查超时:检查二次认证备份码是否存在并显示在网页 操作超时')
    # twofactor_emergency_code_left -> 每一个验证码 class name

    twofactor_emergency_code_left_list = driver.find_elements_by_class_name('twofactor_emergency_code_left')
    logging.info('twofactor_emergency_code_left : ' + str(twofactor_emergency_code_left_list))
    logging.info('twofactor_emergency_code_left len: ' + str(len(twofactor_emergency_code_left_list)))
    #10个 还有下面2行
    #twofactor_emergency_code
    #twofactor_emergency_code_end
    for element in twofactor_emergency_code_left_list:
        logging.info(element.text)


    return False

# 检查二次认证备份码是否存在并显示在网页
def _check_twofactor_backup_code_is_show(driver):
    try:
        twofactor_settings_input = driver.find_element_by_class_name('twofactor_emergency_code_left')
        if twofactor_settings_input is not None:
            return True
    except BaseException as e:
        logging.exception("没有找到 class name为'twofactor_emergency_code_left'的Element。")
        return False



# 检查输入2次验证码的输入文本框是否存在并显示
def _check_twofactor_settings_input_is_displayed(driver):
    try:
        twofactor_settings_input = driver.find_element_by_class_name('twofactor_settings_input')
        if twofactor_settings_input is not None:
            return True
    except BaseException as e:
        logging.exception("没有找到 class name为'twofactor_settings_input'的Element。")
        return False