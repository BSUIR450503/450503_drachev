// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-CSS license that can be
// found in the LICENSE file.

/*function makeURL(toolchain, config) {
  return 'index.html?tc=' + toolchain + '&config=' + config;
}

function createWindow(url) {
  console.log('loading ' + url);
  window.open(url);
}

var xhr = new XMLHttpRequest();

xhr.open('GET', 'run_package_config', true);
xhr.onload = function() {
  var toolchain_config = this.responseText.split(' ');
  createWindow(makeURL.apply(null, toolchain_config));
};
xhr.onerror = function() {
  createWindow('index.html');
};
xhr.send();*/

/*chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
  chrome.tabs.executeScript(null, {
    "file": "common.js"
  }, function () { // Execute your code
    console.log("Script Executed .. "); // Notification on Completion
  });
});*/

function makeURL(toolchain, config) {
  return 'index.html?tc=' + toolchain + '&config=' + config;
}

function createWindow(url) {
  console.log('loading ' + url);
  chrome.app.window.create('index.html', {
    id: 'main',
    bounds: {
      width: 1024,
      height: 800
    }
  });
}

function onLaunched(launchData) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'run_package_config', true);
  xhr.onload = function() {
    var toolchain_config = this.responseText.split(' ');
    createWindow(makeURL.apply(null, toolchain_config));
  };
  xhr.onerror = function() {
    // Can't find the config file, just load the default.
    createWindow('index.html');
  };
  xhr.send();
}

chrome.app.runtime.onLaunched.addListener(onLaunched);
console.log("Script Executed .. "); // Notification on Completion
