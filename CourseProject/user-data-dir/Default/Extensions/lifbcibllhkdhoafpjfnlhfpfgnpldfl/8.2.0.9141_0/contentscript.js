'use strict';

/**
* Returns the product version number
*
* @return Product version number
*/
function getProductVersion() {
    return "8.2.0.9141";
}

/**
 * @brief Class that stores pair key:HTMLElement
 *        key is auto incremented when new element is added
 *        When you call getElement method the pair will be deleted from the collection
 */
function ElementsMap() {
    this.elementsMapIndex = -1;
    this.elements = {};

    /**
     * Get element by index and remove it from the collection
     *
     * @param index - index of the element in the collection
     * @return element at the specified index
     */
    this.getElement = function(index) {
        var element = this.elements[index];
        delete this.elements[index];
        return element;
    };

    /**
     * Store an element in the collection
     *
     * @param element - element to store in the collection
     * @return index where element was stored
     */
    this.setElement = function(element) {
        ++this.elementsMapIndex;
        this.elements[this.elementsMapIndex] = element;
        return this.elementsMapIndex;
    };
}

/**
 * @brief Object that stores html tags that we want to ignore.
 *        NOTE: Items in this list should be sorted array because we use binary search.
 */
var ElementsFilter = {
    // DOM elements to ignore
    elementsToIgnore : [   "A", "ACRONYM", "APPLET", "AREA", "AUDIO",
                           "BUTTON", "CANVAS", "CODE",
                           "COL", "COLGROUP", "COMMAND",
                           "DATALIST", "DEL", "DIR",
                           "EMBED", "FRAME", "FRAMESET",
                           "IFRAME", "IMG", "INPUT",
                           "KBD", "KEYGEN", "LABEL", "LINK",
                           "MAP", "MENU", "META", "METER",
                           "NAV", "NOFRAMES", "NOSCRIPT",
                           "OBJECT", "OPTGROUP", "OPTION", "OUTPUT",
                           "PARAM", "PROGRESS", "S", "SAMP",
                           "SCRIPT", "SELECT", "SOURCE", "STRIKE",
                           "STYLE", "TEXTAREA", "TIME",
                           "TRACK", "VAR", "VIDEO"],

    /**
     * Determine if an element on the ignore list
     *
     * @param element - DOM element to check against the list of elements to be ignored
     * @return true if it is on the ignore list else false
     */
    isOnIgnoreList : function(element) {
        var result = false;

        var elementName = element.nodeName;
        var lowWord = 0;
        var highWord = this.elementsToIgnore.length - 1;
        var current = 0;

        while (lowWord <= highWord) {
            current = Math.floor((lowWord + highWord) / 2);

            if (this.elementsToIgnore[current] < elementName) {
                lowWord = current + 1;
                continue;
            }
            if (this.elementsToIgnore[current] > elementName) {
                highWord = current - 1;
                continue;
            }

            result = true;
            break;
        }

        return result;
    },

    isIgnoredByRule : function(element) {

        try {
            // Check if element or its parent is editable i.e. has the 'contenteditable' or 'g_editable' attribute set to true
            // Google sites on Firefox sometimes use only 'g_editable' (custom attribute) instead of 'contenteditable'
            var editableElements = $(element).closest("div[contenteditable='true'],div[g_editable='true'],body[contenteditable='true'],body[g_editable='true']");
            if(editableElements.length > 0) {
                Log("Skip editable element");
                return true;
            }

            // TBAR-9045: Numbers in the suggestion list on a yahoo search page get highlighted
            if(pageUrlHostName.indexOf("yahoo.") != -1) {
                var parentElem = element.parentElement;
                if(parentElem) {
                    parentElem = parentElem.parentElement;
                    if(parentElem) {
                        parentElem = parentElem.parentElement;
                        if(parentElem && parentElem.getAttribute("class") === "sa-results") {
                            Log("Ignoring element on yahoo search suggestion box");
                            return true;
                        }
                    }
                }
            }

            // TBAR-9260: Livejournal - Weird highlighting in edit mode
            if(pageUrlHostName.indexOf("livejournal.") != -1) {
                var elementsFound = $(element).closest("div.b-spelling-faketextarea");
                if(elementsFound.length > 0) {
                    Log("Ignoring element on livejournal");
                    return true;
                }
            }

            //
            // Rules that apply only to Firefox
            //
            if(getPluginName() === "FFTB") {
                // TBAR-9222: Facebook. Phone numbers are highlighted in edit field.
                if(pageUrlHostName.indexOf("facebook.") != -1) {
                    if(getDocument().body.className === "mceContentBody ") {
                        Log("Ignoring facebook in edit mode");
                        return true;
                    }
                }

                // TBAR-10221 zoho.com highlighting in new email.
                if(pageUrlHostName.indexOf("zoho.") != -1) {
                    if(getDocument().body.className === "ze_body") {
                        Log("Ignoring zoho in edit mode");
                        return true;
                    }
                }
            }
        }
        catch(e) {
            Log("Exception while trying to check ignored rules: " + e.message);
        }

        return false;
    },

    isExistingHighlighting : function(element) {
        if (!element) {
            return false;
        }
        return (element.className.indexOf("skype_c2c") != -1);
    }
}

