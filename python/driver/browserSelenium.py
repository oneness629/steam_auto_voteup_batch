# -*- coding: utf-8 -*-
import sys
import ssl
import logging
import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
import os

logging.basicConfig(level=logging.INFO)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 浏览器
class Browser():

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

    # 浏览器驱动
    driver=None

    # 初始化浏览器
    def init_browser(self, driver_type, is_hide_browser=True):
        if self.driver_type == self.driver_type_firefox:
            # 无GUI模式FireFox
            firefox_option = Options()
            if is_hide_browser is True:
                firefox_option.add_argument('--headless')
                firefox_option.add_argument('--disable-gpu')
            firefox_option.binary_location = self.firefox_path

            self.driver = webdriver.Firefox(options=firefox_option)
        elif self.driver_type == self.driver_type_phantomjs :
            self.driver = webdriver.PhantomJS(executable_path=self.phantomjs_path)

        logging.info(u'浏览器驱动加载完成 类型 -> ' + driver_type)
        return self


    # 打开浏览器并处理信息
    def open_browser(self, url, functions, driver=None, is_close=True, is_hide_browser=True):
        # 返回值
        return_dict = {}
        try:
            if driver is None:
                self.init_browser(self.driver_type, is_hide_browser)
            else:
                self.driver = driver

            if url is not None:
                logging.info(u'URL :' + url)
                self.driver.get(url)

                logging.info(u'将页面内容写入到文件')
                return_dict['_html_'] = self.write_current_time_html_file(self.driver.page_source)

            else:
                logging.info(u'URL为空，不执行网页请求。')

            if functions is not None and self.driver is not None:
                for k , fun in functions.items():
                    logging.info('执行' + str(fun) + '方法 ... ')
                    return_dict[k] = fun(self.driver)
        except Exception as e:
            logging.exception(e)
        finally:
            if driver is not None:
                if is_close is True:
                    self.close_browser()
        return return_dict

    # 关闭浏览器
    def close_browser(self):
        if self.driver is not None:
            logging.info(u'关闭浏览器')
            self.driver.quit()

    # 写入当前html文本，以便跟踪
    def write_current_time_html_file(self, content):
        #定义时间显示格式
        fmt='%Y_%m_%d__%H_%M_%S'
        date_string=time.strftime(fmt,time.localtime(time.time()))
        temp_path = 'temp'
        if os.path.exists(temp_path) != True :
            os.mkdir(temp_path)
        file_name = temp_path + '/' + date_string + '.html'
        self.write_file(file_name,content)
        return file_name

    # 写入文件
    def write_file(self, file_name,content):
        logging.info(u'写入文件 : ' + file_name)
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



    