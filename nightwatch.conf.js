/* eslint-disable import/no-extraneous-dependencies */
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require',
    'step_definitions',
    '--format',
    'json:reports/cucumber.json',
    'features',
  ],
});

module.exports = {
  output_folder: 'reports',
  custom_assertions_path: '',
  live_output: false,
  disable_colors: false,
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: '',
    host: '127.0.0.1',
    port: 4444,
  },
  test_settings: {
    default: {
      launch_url: 'http://localhost:3000',
      selenium_port: 4444,
      selenium_host: '127.0.0.1',
    },
    bamboo: {
      launch_url: process.env.E2E_LAUNCH_URL,
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          binary: '/usr/bin/google-chrome-stable',
          args: ['headless'],
        },
      },
      selenium: {
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path,
        },
      },
    },
    chrome: {
      launch_url: process.env.E2E_LAUNCH_URL || 'http://localhost:3000',
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
      selenium: {
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path,
        },
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        marionette: true,
      },
      selenium: {
        cli_args: {
          'webdriver.gecko.driver': geckodriver.path,
        },
      },
    },
  },
};