/**
* Processes results returned by PNR
*
* @param results - JSON string containing results
*/
function processPNRResults(results) {
    LogTimestamp("Receive response from PNR service");

    Log("Processing PNR results");

    var jsonResult = JSON.parse(results);

    // Get and remove element
    var element = processedMutatedElements.getElement(jsonResult.id);

    if (jsonResult.pnrResults.length === 0) {
        Log("No phone numbers found");
        return;
    }

    Log("PNR parse results: " + results);

    // Some results might arrive after user has disabled highlighting
    // so make sure we just ignore those
    if(!highlightingEnabled) {
        Log("Ignoring parse results because highlighting is disabled");
        return;
    }

    LogTimestamp("Start highlighting");

    // Unregister mutation events while we are making
    // changes to the DOM so that they don't trigger for the changes we make
    unregisterMutationObserver();

    initHighlighting();

    // Highlight the numbers
    var highlightedNumbers;
    highlightedNumbers = doHighlighting(element, jsonResult.pnrResults);

    registerMutationObserver();

    LogTimestamp("End highlighting");

    // Send the detected numbers to the free PNR web service to find free numbers
    FPNR.findFreeNumbers(highlightedNumbers, pageUrlHostName, processFPNRResults);

    Log("Parse results processed successfully");
}

/**
* Triggered by mutation summary library when there are dynamic changes
* to the DOM and provides a summarized list of added, removed and changed
* nodes.
*
* @param summaries - List of summarized changes to the DOM
*/
function processMutations(summaries) {
    Log("Received DOM mutations");
    summaries[0].added.forEach(function(element) {
        parseContentAsync(element);
    });
}

/**
* This is a callback that is called when FPNR request is done.
*
* @param response - Array of numbers that are free
*/
function processFPNRResults(response) {
    LogTimestamp("Receive response from FPNR service");

    // FPNR might have returned an error
    if (response === null) {
        Log("FPNR service returned an error");
        return;
    }

    // Some results might arrive after user has disabled highlighting
    // so make sure we just ignore those
    if (!highlightingEnabled) {
        Log("Ignoring Free PNR results because highlighting is disabled");
        return;
    }

    Log("Free PNR response: " + response);
    var len = response.length;
    if(len === 0) {
        return;
    }

    LogTimestamp("Start FREE highlighting");

    // Unregister mutation events while we are making
    // changes to the DOM so that they don't trigger for the changes we make
    unregisterMutationObserver();

    for (var i = 0; i < len; i++) {
        SkypeClick2Call.NumberHighlightingBuilder.markAsFree('+' + response[i].number, response[i].numberType, localizedPhrases.FREE);
    }

    registerMutationObserver();

    LogTimestamp("End FREE highlighting");
}

/**
* Initialize highlighting by injecting necessary bits into the DOM
*/
function initHighlighting() {
    SkypeClick2Call.NumberHighlightingBuilder.injectPrintStyle();
    SkypeClick2Call.MenuInjectionBuilder.createInjectionElements(localizedPhrases.CALL,
                                                                 localizedPhrases.SEND_SMS,
                                                                 localizedPhrases.ADD_TO_SKYPE,
                                                                 localizedPhrases.CALL_WITH_SKYPE_CREDITS,
                                                                 localizedPhrases.FREE_VIA_SKYPE);
}

/**
* Highlights numbers found on the page
*
* @param element - DOM element where numbers were found
* @param pnrResults - Parse results from PNR
*/
function doHighlighting(element, pnrResults) {
    return SkypeClick2Call.NumberHighlightingBuilder.createInjectionElements(element, pnrResults);
}

/**
* Removes all highlighting
*/
function removeHighlighting() {
    Log("Removing any existing highlighting");

    SkypeClick2Call.NumberHighlightingBuilder.destroyPrintStyle();
    SkypeClick2Call.NumberHighlightingBuilder.destroyInjectionElements();
    SkypeClick2Call.MenuInjectionBuilder.destroyInjectionElements();
}

