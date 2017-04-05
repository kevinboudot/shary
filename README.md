# Shary

![alt tag](http://i.imgur.com/NvtGzSH.png)

Shary is a Mac OS App created to easily send files in the cloud and paste link to clipboard. This App is written in Javascript with Electron.

It sends media files to an Amazon S3 Bucket, and sends datas informations to an other server, used to create an access link and see our medias on a webpage.

This is only the "App" part of services like Infinit, CloudApp, Cloudup.. it only sends datas, if you want a complete service you need to create your own website to host webpages, and create your own S3 bucket to store medias.

### To Do

- [x] Drag & drop files on App icon
- [x] Send screenshots automatically (cmd + shift + 3 & cmd + shift + 4)
- [x] Paste link to clipboard
- [x] Two steps sound notification: First sound when link is created, second one when upload is finished
- [x] Allow Multiple files
- [x] Preference: Launch at start
- [x] Prevent new uploads during process
- [ ] Improve area screenshot (cmd + shift + 4)
- [ ] Offline: Specific icon & prevent new uploads
- [ ] Preference: enable/disable screenshot service
- [ ] Video Screen (https://github.com/hokein/electron-sample-apps/tree/master/desktop-capture)
- [ ] ..

### Compatibility

Mac OS 10.12.4

### Use

dev:

```js
npm run dev
````

build:

```js
npm run build
````
