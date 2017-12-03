#!/bin/bash
touch sshd.json
journalctl -q -u sshd --no-pager -o json -n 1 > sshd.json
while true
do
        LENGTH=$(fgrep -o "{" sshd.json | wc -l)
        DATA=$(comm -23 <(journalctl -q -u sshd --no-pager -o json -n 1 | sort) <(sort sshd.json))
        DELTA=$(echo $DATA | fgrep -o "{" | wc -l)
        #DELTA=$(echo $DATA | wc -l)
        #echo $LINES
        #if [ $LINES -gt 50 ];
        #then
        #    sleep 5
        #fi
        journalctl -q -u sshd --no-pager -o json -n 1
        if [[ $LENGTH -gt 100 ]]; then
            journalctl -q -u sshd --no-pager -o json -n 1 > sshd.json
        fi
        #echo $DATA >> sshd.json
        if [[ $DELTA -gt 10 ]]; then
            echo "\n" >> sshd.json
            comm -23 <(journalctl -q -u sshd --no-pager -o json -n 100 | sort) <(sort sshd.json) >> sshd.json
        fi
        cat sshd.json
        fgrep -o "{" sshd.json | wc -l
        echo $LENGTH
        echo $DELTA
        #if [[ $LINES -gt 10 ]]; then
        #fi
        sleep 5
        clear
        
done
