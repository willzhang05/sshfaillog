#!/bin/bash
touch sshd.json
journalctl -q -u sshd --no-pager -o json -n 1 > sshd.json
TIME=$( date +"%T" )
while true
do
        LENGTH=$(fgrep -o "{" sshd.json | wc -l)
        NEWDATA=$(journalctl -q -u sshd --no-pager -o json --since $TIME)
        DELTA=$(echo $NEWDATA | fgrep -o "{" | wc -l)
        if [[ $DELTA -gt 10 ]]; then
            echo "big"
            echo $NEWDATA >> sshd.json
            TIME=$( date +"%T" )
        fi
        echo $LENGTH
        echo $DELTA
        sleep 5
        clear
        
done
