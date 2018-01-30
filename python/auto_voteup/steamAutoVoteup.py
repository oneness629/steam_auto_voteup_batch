# -*- coding: utf-8 -*-
from python.driver.steamViewsSelenium import *
import json

logging.basicConfig(level=logging.DEBUG)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

def check_is_login(driver):
    if driver is not None:
        pass
    else:
        logging.info('浏览器驱动为空')


# 自动点赞
def auto_voteup(driver):

    if driver is not None:
        pass
    else:
        logging.info('浏览器驱动为空')


def main():
    fucntions = {
        'auto_voteup': auto_voteup,
    }
    result_dict = open_browser('https://steamcommunity.com/id/oneness629/home/', fucntions)
    # \u 字符串转中文
    logging.info(json.dumps(result_dict).decode("unicode-escape"))


if __name__ == '__main__':
    main()
