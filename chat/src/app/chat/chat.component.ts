import { Component, ViewChild } from '@angular/core';
import { ChannelsListComponent } from '../channels-list/channels-list.component'
import { CommonModule } from '@angular/common';
import { MessagesListComponent } from '../messages-list/messages-list.component'
import { Channel } from '../channel';
import { Input } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { SearchMessageComponent } from '../search-message/search-message.component';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config';
import { Message } from '../message';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChannelsListComponent, MessagesListComponent, SendMessageComponent, SearchMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  title = 'chat';
  apiKey: string;
  selectedChannel: Channel;
  messages: Message[] = [];
  @Input() url: string
  @Input() showChannelsList: boolean;
  @Input() showSearchBar: boolean;
  @Input() author: string;
  @ViewChild('messagesList', {static: true}) messagesList: MessagesListComponent;


  constructor(private http: HttpClient, private websocketService: WebsocketService) { }

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;

    this.websocketService.connect();
    this.websocketService.messageSentSubject.subscribe((m: string) => {
      const messageJson = JSON.parse(m);
      console.log("message sent via websocket! " + messageJson);
      
      const message: Message = new Message();
      //message.parentMessageId = messageJson.parentMessageId;
      message.body = messageJson.body;
      message.author = messageJson.author;
      message.date = messageJson.date;
      message.lastEditTime = messageJson.lastEditTime;
      message.channelId = messageJson.channelId;
      //message.attachment = messageJson.attachment;

      this.messages.push(message);
      //this.messagesList.updateMessages(this.messages);
    });
  }

  onChannelSelected(channel : Channel){
    this.selectedChannel = channel;
    this.initMessages();
  }

  onChannelsLoaded(showChannelsList : boolean) {
    this.showChannelsList = showChannelsList;
  }

  initMessages() {
    console.log("init messages"); 

    this.http.get(this.url + 'channels/' + this.selectedChannel.id + '/messages?apiKey=' + this.apiKey)
      .subscribe((response: any) => {
        this.messages = [];
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
          message.attachment = messageJson.attachment;

          this.messages[i] = message;
        }

        this.messagesList.updateMessages(this.messages);

      }, (error) => {
        console.error('Error:', error);
      });
  }

  sendMessage(messageText: string): void {
    /*const message: Message = new Message();
    message.body = messageText;
    message.author = this.author;
    message.channelId = this.selectedChannel.id;*/

    const currentDate: Date = new Date();

    const message = {
      body: messageText,
      author: this.author,
      channelId: this.selectedChannel.id,
      date: currentDate,
      lastEditTime: currentDate
    }
    
    this.websocketService.sendMessage('new-message', JSON.stringify(message));
  }
}
