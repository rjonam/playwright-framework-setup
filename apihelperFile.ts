import { request, expect, APIResponse } from '@playwright/test';

public doCreateSessionAPICall = async (data: any, reqBody: string) => {
    try {
      const base64Credentials = await this.encodeBasicAuth(username, password);
      console.log('Authorization: ', base64Credentials);
      const url = ``;
      const headers = {
        Authorization: `${base64Credentials}`,
        'Content-Type': 'application/json',
      };

      // Use request.newContext() to create an API request context
      const apiContext = await request.newContext();

      // Use the fetch method for making API call
      const response: APIResponse = await apiContext.fetch(url, {
        method: 'POST',
        headers,
        data: reqBody,
      });
      console.log('Session creation API response: ', await response.json());
      return await response.json();
    } catch (e) {
      throw new Error(`Error doing Session creation API call: ${e.message}`);
    }
  };

  public encodeBasicAuth = async (username: string, password: string, type: string) => {
    const credentials = `${type}.${username}:${password}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');
    return `Basic ${base64Credentials}`;
  };
