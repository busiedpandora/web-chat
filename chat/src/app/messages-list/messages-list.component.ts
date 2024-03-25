import { Component } from '@angular/core';
import { Message } from '../message';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { Channel } from '../channel';
import { MessageComponent } from './message/message.component';
import { AppConfig } from '../../config';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule, MessageComponent],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent {
  apiKey: string;
  authorRegistered: string;
  @Input() channel: Channel;
  messages: Message[] = [];
  

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;
    this.authorRegistered = AppConfig.authorRegistered;
  }

  ngOnChanges() {
    if (this.channel != undefined) {
      this.initMessages();
    }
  }

  initMessages() {
    this.http.get('https://supsi-ticket.cloudns.org/supsi-chat/bff/channels/' + this.channel.id + '/messages?apiKey=' + this.apiKey)
      .subscribe((response: any) => {
        const messagesJson: any[] = response;

        for (let i = 0; i < messagesJson.length; i++) {
          const messageJson: any = messagesJson[i];

          const message: Message = new Message();

          message.id = messageJson.id;
          message.parentMessageId = messageJson.parentMessageId;
          message.body = messageJson.body;
          message.author = messageJson.author;
          message.date = messageJson.date;
          message.lastEditTime = messageJson.lastEditTime;
          message.channelId = messageJson.channelId;
          message.attachmentId = messageJson.attachmentId;

          this.messages[i] = message;
        }

        this.sortMessagesByDate();

      }, (error) => {
        console.error('Error:', error);
      });
  }

  sortMessagesByDate() {
    this.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

