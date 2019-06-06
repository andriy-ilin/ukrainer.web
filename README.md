# Ukrainer web application

[![Travis](https://travis-ci.org/andriy-ilin/ukrainer.web.svg?branch=master)](https://travis-ci.org/andriy-ilin/ukrainer.web)
[![Conventional Commits](https://img.shields.io/badge/Conventional_Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## About Ukrainer

Ukrainer, a new media project aimed to discover through a thorough research who we actually are and to share these discoveries. Ukrainer will share curious stories from obscure places, people, art, and food. Using what we’ve discovered, we will create a modern guide to Ukraine, translated into multiple languages.

## About project

Ukrainer.web - web enterprise application. Bootstrap with create react app, for administration (CRUD - operation) with:

- articles
- catalog articles
- shop items
- catalog of shop items
- languages list
- regions list
- authors list
- list of top articles
- list of favorites articles
- orders in online-shop
- devices list with confirming push notifications
- video and vlog list
- map points list

## Getting Started

Before start you need follow next steps:

1. Clone repo `git clone https://github.com/andriy-ilin/ukrainer.web.git`
2. Create file `.env` [List of variables](ENVIRONMENT.md).
3. Install all dependencies `npm ci`
4. Run application `npm start`

## Running the tests

Just write `npm run test:watch` for running tests with watcher.
Or you can write `npm run test:ci` for running tests like CI stage before deploy.

## Structure project `Ukrainer` and relative repo

1. Admin web application - [ukrainer.web](https://github.com/andriy-ilin/ukrainer.web)
2. Mobile application - [ukrainer.apl](https://github.com/andriy-ilin/ukrainer.apl)
3. API (send push notifications) - [ukrainer.api](https://github.com/andriy-ilin/ukrainer.api)

## Built With

This project was bootstrapped with:

- [Create React App](https://github.com/facebook/create-react-app) - build tool (under the hood use: Webpack, Babel, ESLint, etc)
- [antd](https://ant.design/) - A design system with values of Nature and Determinacy for better user experience of enterprise applications.
- [Firebase](https://firebase.google.com/) - Development platform with Firebase Auth and Firebase Realtime Database services.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/andriy-ilin/ukrainer.web/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Andriy Ilin** - _Initial work_ - [Github profile](https://github.com/andriy-ilin)

See also the list of [contributors](https://github.com/andriy-ilin/ukrainer.web/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
