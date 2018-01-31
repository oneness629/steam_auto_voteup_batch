# -*- coding: utf-8 -*-
import json
import logging

import sys

import os

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')
logging.info('当前工作目录：' + os.path.abspath('.'))

#配置文件名称
config_file = 'config.json'

def loadConfig():
    try:
        with open(config_file) as json_file:
            data = json.load(json_file)
            return data
        return None
    except BaseException as e:
        logging.exception('读取配置文件出现异常')
        logging.exception(e)
        return None

# 读取用户登录相关配置
def load_user_login_config():
    config = loadConfig()
    if config is None:
        logging.warn('无法读取配置文件')
        return

    steam_id = config['steam_id']
    steam_password = None
    try:
        steam_password = config['steam_password']
    except KeyError as e:
        steam_password = raw_input("请输入用户<"+steam_id+">的密码:")
    logging.info('steam_id : ' + steam_id)
    return {'steam_id': steam_id , 'steam_password' : steam_password}


# 检查登录URL模板
_check_is_login_url_model = 'https://steamcommunity.com/id/#steam_id#/home/'

# 获取检查登录URL
def get_check_is_login_url(steam_id):
    if steam_id is not None:
        url = _check_is_login_url_model.replace('#steam_id#', steam_id)
        logging.info("检查URL地址："+url)
        return url
    else:
        logging.info('steam_id参数为空')