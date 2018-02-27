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
config_file = '../config/config.json'

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

# 临时的cookie文件保存
temp_cookie_file = '../temp/temp_cookie.dict'

# 获取cookie内容
def get_cookie_content():
    try:
        with open(temp_cookie_file) as cookie_file:
            data = cookie_file.read()
            return data
        return None
    except BaseException as e:
        logging.exception('读取临时cookie文件出现异常，请检查' + temp_cookie_file + '文件是否存在')
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

