function makeURL(toolchain, config) {
    return 'index.html?tc=' + toolchain + '&config=' + config;
}

function createWindow(url) {
    console.log('loading ' + url);
    window.open(url);
}

chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'run_package_config', true);
    xhr.onload = function() {
        var toolchain_config = this.responseText.split(' ');
        createWindow(makeURL.apply(null, toolchain_config));
    };
    xhr.onerror = function() {
        createWindow('index.html');
    };
    xhr.send();
});