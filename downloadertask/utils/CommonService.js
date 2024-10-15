"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const https = require("https");
const axios = require("axios");
class CommonService {
    constructor() { }
    doPostRequest(url, host, port, payload, authenticationType, cesToken, certificate, key, isPrintEnable, trustAllCerts) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = getHttpAgent(url, host, port, authenticationType, cesToken, certificate, key, trustAllCerts);
            try {
                console.log("Starting ISPW Source Download Plugin...");
                if (isPrintEnable) {
                    logRequest(url, options, payload, cesToken, "POST");
                    console.log("Request logged successfuly");
                }
                let res = yield axios.post(url, payload, options);
                return res;
            }
            catch (error) {
                console.error("Error : ");
                if (error.response) {
                    let errorMessage = error.response.data.message
                        ? error.response.data.message
                        : error.response.data;
                    console.error(errorMessage);
                    tl.setResult(tl.TaskResult.Failed, errorMessage);
                }
                else if (error.request) {
                    console.error(error.response.data.message);
                    tl.setResult(tl.TaskResult.Failed, error.request);
                }
                else {
                    console.error("Status Code : " + error.response.data.statusCode);
                    console.error("Status Message : " + error.response.data.statusMessage);
                    tl.setResult(tl.TaskResult.Failed, error.response.data.statusMessage);
                }
                return error;
            }
        });
    }
    doGetRequest(url, host, port, authenticationType, cesToken, certificate, key, isPrintEnable, trustAllCerts) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = getHttpAgent(url, host, port, authenticationType, cesToken, certificate, key, trustAllCerts);
            try {
                console.log("Starting ISPW Source Download Plugin...");
                if (isPrintEnable) {
                    logRequest(url, options, "", cesToken, "GET");
                }
                let res = yield axios.get(url, options);
                if (isPrintEnable) {
                    logResponse(res.data);
                }
                return res.data;
            }
            catch (error) {
                console.log("Error :", error);
                tl.setResult(tl.TaskResult.Failed, "An error may have occurred. Please see task logs.");
            }
        });
    }
}
function logRequest(url, header, body, token, methodType) {
    console.log(methodType + " " + url + " HTTP/1.1");
    console.log("Content-type: " + "application/json");
    console.log("Authorization: " + token);
    console.log("Request Body: " + JSON.stringify(body));
    if (token) {
        console.log("Header: " + JSON.stringify(header));
    }
}
function logResponse(response) {
    console.log("response: " + JSON.stringify(response));
}
function getHttpAgent(url, host, port, authenticationType, cesToken, certificate, key, trustAllCerts) {
    const urlObj = new URL(url);
    let options = undefined;
    let headers = undefined;
    if (urlObj.protocol == 'https:') {
        const agent = new https.Agent({
            pfx: Buffer.from(key, "base64"),
            rejectUnauthorized: !trustAllCerts // this is added to allow/disallow self-signed certificates
        });
        if (authenticationType == 'CERT') {
            headers = { "Content-Type": "application/json", "cpwr_hci_host": host, "cpwr_hci_port": port, "javax.servlet.request.X509Certificate": certificate };
        }
        else {
            headers = { "Content-Type": "application/json", Authorization: cesToken };
        }
        options = {
            headers: headers,
            httpsAgent: agent,
            responseType: 'stream'
        };
    }
    else if (urlObj.protocol == 'http:') {
        options = {
            headers: { "Content-Type": "application/json", Authorization: cesToken },
            responseType: 'stream'
        };
    }
    return options;
}
module.exports = CommonService;
