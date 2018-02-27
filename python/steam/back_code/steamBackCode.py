# -*- coding: utf-8 -*-
import time
import json
from selenium.webdriver.firefox import webdriver
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

from steam.auto_voteup.steamAutoVoteupConfig import *
from steam.auto_voteup.steamAutoVoteupFunction import *
from steam.back_code.steamBackCodeFunction import get_backup_code_to_file
from driver.browserSelenium import Browser


# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 浏览器
browser = Browser()

# 登录用户检查
def get_backup_code():
    functions = {
        # 写入存在的登录cookie
        'write_login_cookie_to_browser_content': write_login_cookie_to_browser_content,
        # 检查用户是否登录
        'check_steam_user_is_login':check_steam_user_is_login
    }
    result_dict = browser.open_browser(get_backup_code_url(), functions, browser.driver, False)
    logging.info('写入cookie结果和用户是否登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))
    if result_dict['check_steam_user_is_login'] == False:
        # 执行用户登录
        functions = {'login_from':login_from}
        result_dict = browser.open_browser(None, functions, browser.driver, False)
        logging.info('用户登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

    functions = {
        # 获取备用码
        'get_backup_code_to_file': get_backup_code_to_file,
    }
    result_dict = browser.open_browser(None, functions, browser.driver, False)
    logging.info('获取备用码并写入到文件结果 : ' + json.dumps(result_dict).decode("unicode-escape"))


# 获取备用码URL
def get_backup_code_url():
    return 'https://store.steampowered.com/twofactor/manage_action'

