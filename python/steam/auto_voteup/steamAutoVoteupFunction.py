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

# 设置点赞cookie
def set_voteup_cookie(driver):
    script = open('config/js/voteupCookie.js').read();
    driver.execute_script(script);
    return True

# 执行steam自动点赞js脚本
def exec_steam_auto_voteup_batch_script(driver):
    script = open('../steam_auto_voteup_batch.user.js').read();
    driver.execute_script(script);
    return True
