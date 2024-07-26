import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  // setup the socket connection
  setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });
  }

  // listen to code edits from the server
  getEditorUpdates(): Observable<any> {
    return this.socket.fromEvent('editor-updates');
  }

  // send code edits to the server
  sendEditorUpdates(data: any) {
    this.socket.emit('editor-updates', data);
  }
}
