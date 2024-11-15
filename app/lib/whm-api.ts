import axios from 'axios';
import { WHMCredentials } from '../types/hosting';

export class WHMApi {
  private credentials: WHMCredentials;

  constructor(credentials: WHMCredentials) {
    this.credentials = credentials;
  }

  async listAccounts() {
    try {
      const response = await axios.get(`https://${this.credentials.hostname}:2087/json-api/listaccts`, {
        headers: {
          Authorization: `WHM ${this.credentials.username}:${this.credentials.authToken}`
        }
      });
      
      return response.data.acct || [];
    } catch (error) {
      console.error('Error fetching WHM accounts:', error);
      throw error;
    }
  }
}