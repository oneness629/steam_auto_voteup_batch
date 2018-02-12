# -*- coding: utf-8 -*-
import json
import logging
import sys
import os

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')
logging.info('当前工作目录：' + os.path.abspath('.'))

#配置文件名称
config_file = 'config.json'

# 读取配置文件
def load_config():
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

# 临时的cookie文件保存
temp_cookie_file = 'temp/temp_cookie.dict'

# 获取cookie内容
def get_cookie_content():
    try:
        with open(temp_cookie_file) as cookie_file:
            data = cookie_file.read()
            return data
        return None
    except BaseException as e:
        logging.exception('读取临时cookie文件出现异常')
        logging.exception(e)
        return None

# 设置cookie内容
def set_cookie_content(cookie_content):
    try:
        logging.info('写入cookie到' + temp_cookie_file +'以便下次使用')
        with open(temp_cookie_file, 'w+') as cookie_file:
            data = cookie_file.write(cookie_content)
    except BaseException as e:
        logging.exception('写入临时cookie文件出现异常')
        logging.exception(e)

