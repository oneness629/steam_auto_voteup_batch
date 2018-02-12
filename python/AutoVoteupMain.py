# -*- coding: utf-8 -*-
import sys
import logging.config
from auto_voteup import steamAutoVoteup

logging.config.fileConfig('logging.conf')

if __name__ == '__main__':
    sys.exit(steamAutoVoteup.main())