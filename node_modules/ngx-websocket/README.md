# Ngx-Websocket
> a simple websocket connection manager for angular4+

## WARNING

<h3 style="color: red">This package is extreamly unstable and will be overwrited occasionally.</h3>

## How To Install
```shell
npm install ngx-websocket --save
```
***

## How To Use
1. import NgxWebSocketModule
```typescript
import { NgxWebSocketModule } from "ngx-websocket";
```

2. build connection
```typescript
//test-component.ts
import { Socket, NgxWebsocketService } from "ngx-websocket";

export class TestComponent {
    constructor(
        private socketSer: NgxWebsocektService;
        private socket: Socket
    ) {}

    open(): void {
        service.open("ws://echo.websocket.org")
            .then((d, socket) => socket.send("hi"))
                .message(d => d + " siri").then(d => console.log(d));
    }
}
```

***
## TODO
1. error or close catch handler
2. finally handler