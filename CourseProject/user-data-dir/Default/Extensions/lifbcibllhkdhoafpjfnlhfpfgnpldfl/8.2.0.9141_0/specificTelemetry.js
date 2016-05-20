/* eslint new-cap: 0 */
'use strict';

var SkypeC2CTelemetry = SkypeC2CTelemetry ? SkypeC2CTelemetry : {};

SkypeC2CTelemetry.post = function(endpoint, eventType, isPluginSpecific, userPassedKVPs) {

    if (SkypeC2CTelemetry.disableTelemetry === false || endpoint === '') {
        return;
    }

    var packet = this.createPacket(eventType, isPluginSpecific, userPassedKVPs);

    // Callback function when the ajax response is ready
    var logAjaxResult = function() {
        /*
        console.log('Got back an ajax response');
        if (ajaxReq.readyState == 4 && ajaxReq.status == 200)
        {
            console.log('Metrics reported successfully to data RV');
        }
        */
    };

    // Stringify the json packet we created
    // Use JSON if available, if not revert to our own custom method
    var packetStr = '';
    try
    {
        packetStr = JSON.stringify(packet);
    }
    catch (e)
    {
        packetStr = this.JsonStringify(packet);
    }

    // Detect browser support for CORS
    // IE10 onwards we have support for CORS in XHR
    // Chrome and FF will continue using XHR as they support CORS too
    if (this.XHRSupportsCORS())
    {
        // Supports cross-domain requests
        var ajaxReq = new XMLHttpRequest();
        ajaxReq.onreadystatechange = logAjaxResult;

        // Set the ajax request headers
        ajaxReq.open('POST', endpoint, true);
        ajaxReq.setRequestHeader('Content-type','application/json');
        ajaxReq.send(packetStr);
    }
    // Use IE-specific 'CORS' code with XDR
    else if (this.XDRSupported())
    {
        var xdr = new XDomainRequest();
        xdr.open('POST', endpoint);

        // IE9 has a problem where the request may occasionally be aborted.
        // To prevent this, need to make sure all the handlers are defined,
        // and give some time for the object to be created before sending data
        // allow some time to prep the XDomainRequest prior to send being called
        window.setTimeout(function () {
            xdr.send(packetStr);
        }, 100);
    }
};
