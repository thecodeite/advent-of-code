#!/bin/bash

# DATE_TODAY=$(date '+%d');
CURRENT_YEAR=$(cat CURRENT_YEAR);
DATE_TODAY=$(cat DATE_TODAY);

CAL_YEAR=$CURRENT_YEAR CAL_DATE="${DATE:-$DATE_TODAY}" ./node_modules/.bin/nodemon 