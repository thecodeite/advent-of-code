#!/bin/bash

DATE_TODAY=$(date '+%d');

CAL_DATE="${DATE:-$DATE_TODAY}"

cp -r src/common/day00 "src/2023/day$CAL_DATE" 