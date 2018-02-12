# -*- coding: utf-8 -*-
import json
import sys
import logging.config
from auto_voteup import steamAutoVoteup

logging.config.dictConfig(json.load(open('logging.json','r')))

if __name__ == '__main__':
    sys.exit(steamAutoVoteup.main())