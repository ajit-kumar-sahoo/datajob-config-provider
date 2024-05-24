// import { Component, OnInit } from '@angular/core';
// import { WebsocketService } from '../websocket.service';

// @Component({
//   selector: 'app-consumer',
//   standalone: true,
//   imports: [],
//   templateUrl: './consumer.component.html',
//   styleUrl: './consumer.component.scss'
// })
// export class ConsumerComponent {
//   kafkaData: string[] = [];
 
//   constructor(private websocketService: WebsocketService) {}
 
//   ngOnInit(): void {
//     this.websocketService.getMessages().subscribe(message => {
//       this.kafkaData.push(message);
//     });
//   }
// }
