'use strict';

// Create namespace
if (!window.PNR) {
    window.PNR = {};
}

/**
* Finds phone numbers in a give piece of HTML and calls the specified callback function
* with the results.
*
* @param id - A string identifier that will be returned with the response
* @param languages - List of languages to consider
* @param url - URL of the page
* @param html - HTML to parse
* @param callbackForPNRResponse - Callback function to invoke when results are ready
*/
PNR.findNumbers = function(id, languages, url, html, callbackForPNRResponse) {
    Log("Sending PNR parse request...");

    var pnrReqObj = new Object();
    pnrReqObj.callbackForPNRResponse = callbackForPNRResponse;
    pnrReqObj.id = id;

    // Callback function for when the AJAX response is ready
    pnrReqObj.processPNRResponse = function(response) {
        if ( response === '-1' ) {
            Log("PNR parse request failed!");
            pnrReqObj.callbackForPNRResponse('{"id":"' + pnrReqObj.id + '", "pnrResults" : []}');
        } else {
            pnrReqObj.callbackForPNRResponse(response);
        }
    }

    var requestObj = new Object();
    requestObj.id = id;
    requestObj.languages = languages;
    requestObj.url = url;
    requestObj.text = html;

    LogTimestamp("Send request to PNR service");

    $.ajax({
        type: "POST",
        dataType: "text",
        url: "https://localhost:26143/skypectoc/v1/pnr/parse",
        contentType: "application/json",
        jsonp: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Pragma', 'no-cache');
        },
        data: JSON.stringify(requestObj),
        success: pnrReqObj.processPNRResponse,
        error: function (xhr, ajaxOptions, thrownError) { pnrReqObj.processPNRResponse('-1');  }
    });

    Log("PNR parse request has been sent");
}
