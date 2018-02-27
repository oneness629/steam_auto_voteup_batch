# -*- coding: utf-8 -*-
import logging
import sys

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')

# 获取XPath命令执行的内容
def get_xpath_content(driver, xpath):
    content = None
    if driver is not None:
        element = driver.find_element_by_xpath(xpath)
        content = element.text
    return content

# 在浏览器中检查element是否存在
def check_element_is_exist(driver, element_id):
    try:
        element = driver.find_element_by_id(element_id)
        if element is not None:
            return True
    except NoSuchElementException as e:
        logging.warn('没有在浏览器中找到ID为' + element_id + '的Element')
    return False