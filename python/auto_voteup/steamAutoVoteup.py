# -*- coding: utf-8 -*-
from python.auto_voteup.steamAutoVoteupConfig import *
import json

from python.auto_voteup.steamAutoVoteupFunction import get_login_steam_name, check_steam_user_is_login, login_from
from python.driver.browserSelenium import Browser

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 浏览器
browser = Browser()


# 登录用户检查
def check_login_user():
    if browser is None :
        logging.info('浏览器为空')
        return False



    functions = {'check_steam_user_is_login':check_steam_user_is_login}
    result_dict = browser.open_browser(get_check_is_login_url('oneness629'), functions, browser.driver, False, False)
    logging.info('result_dict : ' + json.dumps(result_dict).decode("unicode-escape"))
    if result_dict['check_steam_user_is_login'] == False:
        functions = {'login_from':login_from}
        result_dict = browser.open_browser(None, functions, browser.driver, False, False)
        logging.info('result_dict : ' + json.dumps(result_dict).decode("unicode-escape"))
    else:
        pass

    logging.info('result_dict : ' + json.dumps(result_dict).decode("unicode-escape"))


# 自动点赞
def auto_voteup():
    try:
        check_login_user()
    except Exception as e:
        logging.exception(e)
    finally:
        # browser.close_browser()
        pass




def main():
    auto_voteup()

if __name__ == '__main__':
    main()
