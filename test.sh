#!/bin/bash

DATE_TODAY=$(date '+%d');

CAL_DATE="${DATE:-$DATE_TODAY}" 

jest "./src/2023/day${CAL_DATE}" --watch