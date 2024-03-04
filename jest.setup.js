//jest.setup.js

import 'jest-canvas-mock';


process.env.NODE_ENV = 'test'; // Set the environment to test

//ignore console logs for better test output
// eslint-disable-next-line no-undef
//console.log = jest.fn();
// eslint-disable-next-line no-undef
//console.error = jest.fn();