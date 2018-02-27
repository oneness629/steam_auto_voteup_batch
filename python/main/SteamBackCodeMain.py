# -*- coding: utf-8 -*-
import json
import logging.config

from steam.back_code import steamBackCode

logging.config.dictConfig(json.load(open('../config/logging.json','r')))

if __name__ == '__main__':
    steamBackCode.get_backup_code()