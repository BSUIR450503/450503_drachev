/**
 * @file
 * @brief Number highlighting and call menu builder class.
 */

'use strict';

var C2C_SCRIPTS = ['telemetry.js', 'specificTelemetry.js', 'menu_handler.js'];

/*
first argument is template string in format 'some text {0} ... {n}'
next arguments will be inserted instead of {0} ... {n} appropriately.
Example: stringFormat('This {0} example', 'is') will return 'This is example'
*/
function stringFormat() {
    var templateString = arguments[0];
    for(var i = 1; i < arguments.length; i++) {
        templateString = templateString.replace("{" + (i-1) + "}", arguments[i]);
    }
    return templateString;
};

// Create namespace
if (!window.SkypeClick2Call) {
    window.SkypeClick2Call = {};
}

SkypeClick2Call.fingerPrint = "";
SkypeClick2Call.metricsUrl = "";
SkypeClick2Call.lookupHost = "";
SkypeClick2Call.pushToMobileUrl = "";
SkypeClick2Call.uiId = 0;

SkypeClick2Call.freeNumUI = "free_num_ui";
SkypeClick2Call.nonFreeNumUI = "non_free_num_ui";
SkypeClick2Call.escapeCharactersMap = {
                                        "&": "&amp;",
                                        "<": "&lt;",
                                        ">": "&gt;",
                                        '"': '&quot;',
                                        "'": '&#39;',
                                        "/": '&#47;'
                                      };

if (!SkypeClick2Call.NumberHighlightingBuilder) {
    SkypeClick2Call.NumberHighlightingBuilder = {};
}

SkypeClick2Call.NumberHighlightingBuilder.setStylesBasedOnUiID = function() {

        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_MAIN_CONTAINER           = "skype_c2c_menu_container notranslate";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CLICK_TO_CALL_CONTAINER  = "skype_c2c_menu_click2call";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CLICK_TO_CALL_ACTION     = "skype_c2c_menu_click2call_action";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_PUSH_TO_MOBILE_CONTAINER = "skype_c2c_menu_push_to_mobile";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_PUSH_TO_MOBILE_ACTION    = "skype_c2c_menu_push_to_mobile_action";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CLICK_TO_SMS_CONTAINER   = "skype_c2c_menu_click2sms";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CLICK_TO_SMS_ACTION      = "skype_c2c_menu_click2sms_action";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_ADD_TO_SKYPE             = "skype_c2c_menu_add2skype";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_ADD_TO_SKYPE_LINK        = "skype_c2c_menu_add2skype_text";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CALL_TOLL_INFO           = "skype_c2c_menu_toll_info";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CALL_TOLL_INFO_CREDIT    = "skype_c2c_menu_toll_callcredit";
        SkypeClick2Call.MenuInjectionBuilder.CSS_MENU_CALL_TOLL_FREE           = "skype_c2c_menu_toll_free";
}

SkypeClick2Call.NumberHighlightingBuilder.initialize = function() {
    /*
    The parameters marked with the numbers in the following line are replaced by the function format.
    {0} - Number with all formatting as in the html
    {1} - Plain number to call
    {2} - Is number free
    {3} - Number with all formatting as in the html
    {4} - Free number text
    {5} - New Free number UI id
    */

    // TBAR-10603: Keep on a single line with no spaces between tags -- any line breaks/whitespace would be rendered in elements with "whitespace: pre-wrap" (<pre> elements have this by default)
    SkypeClick2Call.NumberHighlightingBuilder.numberContainer = '<span class="skype_c2c_print_container notranslate">{0}</span><span id="skype_c2c_container" class="skype_c2c_container notranslate" dir="ltr" tabindex="-1" onmouseover="SkypeClick2Call.MenuInjectionHandler.showMenu(this, event)" onmouseout="SkypeClick2Call.MenuInjectionHandler.hideMenu(this, event)" onclick="SkypeClick2Call.MenuInjectionHandler.makeCall(this, event)" data-numbertocall="{1}" data-numbertype="paid" data-isfreecall="{2}" data-isrtl="false" data-ismobile="false"><span class="skype_c2c_highlighting_inactive_common" dir="ltr" skypeaction="skype_dropdown"><span class="skype_c2c_textarea_span" id="{5}"><img width="0" height="0" class="skype_c2c_logo_img" src="{resourceURL}call_skype_logo.png" /><span class="skype_c2c_text_span">{3}</span><span class="skype_c2c_free_text_span">{4}</span></span></span></span>';

    SkypeClick2Call.NumberHighlightingBuilder.numberContainer = SkypeClick2Call.NumberHighlightingBuilder.numberContainer.replace("{resourceURL}", resourceURL);

    this.setStylesBasedOnUiID();
}

