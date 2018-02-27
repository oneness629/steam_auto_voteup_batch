# -*- coding: utf-8 -*-
import json

from commom.config import *
from steam.auto_voteup.steamAutoVoteupFunction import *
from steam.twofactor_emergency_code.steamTwofactorEmergencyCodeFunction import write_twofactor_emergency_code_to_file
from driver.browserSelenium import Browser


# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 浏览器
browser = Browser()

# 登录用户检查
def get_twofactor_emergency_code():
    functions = {
        # 写入存在的登录cookie
        'write_login_cookie_to_browser_content': write_login_cookie_to_browser_content,
        # 检查用户是否登录
        'check_steam_user_is_login':check_steam_user_is_login
    }
    result_dict = browser.open_browser(get_twofactor_emergency_code_url(), functions, browser.driver, False)
    logging.info('写入cookie结果和用户是否登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))
    if result_dict['check_steam_user_is_login'] == False:
        # 执行用户登录
        functions = {'login_from':login_from}
        result_dict = browser.open_browser(None, functions, browser.driver, False)
        logging.info('用户登录结果 : ' + json.dumps(result_dict).decode("unicode-escape"))

    functions = {
        # 获取备用码
        'write_twofactor_emergency_code_to_file': write_twofactor_emergency_code_to_file,
    }
    result_dict = browser.open_browser(None, functions, browser.driver, False)
    logging.info('获取备用码并写入到文件结果 : ' + json.dumps(result_dict).decode("unicode-escape"))


# 获取备用码URL
def get_twofactor_emergency_code_url():
    return 'https://store.steampowered.com/twofactor/manage_action'

# 获取备用码主函数
def main():
    try:
        logging.info('即将获取steam2次验证紧急备用码')
        try:
            get_twofactor_emergency_code()
        except BaseException as e:
            raise BaseException('获取steam2次验证紧急备用码异常')
        else:
            logging.info('获取steam2次验证紧急备用码成功')
            # 程序正常退出
            return 0
    except BaseException as e:
        logging.exception(e)
        # 程序异常退出
        return 1
    finally:
        # 最后要关闭浏览器
        browser.close_browser()
        logging.info('关闭浏览器成功')