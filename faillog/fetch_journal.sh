#!/bin/bash

if [[ -z $1 ]];
then
    echo "Please specify a time interval."
    echo "Usage: ./fetch_journal.sh <time interval> <copy interval>"
    exit
fi
if [[ $1 == "--help" ]];
then
    echo "Usage: ./fetch_journal.sh <time interval> <copy interval>"
    echo "The time interval is used to specify time between journal reads, and the copy interval is used to reduce disk I/O."
    echo -e "\t--help\tdisplay this help and exit"
    exit
fi

touch sshd.json
journalctl -q -u sshd --no-pager -o json -n 10000 | egrep -i "attempts exceeded|Bye Bye" > sshd.json
TIME=$( date +"%T" )
LENGTH=$(fgrep -o "{" sshd.json | wc -l)
echo $LENGTH

while true
do
        NEWDATA=$(journalctl -q -u sshd --no-pager -o json --since $TIME | egrep -i "attempts exceeded|Bye Bye")
        DELTA=$(echo $NEWDATA | fgrep -o "{" | wc -l)
        if [[ $DELTA -gt 2 ]]; then
            sed -i 1,"$DELTA"d sshd.json
            echo $NEWDATA >> sshd.json
            TIME=$( date +"%T" )
        fi
        sleep $1
done
