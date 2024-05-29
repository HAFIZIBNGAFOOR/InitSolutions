import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io"
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) {}

  joinRoom(room: string) {
    this.socket.emit('join', room);
  }

  sendMessage(room: string, message: string) {
    this.socket.emit('message', { room, message });
  }

  sendFile(room: string, file: any) {
    this.socket.emit('file', { room, file });
  }

  getMessages(): Observable<{ room: string, message: string }> {
    return this.socket.fromEvent<{ room: string, message: string }>('message');
  }

  getFiles(): Observable<{ room: string, file: any }> {
    return this.socket.fromEvent<{ room: string, file: any }>('file');
  }
}
