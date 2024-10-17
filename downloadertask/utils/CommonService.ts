import tl = require("azure-pipelines-task-lib/task");
const https = require("https");
const axios = require("axios");

class CommonService {
  constructor() { }
  async doPostRequest(
    url: string,
    host: string,
    port: string,
    payload: string,
    authenticationType: string,
    cesToken: string,
    certificate: string,
    key: string,
    isPrintEnable: boolean,
    trustAllCerts: boolean
  ) {
    const options = getHttpAgent(url, host, port, authenticationType, cesToken, certificate, key, trustAllCerts);
    try {
      console.log("Starting ISPW Source Download Plugin...");
      if (isPrintEnable) {
        logRequest(url, options, payload, cesToken, "POST");
        console.log("Request logged successfully");
      }
      let res = await axios.post(url, payload, options);
      return res;
    } catch (error: any) {      
      if (error.response) {
        let errorMessage = error.response.data.message
          ? error.response.data.message
          : error.response.statusText;
        console.error("Response recieved : " + error.response.status + " " + error.response.statusText);
        tl.setResult(tl.TaskResult.Failed, errorMessage);
      } else if (error.request) {
        console.error(error.response.data.message);
        tl.setResult(tl.TaskResult.Failed, error.request);
      } else {
        console.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
      }
      return error;
    }
  }
  async doGetRequest(
    url: string,
    host: string,
    port: string,
    authenticationType: string,
    cesToken: string,
    certificate: string,
    key: string,
    isPrintEnable: boolean,
    trustAllCerts: boolean
  ) {
    const options = getHttpAgent(url, host, port, authenticationType, cesToken, certificate, key, trustAllCerts);
    try {
      console.log("Starting ISPW Source Download Plugin...");
      if (isPrintEnable) {
        logRequest(url, options, "", cesToken, "GET");
      }
      let res = await axios.get(url, options);
      if (isPrintEnable) {
        logResponse(res.data);
      }
      return res.data;
    } catch (error) {
      console.log("Error :", error);
      tl.setResult(
        tl.TaskResult.Failed,
        "An error may have occurred. Please see task logs."
      );
    }
  }
}

function logRequest(
  url: string,
  header: any,
  body: string,
  token: string,
  methodType: string
) {
  console.log(methodType + " " + url + " HTTP/1.1");
  console.log("Content-type: " + "application/json");
  console.log("Authorization: " + token);
  console.log("Request Body: " + JSON.stringify(body));
  if(token) {
    console.log("Header: " + JSON.stringify(header));
  }
}

function logResponse(response: string) {
  console.log("Response: " + JSON.stringify(response));
}

function getHttpAgent(url: string,
  host: string,
  port: string,
  authenticationType: string,
  cesToken: string,
  certificate: string,
  key: string,
  trustAllCerts: boolean) {
    const urlObj = new URL(url);
    let options = undefined;
    let headers = undefined;
    if(urlObj.protocol == 'https:') {
      const agent = new https.Agent({
        pfx: Buffer.from(key, "base64"),
        rejectUnauthorized: !trustAllCerts // this is added to allow/disallow self-signed certificates
      });
      if(authenticationType == 'CERT') {
        headers = { "Content-Type": "application/json", "cpwr_hci_host": host, "cpwr_hci_port": port, "javax.servlet.request.X509Certificate": certificate };
      } else {
        headers = { "Content-Type": "application/json", Authorization: cesToken };
      }
      options = {
          headers : headers,
          httpsAgent: agent,
          responseType: 'stream'
        }
    } else if(urlObj.protocol == 'http:') {
      options = {
        headers : { "Content-Type": "application/json", Authorization: cesToken },
        responseType: 'stream'
      }
    }
    return options;
}

module.exports = CommonService;
