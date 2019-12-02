

const request = require('request');

/*
 * A class for interacting with LinkedIn through the exposed REST API.
 * The functionality exposed by this class is based on the LinkedIn documentation online
 * taken from the following site: https://developer.linkedin.com/docs/guide/v2
 */
module.exports = class LinkedInRestClient {
  /**
   * Class constructor
   *
   * @param clientId
   * @param clientSecret
   * @param redirectUri
   * @param apiHost
   * @param api_resource
   * @param oauthUrl
   */
  constructor(clientId, clientSecret, redirectUri, apiHost = 'https://api.linkedin.com', apiResource = '/v2', oauthUrl = 'https://www.linkedin.com/oauth/v2') {
    this.url = apiHost + apiResource;
    this.oauthUrl = oauthUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;

    if (!this.clientId) {throw new Error('Missing "clientId" during initialization!');}
    if (!this.clientSecret) {throw new Error('Missing "clientSecret" during initialization!');}
    if (!this.redirectUri) {throw new Error('Missing "redirectUri" during initialization!');}
  }


  /**
	 * Retrieve current member's email
	 *
	 * @param accessToken
	 * @returns {Promise<Object>}
	 */
  async getCurrentMemberEmail(accessToken) {
    if (!accessToken) {throw new Error('Access code cannot be empty');}
    const url = `${this.url}/emailAddress?q=members&projection=(elements*(handle~))`;
    return this.invoke('GET', url, undefined, undefined, { withAuth: true, accessToken });
  }

  async requestProfile(accessToken) {
    return this.invoke('GET', 'https://api.linkedin.com/v2/me', undefined, undefined, { withAuth: true, accessToken });
  }

  /**
   * Get authorization URL
   *
   * @param scope
   * @param state
   * @returns {string}
   */
  getAuthorizationUrl(scope, state) {
    if (!Array.isArray(scope)) {throw new Error('Scope must be an array');}
    const scopeString = encodeURIComponent(scope.join(','));
    const stateString = encodeURIComponent(state);
    const redirectUri = encodeURIComponent(this.redirectUri);
    return `${this.oauthUrl}/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${redirectUri}&state=${stateString}&scope=${scopeString}`;
  }

  /**
   * Get access token: https://developer.linkedin.com/docs/oauth2
   *
   * @param code
   * @param state
   * @returns {Promise<Object>}
   */
  async getAccessToken(code, state) {
    if (!code) {throw new Error('Code parameter cannot be empty');}
    const url = `${this.oauthUrl}/accessToken?grant_type=authorization_code&code=${code}&state=${state}&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
    return this.invoke('POST', url, { 'content-type': 'application/x-www-form-urlencoded' });
  }

  /**
   * Invokes the given rest URL endpoint with the given body and headers
   *
   * @param {string} method - The HTTP verb (i.e. GET/POST)
   * @param {string} url - The uri endpoint for the HTTP service
   * @param {object} headers - The HTTP headers (i.e. {'random-header-name': 'random-header-value', 'content-type': 'application/json'})
   * @param {object} body - The JSON data to POST if applicable, or null
   * @param {object} auth - An object to pass to make a call which requires authorization, example { withAuth: true, accessToken: 'accessToken' }
   *
   * @returns {object} The body of the HTTP response
   */
  invoke(method, url, headers = { 'Content-Type': 'Application/json' }, body = {}, auth = { withAuth: false, accessToken: null }) {
    return new Promise((resolve, reject) => {
      let options;
      try {
        options = this.generateOptions(method, url, headers, body, auth);
      } catch (err) {
        return reject(err);
      }
      request(options, (error, response, bodyData) => {
        if (error) {return reject(error);}
        if (response.statusCode === 404) {return resolve(null);}
        if (response.statusCode !== 200 && response.statusCode !== 201) {return reject(new Error(response.statusCode + ' ' + response.statusMessage + ': ' + JSON.stringify(body)));}
        try {
          const data = JSON.parse(bodyData);
          return resolve(data);
        } catch (err) {
          return reject(err);
        }
      });
      return null;
    });
  }

  /**
   * Generates the required options for invoking HTTP/HTTPS requests
   *
   * @param {string} method - The HTTP verb (i.e. GET/POST)
   * @param {string} url - The uri endpoint for the HTTP service
   * @param {object} headers - The HTTP headers (i.e. {'random-header-name': 'random-header-value', 'content-type': 'application/json'})
   * @param {object} body - The JSON data to POST if applicable, or null
   * @param {object} auth - An object to pass to make a call which required authorization, example { withAuth: true, accessToken: 'accessToken' }
   *
   * @returns {object} The HttpOptions JSON object
   */
  generateOptions(method, url, headers, body, auth) {
    headers['X-Restli-Protocol-Version'] = '2.0.0';
    if (auth.withAuth) {
      if (!auth.accessToken) {throw new Error('Missing required "access_token" in the auth body');}
      headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    const options = { url, method, headers };
    if (body) {options.body = JSON.stringify(body);}
    return options;
  }
};