/**
* Function executed on a timer that processes mutated elements
*/
function processMutatedElements() {
    Log("Time to process mutated elements...");

    var startTime = performance.now();

    var element = mutatedElements.pop();

    while(element) {
        parseContent(element);

        // If we have spent more than the maximum allowed time then return
        // control back to the browser, so that the browser gets to do other work
        var currentTime = performance.now();
        if((currentTime - startTime) > MAX_MUTATION_PROCESSING_TIME) {
            Log("Relinquish control back to browser");
            break;
        }

        element = mutatedElements.pop();
    }

    if(!element) {
        Log("Cancel mutation processing timer");
        clearInterval(mutationProcessingTimer);
        mutationProcessingTimer = null;
    }
}

/**
* Asynchronously sends the HTML content of the specified element to PNR to look for phone numbers
*
* @param element - DOM element to search for phone numbers
*/
function parseContentAsync(element) {
    mutatedElements.push(element);

    if(!mutationProcessingTimer) {
        Log("Started mutation processing timer");
        mutationProcessingTimer = setInterval(processMutatedElements, MUTATION_PROCESSING_INTERVAL);
    }
}

/**
* Sends the HTML content of the specified element to PNR to look for phone numbers
*
* @param element - DOM element to search for phone numbers
*/
function parseContent(element) {
    // Check if the element is one we should ignore
    if (ElementsFilter.isOnIgnoreList(element)) {
        Log("Skip parsing ignored element " + element.nodeName);
        return;
    }

    // Skip elements with inner HTML length <= MIN_PARSE_LEN
    var htmlLen = element.innerHTML.length;
    if(htmlLen <= MIN_PARSE_LEN) {
        Log("Skip parsing element " + element.nodeName + " with inner HTML length <= MIN_PARSE_LEN");
        return;
    }

    // Truncate the HTML in case its too big
    var htmlToParse;
    if(htmlLen > MAX_PARSE_LEN) {
        Log("Truncating HTML");
        htmlToParse = element.innerHTML.substr(0, MAX_PARSE_LEN - 1);
    }
    else {
        htmlToParse = element.innerHTML;
    }

    PNR.findNumbers(processedMutatedElements.setElement(element).toString(), pageLanguage, pageUrl, htmlToParse, processPNRResults);
}

/**
* Starts tracking dynamic changes to the page (DOM)
*/
function registerMutationObserver() {
    Log("Registering mutation observer");

    // If mutation observer already exists then enable it
    if (mutationObserver) {
        if (mutationObserverActive === false) {
            mutationObserver.reconnect();
        }
    }
    else {
        // Register for DOM mutation events
        mutationObserver = new MutationSummary({
          callback: processMutations,
          queries: [{element: '*'}]
        });
    }

    mutationObserverActive = true;
}

/**
* Stops tracking dynamic changes to the page (DOM)
*/
function unregisterMutationObserver() {
    Log("Unregistering mutation observer");

    if(mutationObserver && mutationObserverActive) {
        mutationObserver.disconnect();
        mutationObserverActive = false;
    }
}

/*
* Checks if the meta tag used to disable highlighting is present
* @return true if meta tag used to disable highlighting is found else false
*/
function isOffByMetaTag() {
    // Look if the following meta tag exists within the <head> element
    // <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
    var meta = $('head').children('meta[name][content]').filter(function() {
        return ((this.name.toLowerCase() === "skype_toolbar") && (this.content.toLowerCase() === "skype_toolbar_parser_compatible"));
    });

    if (meta.length > 0) {
        Log("Highlighting disabled by meta tag");
        return true;
    }

    return false;
}

/*
* Check if this page is on a URL that is to be skipped for highlighting
* @return true if this page is to be skipped for highlighting else false
*/
function isOffByURL() {
    var skipURLs = [
                    "docs.google.",
                    ".officeapps.live.",
                    ".mail.live.",
                    "outlook.live."
                   ];

    for(var i = 0; i < skipURLs.length; i++) {
        if(pageUrlHostName.indexOf(skipURLs[i]) != -1) {
            Log("Highlighting disabled on URL " + skipURLs[i]);
            return true;
        }
    }

    return false;
}

