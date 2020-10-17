#!/bin/sh


rsync -av --delete-after --exclude-from=.stage_exclusions --no-perms -t ./ root@142.93.118.160:/home/hansolo/timeup