/**
* @desc Searches and highlights numbers within a given element. It searches the given node's child nodes too
*       and stops when all matches have been found.
* @param element - Element to search
* @param searchContext - Context information used while searching
*/
SkypeClick2Call.NumberHighlightingBuilder.searchAndHighlight = function(element, searchContext) {

    var ignoreElement = false;
    if((element.nodeType == 3 /* Text node */) && (element.nodeValue.length > 0)) {

        if((element.parentElement != null) &&
            !ElementsFilter.isExistingHighlighting(element.parentElement) &&
            !ElementsFilter.isExistingHighlighting(element.parentElement.parentElement)) {

            var searchStr = element.nodeValue;
            var numberFound = false;
            var searchFromIndex = 0;

            var digitArr = ['0','1','2','3','4','5','6','7','8','9'];

            while(searchContext.currentIndex < searchContext.pnrResults.length) {

                var currentPnrResult = searchContext.pnrResults[searchContext.currentIndex];
                var numberToDisplay = currentPnrResult.numberToDisplay;

                // If HTML characters in searchStr already escaped, escape them in phone number to display
                if (numberFound) {
                    numberToDisplay = currentPnrResult.numberToDisplay.replace(/[\/]/g, function (s) {
                            return SkypeClick2Call.escapeCharactersMap[s];
                        });
                }
                var lengthNumberToDisplay = numberToDisplay.length;

                var foundIndex = searchStr.indexOf(numberToDisplay, searchFromIndex);

                if(foundIndex === -1) {
                    break;
                }

                // TBAR-9682 skip highlighting for number which has digit as next symbol
                if(digitArr.indexOf(searchStr.charAt(foundIndex + lengthNumberToDisplay)) > -1) {
                    searchFromIndex = foundIndex + lengthNumberToDisplay;
                    continue;
                }

                if(!ElementsFilter.isIgnoredByRule(element.parentElement)) {
                    var formattedNumber = stringFormat(this.numberContainer,
                                                        currentPnrResult.numberToDisplay,
                                                        currentPnrResult.numberToCall,
                                                        false,
                                                        currentPnrResult.numberToDisplay,
                                                        "",
                                                        SkypeClick2Call.nonFreeNumUI);

                    if (!numberFound) {
                        // TBAR-9863 - Escape HTML characters to avoid XSS attack (do escaping once in entire text)
                        searchStr = searchStr.replace(/[&<>"'\/]/g, function (s) {
                            return SkypeClick2Call.escapeCharactersMap[s];
                        });
                        numberToDisplay = currentPnrResult.numberToDisplay.replace(/[\/]/g, function (s) {
                            return SkypeClick2Call.escapeCharactersMap[s];
                        });
                        // Recalculate number length due to character replacement
                        lengthNumberToDisplay = numberToDisplay.length;
                        // Need to update index due to string length change
                        foundIndex = searchStr.indexOf(numberToDisplay, foundIndex);
                    }

                    numberFound = true;

                    // replace part of string at position (foundIndex, foundIndex + lengthNumberToDisplay) with formattedNumber
                    searchStr = searchStr.substring(0, foundIndex) + formattedNumber + searchStr.substring(foundIndex + lengthNumberToDisplay);

                    searchFromIndex = (foundIndex + formattedNumber.length) - lengthNumberToDisplay;

                    searchContext.highlightedNumbers.push(currentPnrResult.numberToCall);
                }
                searchContext.currentIndex = searchContext.currentIndex + 1;
            }

            if(numberFound) {
                $(element).replaceWith(searchStr);
            }

            if(searchContext.currentIndex === searchContext.pnrResults.length) {
                // Found and highlighted all the numbers, so stop searching
                searchContext.continueSearch = false;
                return searchContext.continueSearch;
            }
        }
    }
    else {
        ignoreElement = ElementsFilter.isOnIgnoreList(element);
    }

    // Search in child elements
    if(!ignoreElement) {
        $(element).contents().each(function() {
            SkypeClick2Call.NumberHighlightingBuilder.searchAndHighlight(this, searchContext);
            return searchContext.continueSearch;
        });
    }

    return searchContext.continueSearch;
}

