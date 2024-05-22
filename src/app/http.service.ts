import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private domain = 'http://localhost:8080'; // FIXME: Add correct url domain
  private options: any = {
    responseType: "text",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  constructor(private httpClient: HttpClient) { }

  post(endpoint: String, data: any) {
    return this.httpClient.post(this.domain + endpoint, data, this.options);
  }

  get(endpoint: String) {
    return this.httpClient.get(this.domain + endpoint, this.options);
  }
}
