import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  setupSocketConnection() {
    this.socket.on('connect', () => {
    });
  }

  getEditorUpdates(): Observable<any> {
    return this.socket.fromEvent('editor-updates');
  }

  sendEditorUpdates(data: any) {
    this.socket.emit('editor-updates', data);
  }
}