/**
 * @desc Wrap found numbers with print container and add number highlighting to the page.
 *
 * @param element - DOM element where numbers were found
 * @param pnrResults - Parse results from PNR
 */
SkypeClick2Call.NumberHighlightingBuilder.createInjectionElements = function (element, pnrResults)
{
    try
    {
        var searchContext = new Object();
        searchContext.continueSearch = true;
        searchContext.pnrResults = pnrResults;
        searchContext.currentIndex = 0;
        searchContext.highlightedNumbers = new Array();

        $(element).contents().each(function() {
            SkypeClick2Call.NumberHighlightingBuilder.searchAndHighlight(this, searchContext);
            return searchContext.continueSearch;
        });

        return searchContext.highlightedNumbers;
    }
    catch(e)
    {
        Log("Exception in NumberHighlightingBuilder.createInjectionElements: " + e.message);
    }
}

/**
 * Mark numbers in already parsed html as "free"
 * @param number     Number to be marked as free
 * @param numberType Type of the number (paid, tollfree etc.)
 * @param freeText   Localized "FREE" text at the right of the number
 */
SkypeClick2Call.NumberHighlightingBuilder.markAsFree = function(number, numberType, freeText) {
    try {
        var textNode = $(getDocument().createTextNode(" " + freeText));
        $('span#skype_c2c_container').each(function() {
            var self = this;

            if ($(self).attr("data-numbertocall") === number) {
                // Set data-isfreecall attribute
                $(self).attr("data-isfreecall",true);

                // Set data-numbertype attribute
                $(self).attr("data-numbertype",numberType);

                $(self).find('.skype_c2c_textarea_span').attr('id', SkypeClick2Call.freeNumUI);

                // Set localized "FREE" text
                $(self).find('.skype_c2c_free_text_span').append(textNode);
            }
        });
    }
    catch (e) {
        Log("Exception in markAsFree: " + e.message);
    }
}

/**
 * Inject styles for print preview/print media types into the page
 * ("content styles" could not be used because extension is not loaded in print preview)
 */
SkypeClick2Call.NumberHighlightingBuilder.injectPrintStyle = function()
{
    try {
        if ($('CSS[data-c2c="c2c_print_container_style"]').length === 0) {
            $('head').append('<CSS data-c2c="c2c_print_container_style" media="print"  type="text/css">span.skype_c2c_print_container {} span.skype_c2c_container {display:none !important;} .skype_c2c_menu_container {display:none !important;}</CSS>');
        }
    }
    catch(e) {
        Log("Exception in SkypeClick2Call.NumberHighlightingBuilder.injectPrintStyle: " + e.message);
    }
}

/**
 * Removes styles for print print media type
 */
SkypeClick2Call.NumberHighlightingBuilder.destroyPrintStyle = function()
{
    try {
        // Remove CSS
        $('CSS[data-c2c="c2c_print_container_style"]').remove();
    }
    catch(e) {
        Log("Exception in SkypeClick2Call.NumberHighlightingBuilder.destroyPrintStyle: " + e.message);
    }
}

/**
 * Removes print and highlighting container
 */
SkypeClick2Call.NumberHighlightingBuilder.destroyInjectionElements = function()
{
    try
    {
        // Remove highlighting
        $('.skype_c2c_container').remove();
        // Unwrap print container
        $("span.skype_c2c_print_container").each(function()
        {
            $(this).replaceWith($(this).html());
        });
    }
    catch(e)
    {
        Log("Exception in NumberHighlightingBuilder.destroyInjectionElements: " + e.message);
    }
}

