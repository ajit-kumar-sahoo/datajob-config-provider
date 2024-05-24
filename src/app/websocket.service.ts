// import { Injectable } from '@angular/core';
// // import { WebSocketSubject } from 'ngx-websocket';
// import { Observable } from 'rxjs';
 
// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {
//   private socket$: WebSocketSubject<string>;
 
//   constructor() {
//     this.socket$ = new WebSocketSubject('ws://localhost:9092');
//   }
 
//   getMessages(): Observable<string> {
//     return this.socket$;
//   }
// }