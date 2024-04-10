import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../config';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  apiKey: string;
  webSocket: WebSocket;
  messageReceived: Subject<string> = new Subject<string>();
  messageSentSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.apiKey = AppConfig.apiKey;
  }

  connect(): void {
    const brokerURL = "wss://supsi-ticket.cloudns.org/supsi-chat/supsi-chat-websocket";
    this.webSocket = new WebSocket(brokerURL);

    this.webSocket.onopen = () => {
      console.log('WebSocket connection established.');
      this.subscribeToEvents();
    };

    this.webSocket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      this.messageReceived.next(message);
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private subscribeToEvents(): void {
    // Subscribe to new message event
    this.webSocket.send(JSON.stringify({
      type: 'subscribe',
      destination: `/app/${this.apiKey}/new-message`
    }));
    // Subscribe to update message event
    this.webSocket.send(JSON.stringify({
      type: 'subscribe',
      destination: `/app/${this.apiKey}/update-message`
    }));
  }

  sendMessage(messageType: string, message: string): void {
    const destination = `/app/${this.apiKey}/${messageType}`;
    this.webSocket.send(JSON.stringify({
      type: 'message',
      destination: destination,
      body: message
    }));

    this.messageSentSubject.next(message);
  }

  closeConnection(): void {
    this.webSocket.close();
  }
}
