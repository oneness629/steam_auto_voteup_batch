# -*- coding: utf-8 -*-
import sys

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