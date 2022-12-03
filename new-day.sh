#!/bin/bash

DATE_TODAY=$(date '+%d');

CAL_DATE="${DATE:-$DATE_TODAY}"

cp -r src/day00 "src/day$CAL_DATE" 