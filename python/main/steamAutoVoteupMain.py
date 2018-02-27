# -*- coding: utf-8 -*-
import json
import sys
import logging.config
logging.config.dictConfig(json.load(open('../config/logging.json','r')))

from steam.auto_voteup import steamAutoVoteup

if __name__ == '__main__':
    sys.exit(steamAutoVoteup.main())