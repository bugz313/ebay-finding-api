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
    client.registerMethod("xmlMethod", "http://open.api.sandbox.ebay.com/shopping?", "GET");

    var args = {
        headers : {
            "X-EBAY-API-APP-ID":"ELTSyste-e778-4948-b2a0-7e2ba87d42e2",
            "X-EBAY-API-VERSION":885,
            "X-EBAY-API-SITE-ID":0,
            "X-EBAY-API-CALL-NAME":"GetShippingCosts",
            "X-EBAY-API-REQUEST-ENCODING":"XML"
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