# jenkins-notifier

Display a system notification if the count of unstable jobs in Jenkins changes.

Unstable jobs are jobs with the [BallColor enum](http://javadoc.jenkins-ci.org/hudson/model/BallColor.html) of RED, RED_ANIME, YELLOW and YELLOW_ANIME.

Clicking on the notification will take you directly to Jenkins.
 
## Install

```
$ npm install -g jenkins-notifier
```

## Usage

```
jenkins-notifier {username} {password} {url} [{interval}]
```

### Parameters
- `username` your Jenkins username
- `password` your Jenkins password
- `url` complete URL to Jenkins
- `interval` (*optional*) how often (in seconds) to check Jenkins

### Examples
```
jenkins-notifier foo bar http://jenkins.loc 10
```

Checks Jenkins at `http://jenkins.loc` with the username `foo` and password `bar` every `10` seconds.

## License
MIT © Kristian Poslek
