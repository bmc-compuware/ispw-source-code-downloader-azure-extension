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
const Authenticate = require("../transferObj/Authenticate");
const axios = require("axios");
class CertificateUtils {
    getCertificate(authenticationType, connectedService, keyvaultName, certificateName) {
        return __awaiter(this, void 0, void 0, function* () {
            let certContent = undefined;
            let cesToken = undefined;
            let certKey = undefined;
            var azureKeyVaultDnsSuffix = tl.getEndpointDataParameter(connectedService, "AzureKeyVaultDnsSuffix", true);
            if (!azureKeyVaultDnsSuffix) {
                azureKeyVaultDnsSuffix = "vault.azure.net";
            }
            const servicePrincipalId = tl.getEndpointAuthorizationParameter(connectedService, 'serviceprincipalid', true);
            const servicePrincipalKey = tl.getEndpointAuthorizationParameter(connectedService, 'serviceprincipalkey', true);
            const tenantId = tl.getEndpointAuthorizationParameter(connectedService, 'tenantId', true);
            const oauthUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
            const params = new URLSearchParams();
            params.append('client_id', `${servicePrincipalId}`);
            params.append('client_secret', `${servicePrincipalKey}`);
            params.append('grant_type', 'client_credentials');
            params.append('scope', `https://${azureKeyVaultDnsSuffix}/.default`);
            const tokenOptions = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            //get bearer token from Azure
            yield axios.post(oauthUrl, params, tokenOptions).then(function (responseFromAzure) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (responseFromAzure.status == 200) {
                        const secretsURL = `https://${keyvaultName}.${azureKeyVaultDnsSuffix}/secrets/${certificateName}?api-version=7.4`;
                        const options = {
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${responseFromAzure.data.access_token}` }
                        };
                        // get certificate as PKCS from azure key vault
                        yield axios.get(secretsURL, options).then(function (response) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (response && response.status == 200 && response.data.value) {
                                    certKey = response.data.value;
                                    if (authenticationType == 'CERT') {
                                        const url = `https://${keyvaultName}.${azureKeyVaultDnsSuffix}/certificates/${certificateName}/latest?api-version=7.4`;
                                        yield axios.get(url, options).then(function (response) {
                                            if (response.status == 200) {
                                                certContent = response.data.cer;
                                            }
                                            else {
                                                throw new Error('Error occured while fetching certificate from Key Vault.' + response.status + ' ' + response.statusCode + ' ' + response.statusText);
                                            }
                                        }).catch(function (error) {
                                            throw new Error('Error occured while fetching certificate from Key Vault.' + error.message);
                                        });
                                    }
                                    else if (authenticationType == 'TOKEN') {
                                        cesToken = tl.getInput("cesSecretToken");
                                    }
                                }
                                else {
                                    throw new Error('Failed to download certificate as PKCS from key Vault.' + response.status + response.statusText);
                                }
                            });
                        })
                            .catch(function (error) {
                            throw new Error('Failed to download certificate as PKCS from key Vault.' + error.message);
                        });
                    }
                    else {
                        throw new Error('Error occurred while fetching bearer token from Azure : ' + oauthUrl);
                    }
                });
            }).catch(function (error) {
                throw new Error('Error occurred while fetching bearer token from Azure : ' + error.message);
            });
            return new Authenticate(certKey, certContent, cesToken);
        });
    }
}
module.exports = CertificateUtils;
