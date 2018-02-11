# -*- coding: utf-8 -*-
import time
import json
from selenium.webdriver.firefox import webdriver
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

from auto_voteup.steamAutoVoteupConfig import *
from auto_voteup.steamAutoVoteupFunction import *
from driver.browserSelenium import Browser

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
        # 检查用户是否登录
        'check_steam_user_is_login':check_steam_user_is_login
    }
    result_dict = browser.open_browser(get_check_is_login_url('oneness629'), functions, browser.driver, False)
    logging.info('写入cookie结果和用户是否登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))
    if result_dict['check_steam_user_is_login'] == False:
        # 执行用户登录
        functions = {'login_from':login_from}
        result_dict = browser.open_browser(None, functions, browser.driver, False)
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
    result_dict = browser.open_browser(None, functions, browser.driver, False)
    logging.info('执行点赞js结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

    # 执行点赞js
    functions = {'exec_steam_auto_voteup_batch_script':exec_steam_auto_voteup_batch_script}
    result_dict = browser.open_browser(None, functions, browser.driver, False)
    logging.info('执行点赞js结果 : ' + json.dumps(result_dict).decode("unicode-escape"))



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

# 点赞次数
voteup_count = 99999
# 点赞间隔时间(秒)
voteup_timeout = 60

def main():
    try:
        for i in range(voteup_count):
            logging.info('第' + str(i+1) + '次点赞操作开始')
            try:
                auto_voteup()
            except BaseException as e:
                logging.exception(e)
            logging.info('第' + str(i+1) + '次点赞操作结束')
            logging.info('等待' + str(voteup_timeout) + '秒后继续操作')
            time.sleep(voteup_timeout)
        # 程序正常退出
        return 0
    except BaseException as e:
        logging.exception(e)
        # 程序异常退出
        return 1
    finally:
        # 最后要关闭浏览器
        browser.close_browser()

if __name__ == '__main__':
    sys.exit(main())
