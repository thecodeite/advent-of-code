#!/bin/bash

DATE_TODAY=$(date '+%d');

CAL_DATE="${DATE:-$DATE_TODAY}" ./node_modules/.bin/nodemon 