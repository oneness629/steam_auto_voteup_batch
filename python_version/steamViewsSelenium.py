# -*- coding: utf-8 -*-
import sys
import ssl
import logging
import time
from selenium import webdriver
from django.http.response import HttpResponse
from selenium.webdriver.firefox.options import Options
from test.pickletester import __main__
import os
import json
from steamBrowserFunctions import get_online_state
from steamBrowserFunctions import get_badges_count
from steamBrowserFunctions import get_games_count
from steamBrowserFunctions import get_screenshots_count
from steamBrowserFunctions import get_videos_count
from steamBrowserFunctions import get_myworkshopfiles_count
from steamBrowserFunctions import get_recommended_count
from steamBrowserFunctions import get_groups_count
from steamBrowserFunctions import get_friends_count
from steamBrowserFunctions import get_background_image_url

logging.basicConfig(level=logging.DEBUG)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

#去除SSL验证
ssl._create_default_https_context = ssl._create_unverified_context

# PhantomJs  可执行文件路径
phantomjs_path = 'D:/GreenProgramFiles/phantomjs-2.1.1-windows/bin/phantomjs.exe' 
# FireFox 可执行文件路径
firefox_path = 'D:/PortableApps/PortableApps/FirefoxPortable/App/Firefox64/firefox.exe'

# 使用浏览器驱动类型
driver_type_firefox = 'FireFox'
driver_type_phantomjs = 'PhantomJs'
driver_type = driver_type_firefox

def index(request):
    pass

# 获取steamID64
def get_steamid64(request, user):
    logging.info('get_steamid64 user : ' + user )
    url='https://steamcommunity.com/id/' + user
    
    open_browser(url)
    return HttpResponse(user)

# 打开浏览器并处理信息
def open_browser(url, functions):
    driver=None
    # 返回值
    return_dict = {}
    try:
        
        if driver_type == driver_type_firefox:
            # 无GUI模式FireFox
            firefox_option = Options()
            firefox_option.add_argument('--headless')
            firefox_option.add_argument('--disable-gpu')
            firefox_option.binary_location = firefox_path
            
            driver = webdriver.Firefox(options=firefox_option)
        elif driver_type == driver_type_phantomjs :
            driver = webdriver.PhantomJS(executable_path=phantomjs_path)
        
        logging.info(u'浏览器驱动加载完成 -> URL :' + url)
        driver.get(url)
        
        # 网页中记录64位ID的变量为 g_steamID
        logging.debug(u'页面内容 写入文件')
        return_dict['_html_'] = write_current_time_html_file(driver.page_source)
        
        
        if functions is not None:
            for k , fun in functions.items():
                return_dict[k] = fun(driver)
        
        
    except Exception as e:
        logging.exception(e)
    finally:
        if driver is not None:
            logging.info(u'关闭浏览器')
            driver.quit()
    return return_dict



def write_current_time_html_file(content):
    #定义时间显示格式
    fmt='%Y_%m_%d__%H_%M_%S'
    date_string=time.strftime(fmt,time.localtime(time.time()))
    temp_path = 'temp'
    if os.path.exists(temp_path) != True :
        os.mkdir(temp_path)
    file_name = temp_path + '/' + date_string + '.html'
    write_file(file_name,content)
    return file_name

# 写入文件
def write_file(file_name,content):
    logging.debug(u'写入文件 : ' + file_name)
    file = None
    try:
        file = open(file_name,'w+')
        file.write(content)
        file.flush()
        file.close()
    except Exception as e:
        logging.exception(e) 
    finally:
        if file is not None:
            file.close()



    