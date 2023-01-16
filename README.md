# RKDWidget
## Demo site for TM API 

A simple NodeJS and jquery website to visualize the Translation Memory API RKD results

Ubuntu 22.04 installation

```
sudo apt install nodejs
node -v
sudo apt install npm
npm i request
```

[Link to the original resource web-page-development-using-widgets-for-trkd](https://developers.refinitiv.com/en/article-catalog/article/web-page-development-using-widgets-for-trkd).

UI is ugly and from 2013, but the code is very simple as an example. May update to more a modern dark theme in the future.

to set up and run see link above 

```
node app.js
```

NOTE: This demo does not automatically renew the RKD authenticiation token so it will stop working after approximately 90 minutes. Use something like [toad-scheduler](https://github.com/kibertoad/toad-scheduler) if you need this to continue to work.

