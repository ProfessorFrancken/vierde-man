# ♣ Vierdeman?

Play klaverjas like we're used to at Francken.

## Contributing


This project has been made using [react](https://reactjs.org/),
[boardgame.io](https://boardgame.io/documentation/) and
[koa](https://koajs.com/). 
To get started you will have to install [node and
npm](https://www.npmjs.com/get-npm) (or use `docker-compose` if you prefer to
use Docker).

Once you've installed npm use it to install this app's dependencies,

``` sh
npm install
```

Next you can start the app with,

``` sh
npm run start
```

This will open your browser at http://localhost:3000 and open the app.
Before being able to play and login however you need to start the server,

``` sh
npm run server
```

Once that's all done you should be able to login, open rooms and play games. 
You can use multiple browsers and / or incognito sessions to play and debug a
game. 

### Testing

Tests can be run using

``` sh
npm run test
```

### Architecture of the app

As mentioned we use react, boardgame.io and koa: 

- react: is the frondend framework used for the user interface
- boardgame.io: contains the klaverjas logic and communication logic. 
- koa: the server used internally by boardgame.io and extended upon in `src/server/server.js`

#### React

See `src/`

Note: the folder structure will likely be refactored a bit so that most of react
code will be in `src/ui/`.

##### React context

TODO

###### localstorage state hook

TODO

##### Klaverjas components

TODO

#### Boardgame.io

See `src/GameLogic/`

#### Koa

See `src/server/`

##### Data storage

TODO

##### Authentication

TODO

# Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
