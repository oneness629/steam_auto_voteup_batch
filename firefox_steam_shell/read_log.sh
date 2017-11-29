#!/bin/bash

readLine=0
readIndex=0
while true
do
  clear
  readIndex=$[$readIndex+1]
  echo '第'$readIndex'次读取文件'
  lineIndex=0
  for line in `cat log.log`
  do
    lineIndex=$[$lineIndex+1]

    if [[ $readLine -gt $lineIndex ]]; then
      echo '跳过第'$lineIndex'行'
      continue
    fi
    
    echo '第'$lineIndex'行>'$line
    line=$(echo $line | tr '[a-z]' '[A-Z]')
    echo '  转成大写:'$line

    lineLength=${#line}    
    lineReErrorString=${line#'ERROR'}
    lineReErrorLength=${#lineReErrorString}
    echo '  长度:'$lineLength
    echo '  截取ERROR字符串后长度:'$lineReErrorLength   

    if [[ $lineLength -ne $lineReErrorLength ]]; then
      echo '关闭 FireFox'
      pkill firefox
    else
      echo '  没有ERROR字符串'
    fi
  done
  readLine=$[$lineIndex+1]
  
  if [[ $readIndex%60 -eq 0 ]]; then
    echo '60次读取文件后关闭 FireFox'
    pkill firefox
  fi

  echo '下一次从第'$readLine'行开始,等待60秒.'
  sleep 60s
done
