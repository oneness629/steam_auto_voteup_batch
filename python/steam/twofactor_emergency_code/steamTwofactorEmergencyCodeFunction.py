# -*- coding: utf-8 -*-
import logging
import sys

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait

# 编码问题
from steam.auto_voteup.steamAutoVoteupFunction import check_steam_user_is_login, login_from

reload(sys)
sys.setdefaultencoding('utf8')

# 获取备用码并写入到文件
def write_twofactor_emergency_code_to_file(driver):
    WebDriverWait(driver, 20, 2).until(_check_steam_authenticator_emergency_codes_is_displayed, '检查超时:检查获取备用令牌码按钮操作超时')

    steam_authenticator_emergency_codes = driver.find_element_by_id('steam_authenticator_emergency_codes')
    # 提交获取备用码表单
    steam_authenticator_emergency_codes.submit()

    WebDriverWait(driver, 20, 2).until(_check_twofactor_settings_input_is_displayed, '检查超时:检查输入2次验证码的输入文本框是否存在并显示操作超时')

    twofactor_settings_input = driver.find_element_by_class_name('twofactor_settings_input')
    login_code = raw_input("请输入2次验证码：")

    twofactor_settings_input.send_keys(login_code)
    twofactor_settings_input.send_keys(Keys.ENTER)

    # 这时候可能还会跳到登录页面
    is_re_login = check_steam_user_is_login(driver)
    if is_re_login is False:
        login_from(driver)

    WebDriverWait(driver, 20, 2).until(_check_twofactor_backup_code_is_show, '检查超时:检查二次认证备份码是否存在并显示在网页 操作超时')
    # twofactor_emergency_code_left -> 每一个验证码 class name

    twofactor_emergency_code_left_list = driver.find_elements_by_class_name('twofactor_emergency_code_left')
    twofactor_emergency_code_list = driver.find_elements_by_class_name('twofactor_emergency_code')

    twofactor_emergency_code = twofactor_emergency_code_left_list + twofactor_emergency_code_list
    logging.info('读取到的备用码如下：')
    back_code_array = []
    for element in twofactor_emergency_code:
        logging.info(element.text)
        back_code_array.append(element.text)

    if back_code_array is not None and len(back_code_array) > 0:

        logging.warn('保存新的备用码一共' + str(len(back_code_array)) + '个')
        open('../config/twofactor_emergency_code.array', 'w+').write(str(back_code_array))

    return False

# 检查 获取 Steam 备用令牌码 表单是否存在
def _check_steam_authenticator_emergency_codes_is_displayed(driver):
    try:
        twofactor_settings_input = driver.find_element_by_id('steam_authenticator_emergency_codes')
        if twofactor_settings_input is not None:
            return True
    except BaseException as e:
        logging.warn("没有找到 class name为'steam_authenticator_emergency_codes'的Element。")
        return False


# 检查二次认证备份码是否存在并显示在网页
def _check_twofactor_backup_code_is_show(driver):
    try:
        twofactor_settings_input = driver.find_element_by_class_name('twofactor_emergency_code_left')
        if twofactor_settings_input is not None:
            return True
    except BaseException as e:
        logging.warn("没有找到 class name为'twofactor_emergency_code_left'的Element。")
        return False



# 检查输入2次验证码的输入文本框是否存在并显示
def _check_twofactor_settings_input_is_displayed(driver):
    try:
        twofactor_settings_input = driver.find_element_by_class_name('twofactor_settings_input')
        if twofactor_settings_input is not None:
            return True
    except BaseException as e:
        logging.warn("没有找到 class name为'twofactor_settings_input'的Element。")
        return False