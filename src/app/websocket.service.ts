import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject: Subject<any> = new Subject<any>();
 
  constructor() {
    this.connect();
  }

  connect(): void {
    this.socket = new WebSocket('ws://localhost:9092');
    this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageSubject.next(data);
    }

    this.socket.onerror = (error) => {
        console.error('WebSocket error', error);
    };

    this.socket.onclose = () => {
        console.log('WebSocket connection closed');
    }
  }
 
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}