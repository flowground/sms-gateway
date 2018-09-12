'use strict';

const Q = require('q');
const request = require('request-promise');
const parseXML = require('xml2js').parseString;
const messages = require('elasticio-node').messages;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 * @param snapshot - snapshot that stores the data between the runs
 */

function processAction(msg, cfg) {
    const self = this;
    const inMemory = process.memoryUsage();
    if (process.debug || cfg.debug) {
        console.log(`CFG: ${JSON.stringify(cfg)}`);
        console.log(`MSG: ${JSON.stringify(msg)}`);
        console.log(`ENV: ${JSON.stringify(process.env)}`);
    }

    function getData() {
        console.log('enter sendSMS');
        const AppId = process.env.AppId || cfg.AppId;
        const AppSec = process.env.AppSec || cfg.AppSec;
        const PmiKey = process.env.PmiKey || cfg.pmiKey;
        const GuId = process.env.GuId || cfg.guid;
        const SMSUri = process.env.SMSUri || cfg.SMSUri;

        const Msisdn = msg.body.msisdn;
        const SMSMsg = new Buffer(msg.body.text).toString('base64');

        console.log(`Msisdn=${Msisdn}`);
        console.log(`guid=${GuId}`);
        console.log(`pmiKey=${PmiKey}`)
        console.log(`Text=${msg.body.text}`);
        console.log(`Msg=${SMSMsg}`);

        const soapMsg = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tom="http://planb.de/TOMessage" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">

<soapenv:Body>
    <tom:sendMessage soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <appid xsi:type="xsd:string">${AppId}</appid>
        <appsec xsi:type="xsd:string">${AppSec}</appsec>
        <accounting_data xsi:type="tom:AccountingData" 
            xmlns:tom="http://planb.de/TOMessage-Schema">
            <pmi_key xsi:type="xsd:string">${PmiKey}</pmi_key>
            <guid xsi:type="xsd:string">${GuId}</guid>
            <eventdescription xsi:type="xsd:string">SMS-GW</eventdescription>
        </accounting_data>
        <message_data xsi:type="tom:MessageData" 
            xmlns:tom="http://planb.de/TOMessage-Schema">
            <msisdn xsi:type="xsd:string">${Msisdn}</msisdn>
            <!--Zero or more repetitions:-->
            <item xsi:type="xsd:string">1</item>
            <content_type xsi:type="xsd:string">x-sms-text/int-platt</content_type>
            <content_data xsi:type="xsd:base64Binary">${SMSMsg}</content_data>
        </message_data>
    </tom:sendMessage>
</soapenv:Body>
</soapenv:Envelope>`;

        const requestOptions = {
            uri: SMSUri,
            headers: {
                'Content-Type': 'application/soap+xml',
            },
            body: soapMsg,
            json: false,
        };

        return new Promise((resolve, reject) => {
            request.post(requestOptions)
                .then((body) => {
                    parseXML(body, function resultParse(err, result) {
                        if (err) {
                            console.log(`sendSMS::parseResponse::error: ${err}`);
                            throw err;
                        } else {
                            let returnCode;
                            let smrResult0;
                            try {
                                const envelope = result['soap:Envelope'];
                                const bodyL = envelope['soap:Body'];
                                const body0 = bodyL[0];
                                const smrL = body0.sendMessageResponse;
                                const smr0 = smrL[0];
                                const smrResultL = smr0.result;
                                smrResult0 = smrResultL[0];
                                const returnCodeL = smrResult0.returncode;
                                const returnCode0 = returnCodeL[0];
                                returnCode = returnCode0._;
                            } catch (errTraverse) {
                                console.error(`error: Auswertung Response: ${errTraverse}`);
                                return reject(errTraverse);
                            }

                            console.log(`returncode ist ${returnCode}`);
                            console.log(JSON.stringify(smrResult0));

                            return resolve(smrResult0);
                        }
                    });
                })
                .catch(err => reject(err));
        });
    }

    function emitData(data) {
        self.emit('data', messages.newMessageWithBody({ sendSMSResponse: data }));
    }
    function emitError(err) {
        console.error(`error: ${err}`);
        self.emit('error', err);
    }
    function emitEnd() {
        self.emit('end');
        console.log(JSON.stringify({ inMemory_: inMemory }));
        console.log(JSON.stringify({ outMemory: process.memoryUsage() }));
    }

    Q().then(getData)
        .then(emitData)
        .fail(emitError)
        .done(emitEnd);
}

exports.process = processAction;
