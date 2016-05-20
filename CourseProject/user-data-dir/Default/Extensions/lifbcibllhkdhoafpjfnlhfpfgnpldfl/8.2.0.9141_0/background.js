/* globals SkypeC2CTelemetry */
/**
This is the script run when the browser starts up and is not associated
with any tab. Here we create a add-on icon in the add-on bar to display
the options.
*/
'use strict';
/**
* Returns the product version number
*
* @return Product version number
*/
var getProductVersion = function() {
    return '8.2.0.9141';
};

/**
* Stores configuration information
*/
var Configuration = {
    configReady: '0',
    fingerPrint : '0',
    metricsUrl: 'https://pipe.skype.com/Client/2.0/',
    pushToMobileUrl: 'https://c2c-p2m-secure.skype.com/p2m/v1/push',
    lookupHost: 'pnrws.skype.com',
    uiId : 0
};

/**
* Queries configuration information from PNR service
*/
var queryConfig = function () {
    if (Configuration.configReady === '1') {
        // We already have configuration information
        return;
    }

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onreadystatechange = function () {
        if (ajaxReq.readyState === 4 && ajaxReq.status === 200) {
            var jsonData = JSON.parse(ajaxReq.responseText);

            if (jsonData.fp) {
                Configuration.fingerPrint = jsonData.fp;
            }
            if (jsonData.metrics_url) {
                Configuration.metricsUrl = jsonData.metrics_url;
            }
            if (jsonData.lookup_host) {
                Configuration.lookupHost = jsonData.lookup_host;
            }
            if (jsonData.pushtomobile_url) {
                Configuration.pushToMobileUrl = jsonData.pushtomobile_url;
            }
            if (jsonData.ui_id) {
                Configuration.uiId = parseInt(jsonData.ui_id);
            }
            Configuration.configReady = '1';

            // Ensure UI id is something we understand
            if (Configuration.uiId !== 0 && Configuration.uiId !== 1) {
                Configuration.uiId = 0;
            }
        }
    };

    ajaxReq.open('GET', 'https://localhost:26143/skypectoc/v1/pnr/config', false);

    // Send the request
    ajaxReq.send();
};

/**
* Sends metrics data
*/
var postMetrics = function(event, userKVPs) {

    if ( event === 'extension_state' ) {
        SkypeC2CTelemetry.post( Configuration.metricsUrl,
            event,
            false, {
                Fingerprint: Configuration.fingerPrint,
                UiId: Configuration.uiId.toString(),
                ReferrerUrl: userKVPs.url,
                Enabled: userKVPs.chosenFunction
            }
        );
    } else if ( event === 'help_page_click' ) {
        SkypeC2CTelemetry.post( Configuration.metricsUrl,
            event,
            false, {
                Fingerprint: Configuration.fingerPrint,
                UiId: Configuration.uiId.toString(),
                ReferrerUrl: userKVPs.url
            }
        );
    }
};

var openFaqTab = function() {
    chrome.tabs.create({
        url: 'https://go.skype.com/skype.extension.faq'
    });
};

var firstLaunchExperience = function() {
    var previousVersion = localStorage.getItem('skype_version');
    var newVersion = getProductVersion();
    if (!previousVersion){
        openFaqTab();
    } else {
        var newMajorVersion = parseInt(newVersion.split('.')[0], 10);
        var previousMajorVersion = parseInt(previousVersion.split('.')[0], 10);
        if (newMajorVersion && previousMajorVersion && (newMajorVersion > previousMajorVersion)) {
            openFaqTab();
        }
    }
    localStorage.setItem('skype_version', getProductVersion());
};

var switchOffHighlightingNotification = function(){
    var previousState = JSON.parse(window.localStorage.getItem('switchState'));
    if (previousState === null) {
        window.localStorage.setItem('switchState', false);
    }
    else if (previousState === true) {
        window.localStorage.setItem('switchState', false);
        if (window.navigator.platform.toUpperCase().indexOf('WIN') >= 0) {
            if (JSON.parse(window.localStorage.getItem('displayNotification')) === null) {
                window.localStorage.setItem('displayNotification', true);
                chrome.tabs.create({
                    url: 'c2c_options_menu.html'
                });
            }
        }
    }
};

/**
* Main function where all the action starts
*/
var main = function() {

    firstLaunchExperience();

    switchOffHighlightingNotification();

    // Register listener to receive messages
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

        if ( request.op === 'GET_SETTINGS_REQUEST' ) {
            var message = {};
            message.switchState = JSON.parse(window.localStorage.getItem('switchState'));
            if ( message.switchState === null ) {
                message.switchState = false;
            }

            if ( Configuration.configReady === '0' ) {
                message.switchState = false;
            }

            message.fingerPrint = Configuration.fingerPrint;
            message.metricsUrl = Configuration.metricsUrl;
            message.lookupHost = Configuration.lookupHost;
            message.pushToMobileUrl = Configuration.pushToMobileUrl;
            message.uiId = Configuration.uiId;

            sendResponse(message);
        }
        else if ( request.op === 'SET_SETTINGS_REQUEST' ) {
            // Save the settings
            window.localStorage.setItem('switchState', request.switchState);

            // Inform all tabs about change in settings
            request.fingerPrint = Configuration.fingerPrint;
            request.metricsUrl = Configuration.metricsUrl;
            request.uiId = Configuration.uiId;

            chrome.tabs.query({}, function(tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                    chrome.tabs.sendMessage(tabs[i].id, request);
                }
            });
        }
        else if ( request.op === 'MENU_OPTION_CLICK') {
                var data = {
                    chosenFunction: request.option,
                    url: request.url.split('?')[0].split('#')[0]
                };
                postMetrics('extension_state', data);
        }
    });

    // Query configuration from PNR service
    queryConfig();
};

main();
