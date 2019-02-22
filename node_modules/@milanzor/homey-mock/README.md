# Homey Mock
Mock Homey for unit-testing purposes


## What
This package provides a mocking class to allow developers to unit-test their Athom Homey apps


## Installation and usage
My preferred (the only one I have used actually...) JS unit testing utilities are Mocha together with Chai, so here's how you use them to mock Homey and unit test your app:

1. Install the following **DEV** dependencies in your app project:<br>
    `npm install -D mocha chai mock-require homey-mock`
2. Edit your package.json's `scripts => test` entry to `mocha ./test/**/*.test.js`, this will allow you to run `npm test` _later_ and all your test files will be executed.
3. Create a `test` directory in the root of your project
4. Create a file in the `test` directory called, say, `myapp.test.js` 
5. Have a look at the `./examples/basic.test.js` and `./examples/homeyapp.test.js` for some example code to put in your .test.js file.
6. Run `npm test` and see the result of your unit tests!

## Working example
For a working example, have a look at our Countdown app: https://github.com/NotQuiteZen/homey.countdown
and it's travis integration for automated Unit Tests: https://travis-ci.com/NotQuiteZen/homey.countdown


## IMPORTANT NOTE
- This currently only mocks a few functions that Homey supports, if you are missing anything, stuff will be added as I need them, but feel free te leave an issue or even a pull request.
- Hit me up on Athom's Slack community on `@milanzor`
