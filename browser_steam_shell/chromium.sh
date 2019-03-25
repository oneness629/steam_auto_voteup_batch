#!/bin/bash
index=1
while true; do
        echo $index;
        chromium-browser https://steamcommunity.com/id/oneness629/home/
        index=$(($index+1));
done