if (!SkypeClick2Call.MenuInjectionBuilder) {
    SkypeClick2Call.MenuInjectionBuilder = {};

    SkypeClick2Call.MenuInjectionBuilder.ID_MENU_MAIN_CONTAINER         = "skype_c2c_menu_container";
    SkypeClick2Call.MenuInjectionBuilder.ID_MENU_CLICK_TO_CALL_ACTION   = "skype_c2c_menu_click2call_action";
    SkypeClick2Call.MenuInjectionBuilder.ID_MENU_PUSH_TO_MOBILE_ACTION  = "skype_c2c_menu_push_to_mobile_action";
    SkypeClick2Call.MenuInjectionBuilder.ID_MENU_CLICK_TO_SMS_ACTION    = "skype_c2c_menu_click2sms_action";
    SkypeClick2Call.MenuInjectionBuilder.ID_MENU_ADD_TO_SKYPE_LINK      = "skype_c2c_menu_add2skype_text";
}

/**
 * Create call menu component and add it into the document body.
 *
 * @param click2CallText         text for 'Click to call' action
 * @param click2SMSText          text for 'Click to SMS' action
 * @param addToSkypeText         text for 'Add to Skype'
 * @param callWithCreditText     text for 'Call with Skype credits'
 * @param freeText               text for 'Free call'
 */
