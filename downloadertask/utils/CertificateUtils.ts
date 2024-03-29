import tl = require("azure-pipelines-task-lib/task");
const Authenticate = require("../transferObj/Authenticate");
const axios = require("axios");

class CertificateUtils {
  async getCertificate(authenticationType: string, connectedService: string, keyvaultName: string, certificateName: string): Promise<Authenticate> {
    let certContent: string | undefined = undefined;
    let cesToken: string | undefined = undefined;
    let certKey: string | undefined = undefined;
    var azureKeyVaultDnsSuffix = tl.getEndpointDataParameter(connectedService, "AzureKeyVaultDnsSuffix", true);
    if (!azureKeyVaultDnsSuffix) {
      azureKeyVaultDnsSuffix = "vault.azure.net"
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
    await axios.post(oauthUrl, params, tokenOptions).then(async function (responseFromAzure: { status: number; data: { access_token: any; }; }) {
      if (responseFromAzure.status == 200) {
        const secretsURL = `https://${keyvaultName}.${azureKeyVaultDnsSuffix}/secrets/${certificateName}?api-version=7.4`;
        const options = {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${responseFromAzure.data.access_token}` }
        };
        // get certificate as PKCS from azure key vault
        await axios.get(secretsURL, options).then(async function (response: any) {
          if (response && response.status == 200 && response.data.value) {
            certKey = response.data.value;
            if (authenticationType == 'CERT') {
              const url = `https://${keyvaultName}.${azureKeyVaultDnsSuffix}/certificates/${certificateName}/latest?api-version=7.4`;
              await axios.get(url, options).then(function (response: any) {
                if (response.status == 200) {
                  certContent = response.data.cer;
                } else {
                  throw new Error('Error occured while fetching certificate from Key Vault.' + response.status + ' ' + response.statusCode + ' ' + response.statusText);
                }
              }).catch(function (error: Error) {
                throw new Error('Error occured while fetching certificate from Key Vault.' + error.message);
              });
            } else if (authenticationType == 'TOKEN') {
              cesToken = tl.getInput("cesSecretToken");
            }
          }
          else {
            throw new Error('Failed to download certificate as PKCS from key Vault.' + response.status + response.statusText);
          }
        })
          .catch(function (error: any) {
            throw new Error('Failed to download certificate as PKCS from key Vault.' + error.message);
          });
      } else {
        throw new Error('Error occurred while fetching bearer token from Azure : ' + oauthUrl);
      }
    }).catch(function (error: Error) {
      throw new Error('Error occurred while fetching bearer token from Azure : ' + error.message);
    });
    return new Authenticate(certKey, certContent, cesToken);
  }
}

module.exports = CertificateUtils;