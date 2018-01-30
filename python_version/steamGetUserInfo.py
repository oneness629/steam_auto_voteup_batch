# -*- coding: utf-8 -*-
import sys
import logging
from steamViewsSelenium import *


logging.basicConfig(level=logging.DEBUG)

# 编码问题
reload(sys)
sys.setdefaultencoding('utf8')



def main():
    fucntions = {
        'online_state': get_online_state,
        'badges_count': get_badges_count,
        'games_count':get_games_count,
        'get_screenshots_count':get_screenshots_count,
        'get_videos_count':get_videos_count,
        'get_myworkshopfiles_count':get_myworkshopfiles_count,
        'get_recommended_count':get_recommended_count,
        'get_groups_count':get_groups_count,
        'get_friends_count':get_friends_count,
        'get_background_image_url':get_background_image_url,
    }
    result_dict = open_browser('https://steamcommunity.com/id/oneness629', fucntions)
    # \u 字符串转中文
    logging.info(json.dumps(result_dict).decode("unicode-escape"))


if __name__ == '__main__':
    main()