SkypeClick2Call.MenuInjectionBuilder.createInjectionElements = function(
                                                         click2CallText,
                                                         click2SMSText,
                                                         addToSkypeText,
                                                         callWithCreditText,
                                                         freeText)
{
    try
    {
        C2C_SCRIPTS.forEach(function (script) {
            if ($('script[src="' + resourceURL + script + '"]').length === 0) {
                getDocument().head.appendChild(getDocument().createElement('script')).src = resourceURL + script;
            }
        });

        if ($('#skype_c2c_menu_container').length > 0) {
            return;
        }

        // 1) Create the menu container
        var menuMainContainer = getDocument().createElement('div');
        menuMainContainer.className = this.CSS_MENU_MAIN_CONTAINER;
        menuMainContainer.id = this.ID_MENU_MAIN_CONTAINER;
        menuMainContainer.style.display = 'none';
        menuMainContainer.setAttribute('onmouseover', 'SkypeClick2Call.MenuInjectionHandler.showMenu(this, event)');
        menuMainContainer.setAttribute('onmouseout', 'SkypeClick2Call.MenuInjectionHandler.hideMenu(this, event)');
        menuMainContainer.setAttribute('data-fp', SkypeClick2Call.fingerPrint);
        menuMainContainer.setAttribute('data-murl', SkypeClick2Call.metricsUrl);
        menuMainContainer.setAttribute('data-p2murl', SkypeClick2Call.pushToMobileUrl);
        menuMainContainer.setAttribute('data-uiid', SkypeClick2Call.uiId);
        menuMainContainer.setAttribute('data-uilang', languageforUI);

        // 2) Create container for Click to Call action
        var menuClick2CallContainer = getDocument().createElement('div');
        menuClick2CallContainer.className = this.CSS_MENU_CLICK_TO_CALL_CONTAINER;

        // Append Click to call container into main container
        menuMainContainer.appendChild(menuClick2CallContainer);

        // 2a) Create Click to call action
        var menuClick2CallElement = getDocument().createElement('a');
        menuClick2CallElement.className = this.CSS_MENU_CLICK_TO_CALL_ACTION;
        menuClick2CallElement.id = this.ID_MENU_CLICK_TO_CALL_ACTION;
        menuClick2CallElement.setAttribute('target', '_self');

        // Add action text
        menuClick2CallElement.appendChild(getDocument().createTextNode(click2CallText));

        // Append into container
        menuClick2CallContainer.appendChild(menuClick2CallElement);

        // 3) Create container for Click to SMS action
        var menuClick2SMSContainer = getDocument().createElement('div');
        menuClick2SMSContainer.className = this.CSS_MENU_CLICK_TO_SMS_CONTAINER;

        // Append Click to SMS container into main container
        menuMainContainer.appendChild(menuClick2SMSContainer);

        // 3a) Create Click to SMS action
        var menuClick2SMSElement = getDocument().createElement('a');
        menuClick2SMSElement.className = this.CSS_MENU_CLICK_TO_SMS_ACTION;
        menuClick2SMSElement.id = this.ID_MENU_CLICK_TO_SMS_ACTION;
        menuClick2SMSElement.setAttribute('target', '_self');

        // Add action text
        menuClick2SMSElement.appendChild(getDocument().createTextNode(click2SMSText));

        // Append into container
        menuClick2SMSContainer.appendChild(menuClick2SMSElement);

        if(SkypeClick2Call.uiId === 1) {
            // 4) Create container for push to mobile
            var pushToMobileContainer = getDocument().createElement('div');
            pushToMobileContainer.className = this.CSS_MENU_PUSH_TO_MOBILE_CONTAINER;

            // Append push to mobile container into main container
            menuMainContainer.appendChild(pushToMobileContainer);

            // 4a) Create the push to mobile link
            var pushToMobileElement = getDocument().createElement('a');
            pushToMobileElement.className = this.CSS_MENU_PUSH_TO_MOBILE_ACTION;
            pushToMobileElement.id = this.ID_MENU_PUSH_TO_MOBILE_ACTION;
            pushToMobileElement.setAttribute('target', '_blank');

            // Add the push to mobile text
            pushToMobileElement.appendChild(getDocument().createTextNode(localizedPhrases.PUSH_TO_MOBILE));

            // Append into container
            pushToMobileContainer.appendChild(pushToMobileElement);
        }

        // 5) Create container for Add to Skype
        var menuAddToSkypeContainer = getDocument().createElement('div');
        menuAddToSkypeContainer.className = this.CSS_MENU_ADD_TO_SKYPE;

        // Append Add to Skype container into main container
        menuMainContainer.appendChild(menuAddToSkypeContainer);

        // 5a) Create the Add to Skype link
        var menuAddToSkypeElement = getDocument().createElement('a');
        menuAddToSkypeElement.className = this.CSS_MENU_ADD_TO_SKYPE_LINK;
        menuAddToSkypeElement.id = this.ID_MENU_ADD_TO_SKYPE_LINK;
        menuAddToSkypeElement.setAttribute('target', '_self');

        // Add the Add to Skype text
        menuAddToSkypeElement.appendChild(getDocument().createTextNode(addToSkypeText));

        // Append into container
        menuAddToSkypeContainer.appendChild(menuAddToSkypeElement);

        // 6) Create container for call toll status
        var menuTollInfoContainer = getDocument().createElement('div');
        menuTollInfoContainer.className = this.CSS_MENU_CALL_TOLL_INFO;

        // Append toll info container into main container
        menuMainContainer.appendChild(menuTollInfoContainer);

        // 6a) Create span elements for all possible toll status
        var menuCallCreditElement = getDocument().createElement('span');
        menuCallCreditElement.className = this.CSS_MENU_CALL_TOLL_INFO_CREDIT;

        var menuCallFreeElement = getDocument().createElement('span');
        menuCallFreeElement.className = this.CSS_MENU_CALL_TOLL_FREE;

        // Add toll info texts into respective elements
        menuCallCreditElement.appendChild(getDocument().createTextNode(callWithCreditText));
        menuCallFreeElement.appendChild(getDocument().createTextNode(freeText));

        // Append into container
        menuTollInfoContainer.appendChild(menuCallCreditElement);
        menuTollInfoContainer.appendChild(menuCallFreeElement);

        // Append menu into body
        getDocument().body.appendChild(menuMainContainer);
    }
    catch(e)
    {
        Log("Exception in MenuInjectionBuilder.createInjectionElements: " + e.message);
    }
};

/**
 * Removes call menu component
 */
SkypeClick2Call.MenuInjectionBuilder.destroyInjectionElements = function()
{
    try
    {
        // Remove menu
        $('#skype_c2c_menu_container').remove();
        // Remove scripts
        C2C_SCRIPTS.forEach(function (script) {
            $('script[src="' + resourceURL + script + '"]').remove();
        });
    }
    catch(e)
    {
        Log("Exception in MenuInjectionBuilder.destroyInjectionElements: " + e.message);
    }
};