/*
* Check if this page is to be skipped for highlighting due to a rule
* @return true if this page is to be skipped for highlighting else false
*/
function isOffByRule() {
    // Check if body is editable i.e. has the 'contenteditable' or 'g_editable' attribute set to true
    // Google sites on Firefox sometimes use only 'g_editable' (custom attribute) instead of 'contenteditable'
    if($("body[contenteditable='true'],body[g_editable='true']").length > 0) {
        Log("Highlighting disabled due to editable body");
        return true;
    }

    // TBAR-9281: Phone numbers are highlighted in edit mode for MSDN forum
    if(pageUrlHostName.indexOf("social.msdn.microsoft.") != -1) {
        var className = $("iframe", parent.document).attr('class');
        if(className === "t-content") {
            Log("Highlighting disabled on MSDN forum post edit iframe");
            return true;
        }
    }

    // TBAR-9428: Number highlighted in Outlook Web App when composing an email
    if(pageUrl.indexOf("/owa/") != -1) {
        var className = $("iframe", parent.document).attr('class');
        if(className === "w100") {
            Log("Highlighting disabled on Outlook Web Access email compose iframe");
            return true;
        }
    }
    // Number highlighted in Outlook Web App when composing an email signature
    if(pageUrl.indexOf("/ecp/") != -1) {
        var className = $("iframe", parent.document).attr('class');
        if(className === "richTextFrame") {
            Log("Highlighting disabled on Outlook Web Access signature compose iframe");
            return true;
        }
    }

    return false;
}

/*
* Check if this page is to be skipped for highlighting due to a rule
* @return true if this page is to be skipped for highlighting else false
*/
function skipHighlighting() {
    // Check if page is HTML
    if(!isHtmlPage()) {
        Log("Highlighting disabled on non-html page");
        return true;
    }

    // Check if the page has requested highlighting to be turned off
    if(isOffByMetaTag()) {
        return true;
    }

    // Check if the page is on a URL that is to be skipped for highlighting
    if(isOffByURL()) {
        return true;
    }

    // Check if this page is to be skipped for highlighting due to a custom rule
    if(isOffByRule()) {
        return true;
    }

    return false;
}

/**
* Determine the language of the web page
*/
function getPageLang()
{
    // First try to get the 'lang' attribute from the <html> node
    var pageLanguage = getDocument().documentElement.getAttribute('lang');
    if(!pageLanguage) {
        // Look for the language in the meta tag instead
        pageLanguage = $('head').children('meta[http-equiv=Content-Language]').attr("content");
        if(!pageLanguage) {
            pageLanguage = "en"; // Default language
        }
    }
    return pageLanguage;
}

/*
* Determine the host (domain) part of the URL
* @return Host name (domain) of the URL
*/
function getURLHostName() {
    var hostName = "";
    try {
        hostName = getDocument().location.hostname;
        if(!hostName) { // Can be null for locally loaded pages and sometimes iframes
            hostName = top.window.location.hostname; // Try to get parent window host name (for iframes)
            if(!hostName) {
                hostName = "";
            }
        }
    }
    catch(e) {
        Log("Exception while trying to get URL host name: " + e.message);
        hostName = "";
    }

    return hostName.toLowerCase();
}

/**
* Invoked when the background page sends us settings
*/
function processSettingsResponse(message) {
    Log("Highlighting settings have been received as: " + message.switchState);

    if(message.switchState === true && !skipHighlighting()) {
        // Highlighting is on
        highlightingEnabled = true;

        // Set the fingerprint and the dataRV endpoint for metrics reporting
        SkypeClick2Call.fingerPrint = message.fingerPrint;
        SkypeClick2Call.metricsUrl = message.metricsUrl;
        SkypeClick2Call.lookupHost = message.lookupHost;
        SkypeClick2Call.pushToMobileUrl = message.pushToMobileUrl;
        SkypeClick2Call.uiId = message.uiId;

        SkypeClick2Call.NumberHighlightingBuilder.initialize();

        // Send the page for phone number parsing to PNR
        parseContentAsync(getDocument().body);

        // Look out for dynamic changes to the page
        registerMutationObserver();
    }
    else {
        // Highlighting is off
        highlightingEnabled = false;

        // No need to track dynamic changes to the page
        unregisterMutationObserver();

        // Remove all highlighting from the page
        removeHighlighting();
    }
}

/**
* Starts our operations
*/
function main() {
    LogTimestamp("Plugin invoked");

    // Load the language specific resources
    languageforUI = loadLocalizedResources();
    Log("UI language: " + languageforUI);

    // Get the language of the page
    pageLanguage = getPageLang();
    Log("Page language: " + pageLanguage);

    // Get the URL of the page
    pageUrl = getDocument().location.href;
    Log("Page URL: " + pageUrl);

    // Get the host name (domain) part of the URL
    pageUrlHostName = getURLHostName();
    Log("Page URL host name: " + pageUrlHostName);

    // Ask the background page for our settings
    postSettingsRequest();
}

var MAX_PARSE_LEN = 2097152; // 2 MB
var MIN_PARSE_LEN = 6;
var highlightingEnabled = false;
var languageforUI = "en";
var pageLanguage = "en";
var pageUrl = "";
var pageUrlHostName = "";
var mutationObserver = null;
var mutationObserverActive = false;
var mutationProcessingTimer = null;
var mutatedElements = [];
var processedMutatedElements = new ElementsMap();

Log("Content script loaded");

main();
