# -*- coding: utf-8 -*-
import logging
import sys

# 编码问题
from commom.config import load_config

reload(sys)
sys.setdefaultencoding('utf8')


# 读取用户登录相关配置
def load_user_login_config():
    config = load_config()
    if config is None:
        logging.warn('无法读取配置文件')
        return

    is_auto_login_not_tip = config['is_auto_login_not_tip']
    steam_id = config['steam_id']
    steam_password = None

    try:
        steam_password = config['steam_password']

    except KeyError as e:

        if is_auto_login_not_tip is False:
            steam_password = raw_input("请输入用户<"+steam_id+">的密码:")
        else:
            raise KeyError('自动登录不允许输入密码')

    logging.info('steam_id : ' + steam_id)
    return {'steam_id': steam_id , 'steam_password' : steam_password, 'is_auto_login_not_tip' : is_auto_login_not_tip}


# 检查登录URL模板
_check_is_login_url_model = 'https://steamcommunity.com/id/#steam_id#/home/'

# 获取检查登录URL
def get_check_is_login_url(steam_id):
    if steam_id is not None:
        url = _check_is_login_url_model.replace('#steam_id#', steam_id)
        logging.info("返回URL地址："+url)
        return url
    else:
        logging.info('steam_id参数为空')


