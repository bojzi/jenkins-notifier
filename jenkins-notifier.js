'use strict';
var url = require('url');
var jenkins = require('jenkins');
var notifier = require('node-notifier');
var open = require('open');
var path = require('path');
var logSymbols = require('log-symbols');

module.exports = function checkJenkins(username, password, urlInput, interval) {
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
        var unstableJobsList = '';

        connection.job.list(function (err, data) {
            if (err) throw err;

            for (var i in data) {
                if (data[i].color === 'red'
                    || data[i].color === 'red_anime'
                    || data[i].color === 'yellow'
                    || data[i].color === 'yellow_anime') {
                    newErrorCount++;
                    unstableJobsList += '  - ' + data[i].name + '\n';
                }
            }

            if (unstableJobsList.length > 0) {
                unstableJobsList = '  Unstable jobs: \n' + unstableJobsList;
            }

            if (errorCount < newErrorCount) {
                console.log(logSymbols.error, '[' + new Date() + ']\n  There are new unstable jobs. \n  Unstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')\n' + unstableJobsList);
                notifier.notify({
                    title: 'More unstable jobs in Jenkins',
                    message: 'There are new unstable jobs. \nUnstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')',
                    icon: path.join(__dirname, 'icon.png'),
                    sound: true,
                    wait: true
                })
            }
            else if (errorCount > newErrorCount) {
                console.log(logSymbols.success,'[' + new Date() + ']\n  Some unstable jobs were fixed. \n  Unstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')\n' + unstableJobsList);
                notifier.notify({
                    title: 'Less unstable jobs in Jenkins',
                    message: 'Some unstable jobs were fixed. \nUnstable job count: ' + newErrorCount + ' (previously: ' + errorCount + ')',
                    icon: path.join(__dirname, 'icon.png'),
                    sound: true,
                    wait: true
                })
            }

            errorCount = newErrorCount;
        });
    }

    setInterval(checkJenkins, interval);
}


