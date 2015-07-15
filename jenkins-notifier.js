#!/usr/bin/env node
'use strict';
var meow = require('meow');
var url = require('url');
var jenkins = require('jenkins');
var notifier = require('node-notifier');
var open = require('open');
var path = require('path');

var cli = meow({
    help: [
        'Basic unstable job notifier (checks every 5 seconds)',
        '	jenkins-notify username password http://jenkins.location',
        'Configure check interval to 10 seconds (set last parameter)',
        '	jenkins-notify username password http://jenkins.location 10'
    ]
});

var username = cli.input[0],
    password = cli.input[1],
    urlInput = cli.input[2],
    interval = cli.input[3] ? (parseInt(cli.input[3]) * 1000) : 5000;

if (!username || !password || !urlInput) {
    return void console.log('You forgot your username, password or Jenkins URL.');
}

try {
    var parsedUrl = url.parse(urlInput);
    parsedUrl.auth = username + ':' + password;
    var jenkinsUrl = url.format(parsedUrl);
}
catch (err) {
    return void console.log('There was an error parsing the Jenkins URL: ', err);
}

notifier.on('click', function (notifierObject, options) {
    open(jenkinsUrl);
});

var connection = jenkins(jenkinsUrl);
var errorCount = 0;
console.log('\njenkins-notifier is running and checking every ' + (interval / 1000) + 's.\n');

function checkJenkins() {
    var newErrorCount = 0;

    connection.job.list(function (err, data) {
        if (err) throw err;

        for (var i in data) {
            if (data[i].color === 'red'
                || data[i].color === 'red_anime'
                || data[i].color === 'yellow'
                || data[i].color === 'yellow_anime') {
                newErrorCount++;
            }
        }

        if (errorCount < newErrorCount) {
            notifier.notify({
                title: 'More unstable jobs in Jenkins',
                message: 'There are new unstable jobs. \n Unstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')',
                icon: path.join(__dirname, 'icon.png'),
                sound: true,
                wait: true
            })
        }
        else if (errorCount > newErrorCount) {
            notifier.notify({
                title: 'Less unstable jobs in Jenkins',
                message: 'Some unstable jobs were fixed. \n Unstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')',
                icon: path.join(__dirname, 'icon.png'),
                sound: true,
                wait: true
            })
        }

        errorCount = newErrorCount;
    });
}

setInterval(checkJenkins, interval);
