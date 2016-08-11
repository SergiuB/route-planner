Route planning web app

Node v6.x is required.

```
npm install
npm run build
npm start
```
Go to ```localhost:8080```.

For development purposes run webpack-dev-server with hot reload:
```
npm run dev
```

Go to ```localhost:8090```.

Supported features so far:
* add waypoints by clicking on the map
* remove waypoints by doubleclick
* drag waypoints on the map to reposition
* see distance and cummulated altitude for each segment

Technologies used: React, Redux, Babel, Webpack, Google Javascript API, Mocha, Chai, Enzyme, SinonJS, Material UI.
