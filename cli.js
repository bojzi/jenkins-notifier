#!/usr/bin/env node
'use strict';
var meow = require('meow');
var prompt = require('prompt');
var jenkinsNotifier = require('./jenkins-notifier');

var cli = meow({
    help: [
        'Basic unstable job notifier (URL, username and password entered via prompt)',
        '	jenkins-notify',
        'Start jenkins-notifier with prefilled values (checks every 5 seconds)',
        '	jenkins-notify http://jenkins.location username',
        'Configure check interval to 10 seconds (set last parameter)',
        '	jenkins-notify http://jenkins.loc username 10',

    ]
});

var urlInput = cli.input[0],
    username = cli.input[1],
    interval = cli.input[2] ? (parseInt(cli.input[2]) * 1000) : 5000;

if (cli.input.length < 2) {
    var schema = {
        properties: {
            url: {
                description: 'Enter Jenkins URL:'
            },
            username: {
                description: 'Enter Jenkins username:'
            },
            password: {
                description: 'Enter Jenkins password:',
                hidden: true
            }
        }
    }
}
else {
    var schema = {
        properties: {
            password: {
                description: 'Enter Jenkins password:',
                hidden: true
            }
        }
    }
}

prompt.message = '';
prompt.delimiter = '';
prompt.start();

prompt.get(schema, function(err, result) {
    if (!result) {
        return void console.log('\nYou have to enter your data.');
    }

    var password = result.password;
    if (cli.input.length < 2) {
        urlInput = result.url;
        username = result.username;
    }

    if (!username || !password || !urlInput) {
        return void console.log('You forgot your username, password or Jenkins URL.');
    }

    jenkinsNotifier(username, password, urlInput, interval);
});
