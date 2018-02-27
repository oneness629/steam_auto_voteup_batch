# -*- coding: utf-8 -*-
import json
import logging.config

from steam.twofactor_emergency_code import steamTwofactorEmergencyCode

logging.config.dictConfig(json.load(open('../config/logging.json','r')))

if __name__ == '__main__':
    steamTwofactorEmergencyCode.get_twofactor_emergency_code()