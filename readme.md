# jenkins-notifier

jenkins-notifier is a Node CLI utility that displays a system notification and console message if the count of unstable jobs in Jenkins changes.

Unstable jobs are jobs with the [BallColor enum](http://javadoc.jenkins-ci.org/hudson/model/BallColor.html) of RED, RED_ANIME, YELLOW and YELLOW_ANIME.

Clicking on the notification will take you directly to Jenkins.
 
## Install

```
$ npm install -g jenkins-notifier
```

## Usage

```
jenkins-notifier {url} {username} [{interval}]
```

After starting, you'll be prompted for your Jenkins password.

The password is not visible while being typed in.

### Parameters
- `url` complete URL to Jenkins
- `username` your Jenkins username
- `interval` (*optional*) how often (in seconds) to check Jenkins

### Examples
```
jenkins-notifier http://jenkins.loc bruce 10
Enter Jenkins password:
jenkins-notifier is running and checking every 10s.
```

Checks Jenkins at `http://jenkins.loc` with the username `bruce` every `10` seconds.

## License
MIT © Kristian Poslek
