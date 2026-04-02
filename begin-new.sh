#!/bin/bash

CURRENT_YEAR="2025"

echo $CURRENT_YEAR > CURRENT_YEAR

# DATE_TODAY=$(date '+%d');
read -p "Enter day (e.g. '05'): " DATE_TODAY
echo $DATE_TODAY > DATE_TODAY

CAL_DATE="${DATE:-$DATE_TODAY}"

mkdir -p "src/$CURRENT_YEAR"
cp -r src/common/day00 "src/$CURRENT_YEAR/day$CAL_DATE"