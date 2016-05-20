'use strict';

// Create namespace
if (!window.FPNR) {
    window.FPNR = {};
}

/**
* Removes duplicate numbers from the array and removes the plus from the
* numbers because the Free PNR web service needs numbers without the plus.
* @param numbers - Array of numbers modify
*/
FPNR.removeDuplicatesAndPlus = function(numbers) {
    
    var result = {};
    numbers.sort().reverse();
    // Drop duplicates
    result.uniqueNumbers = numbers.filter(function(elem, pos, self) {
        return self.indexOf(elem) == pos;
    });
    // Remove leading "+"
    result.uniqueNumbers = result.uniqueNumbers.map(function(elem) {
        return elem.substr(1);
    });
    return result;
}

/**
* Fills json request object for to FPNR service
* @param requestData - Needed request data
* @return filled request ibject
*/
FPNR.generateRequest = function(requestData) {
    var request = {
        "fp": SkypeClick2Call.fingerPrint,
        "l" : languageforUI,
        "v" : getPluginName() + "/" + getProductVersion(),
        "dn": requestData.pageFqdn,
        "uiid": SkypeClick2Call.uiId.toString(),
        "q" : {
            "phone_numbers" : requestData.uniqueNumbers
        }
    }
    return JSON.stringify(request);
}

/**
* Finds free phone numbers by querying the Free PNR web service.
* On failure it calls the callback with an empty array as the request and -1 as response.
* On success it calls the callback with the array of numbers sent to FPNR and the response from the FPNR server.
* @param numbers - Array of numbers to check
* @param pageFqdn - Domain name for page asking
* @param callbackForFPNRResponse - Callback function to be called with the FPNR response
*/
FPNR.findFreeNumbers = function(numbers, pageFqdn, callbackForFPNRResponse) {
    Log("Find free numbers: " + numbers);

    if(numbers.length === 0) {
        return;
    }
    
    // Remove duplicate numbers and strip the numbers of the + sign because the Free PNR web service needs it that way
    var requestData = FPNR.removeDuplicatesAndPlus(numbers);
    requestData.pageFqdn = pageFqdn;
    if(requestData.pageFqdn.length === 0) {
        requestData.pageFqdn = "unknown";
    }
    requestData.callbackForFPNRResponse = callbackForFPNRResponse;

    // Callback function when the AJAX response is ready
    requestData.processFPNRResponse = function(response) {
        if (!response || !response.r || !response.r.phone_numbers) {
            requestData.callbackForFPNRResponse(null);
            return;
        }
        var freeNumbers = [];
        for (var number in response.r.phone_numbers) {
            var numberData = response.r.phone_numbers[number];
            if (numberData.f) {
                var freeNumberData = {"number": number, "numberType": numberData.pt};
                freeNumbers.push(freeNumberData);
            }
        }
        requestData.callbackForFPNRResponse(freeNumbers);
    }
    LogTimestamp("Send request to FPNR service");

    var lookupURL = "https://" + SkypeClick2Call.lookupHost + "/api/v2/directory";
    $.ajax({
        type: "POST",
        dataType: "json",
        url: lookupURL,
        contentType: "application/json",
        jsonp: false,
        data: FPNR.generateRequest(requestData),
        success: requestData.processFPNRResponse,
        error: function (a, b, c) {
            requestData.processFPNRResponse(null);
        }
    });

    Log("Free PNR request sent");
}
