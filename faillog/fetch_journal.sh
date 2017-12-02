#!/bin/bash
echo -n > sshd.json
while true 
    do
        comm -23 <(journalctl -u sshd --no-pager -o json -n 10 | sort) <(sort sshd.json) > sshd.json
        sleep 5
done
