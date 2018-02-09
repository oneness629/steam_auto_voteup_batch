# -*- coding: utf-8 -*-
import time
from selenium.webdriver.firefox import webdriver
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

from python.auto_voteup.steamAutoVoteupConfig import *
import json

from python.auto_voteup.steamAutoVoteupFunction import get_login_steam_name, check_steam_user_is_login, login_from, \
    exec_steam_auto_voteup_batch_script, set_voteup_cookie, write_login_cookie_to_browser_content
from python.driver.browserSelenium import Browser

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 浏览器
browser = Browser()


# 登录用户检查
def check_login_user():

    functions = {
        # 写入存在的登录cookie
        'write_login_cookie_to_browser_content': write_login_cookie_to_browser_content,
        # 检查登录
        'check_steam_user_is_login':check_steam_user_is_login
    }
    result_dict = browser.open_browser(get_check_is_login_url('oneness629'), functions, browser.driver, False, False)
    logging.info('检查用户登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))
    if result_dict['check_steam_user_is_login'] == False:
        # 执行用户登录
        functions = {'login_from':login_from}
        result_dict = browser.open_browser(None, functions, browser.driver, False, False)
        logging.info('用户登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

        # 检查结果
        return True

    else:
        # 检查用户名是否一致
            #用户名不一致，注销
        pass


# 点赞
def voteup():
    # 注入点赞cookie
    functions = {'set_voteup_cookie':set_voteup_cookie}
    result_dict = browser.open_browser(None, functions, browser.driver, False, False)
    logging.info('执行点赞js结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

    # 执行点赞js
    functions = {'exec_steam_auto_voteup_batch_script':exec_steam_auto_voteup_batch_script}
    result_dict = browser.open_browser(None, functions, browser.driver, False, False)
    logging.info('执行点赞js结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

    # 等待
    wait(browser.driver)
    logging.info('等待直到浏览器崩溃或异常等其它问题后重新执行')
    pass


# 等待10秒
def wait(driver):
    logging.info('等待10s')
    time.sleep(10)


# 自动点赞
def auto_voteup():
    try:
        check_login_user()
        voteup()
    except Exception as e:
        logging.exception(e)
    finally:
        # browser.close_browser()
        pass


def main():
    auto_voteup()

if __name__ == '__main__':
    main()
