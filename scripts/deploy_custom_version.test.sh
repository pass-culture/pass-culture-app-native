#!/usr/bin/env bash

test_the_echo() {
    ## assertContains $helpMessage $expectedResult $commandToTrigger
    assertContains "c'est pas la meme chose" "V1.0.0" "$(yarn trigger:testing:deploy:custom V1.0.0)"
}

. shunit2
