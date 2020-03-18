'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');

exports.smsWebhook = functions.https.onRequest(async (req, res) => {
  console.log('SMS received from gateway', res);
  const smsBody = req.body
  try {
    await postToDhis2(smsBody);
    return res.end();
  } catch(error) {
    console.error(error);
    return res.status(500).send('Something went wrong while posting the sms to dhis2');
  } 
});

function postToDhis2(smsClickatellBody){
  var today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const auth = "Basic " + new Buffer("android:Android123").toString("base64");

  return rp({
    method: 'POST',
    uri: 'https://play.dhis2.org/android-current/api/sms/inbound',
    headers: {
      "Authorization" : auth
    },
    body: {
      text: smsClickatellBody.event.moText[0].content,
      originator: smsClickatellBody.event.moText[0].from,
      gatewayid: 'UNKNOWN',
      receiveddate: date,
      sentdate: date,
      smsenconding: '1'
    },
    json: true,
  });
}
