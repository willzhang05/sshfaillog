#!/bin/bash
touch sshd.json
journalctl -q -u sshd --no-pager -o json -n 100 > sshd.json
TIME=$( date +"%T" )
while true
do
        LENGTH=$(fgrep -o "{" sshd.json | wc -l)
        NEWDATA=$(journalctl -q -u sshd --no-pager -o json --since $TIME)
        DELTA=$(echo $NEWDATA | fgrep -o "{" | wc -l)
        echo $LENGTH
        echo $DELTA
        if [[ $DELTA -gt 2 ]]; then
            head -n $DELTA sshd.json
            sed -i 1,"$DELTA"d sshd.json
            echo $NEWDATA >> sshd.json
            TIME=$( date +"%T" )
        fi
        #if [[ $LENGTH -gt 100 ]]; then
        #    journalctl -q -u sshd --no-pager -o json -n 100 > sshd.json
        #fi
        sleep 2
        
done
