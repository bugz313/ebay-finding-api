/**
 * Node.js eBay Finding API client
 * https://github.com/bogdanlungu/node-finding-ebay-api
 *
 * Based on Demchig, Batchuluun node-ebay-trading-api module
 */

 (function() {

    var Client = require('node-rest-client').Client;
    var xml2js = require('xml2js');
    var fs = require('fs');
    var util = require("util");

    client = new Client();

    // registering remote methods
   client.registerMethod("xmlMethod", "http://svcs.sandbox.ebay.com/services/search/FindingService/v1", "POST");

    var args = {
        headers : {
            "X-EBAY-SOA-SERVICE-NAME" : "FindingService",
            "X-EBAY-SOA-OPERATION-NAME" : "getHistograms",
            "X-EBAY-SOA-SERVICE-VERSION" : "1.0.0",
            "X-EBAY-SOA-GLOBAL-ID" : "EBAY-US",
            "X-EBAY-SOA-SECURITY-APPNAME": "ELTSyste-3751-4ae1-8086-c73cd023c970",
            "X-EBAY-SOA-REQUEST-DATA-FORMAT": "XML"
        },
        data : ''
    };



    exports.call = function(callName, jsonObj, callback){        

        // args.headers["X-EBAY-API-CALL-NAME"] = callName;
        args.data = buildXmlData(callName, jsonObj);

        client.methods.xmlMethod(args, function(data,response){

            xml2js.parseString(data, function(err, result){
                callback(result);
            });
            
        });


    };


    /* ----------------------------------------------------------------
     * functions
     ----------------------------------------------------------------*/
     function buildXmlData(callName, jsonObj)
     {
        var builder = new xml2js.Builder({ headless : true });
        var xmlStr = builder.buildObject(jsonObj);

        xmlStr = xmlStr.replace('<root>', '');
        xmlStr = xmlStr.replace('</root>', '');

        var xmlData = '<?xml version="1.0" encoding="utf-8"?>'
        + '<' + callName + 'Request xmlns="urn:ebay:apis:eBLBaseComponents">'
        + xmlStr
        + ' </' + callName + 'Request>';
        console.log(xmlData);
        return xmlData;
    }

    
    function inspect(value)
    {
        console.log(util.inspect(value, false, null));
    }

}).call(this);