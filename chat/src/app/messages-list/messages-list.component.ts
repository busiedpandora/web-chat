import { AfterViewInit, Component, ElementRef, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../message';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { Channel } from '../channel';
import { MessageComponent } from '../message/message.component';
import { AppConfig } from '../../config';
import { SearchMessageComponent } from '../search-message/search-message.component';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule, MessageComponent, SearchMessageComponent],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent {
  apiKey: string;
  @Input() url: string;
  @Input() channel: Channel;
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  @Input() authorRegistered: string;
  @Input() showSearchBar: boolean;
  @ViewChild('messagesList') messagesList: ElementRef;
  editingMessage: boolean = false;
  replyingToMessage: boolean = false;
  @Output() receivedMessageFromOtherChannelEvent = new EventEmitter<number>();
  

  constructor(private http: HttpClient, private websocketService: WebsocketService) { }

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;

    this.websocketService.connect();
    this.websocketService.messageSentSubject.subscribe((m: string) => {
      const messageJson = JSON.parse(m);
      console.log("message sent via websocket! " + messageJson);
      
      const message: Message = new Message();
      message.parentMessageId = messageJson.parentMessageId;
      message.body = messageJson.body;
      message.author = messageJson.author;
      message.date = messageJson.date;
      message.lastEditTime = messageJson.lastEditTime;
      message.channelId = messageJson.channelId;
      //message.attachment = messageJson.attachment;

      if(message.channelId == this.channel.id) {
        this.messages.push(message);
        //this.filteredMessages.push(message);
      }
      else {
        this.receivedMessageFromOtherChannelEvent.emit(message.channelId);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.channel) {
      if(this.channel != undefined) {
        this.initMessages();
      }
    }
  }

  ngAfterViewChecked() {
    if(!this.editingMessage && !this.replyingToMessage) {
      this.scrollToBottom();
    }
  }

  initMessages() {
    this.http.get(this.url + 'channels/' + this.channel.id + '/messages?apiKey=' + this.apiKey)
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

        this.sortMessagesByDate();
        this.filteredMessages = this.messages;

      }, (error) => {
        console.error('Error:', error);
      });
  }

  sortMessagesByDate() {
    this.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  onSearchMessages(searchInput : string) {
    if(searchInput === "") {
      this.filteredMessages = this.messages;
      return;
    }

    searchInput = searchInput.toLowerCase();

    this.filteredMessages = this.messages
      .filter(message => message.author != null && message.author.toLowerCase().includes(searchInput) 
        || message.body != null && message.body.toLowerCase().includes(searchInput));  
  }

  scrollToBottom() {
    if(this.messagesList != null) {
      this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
    }
  }

  onEditingMessage(editing: boolean) {
    this.editingMessage = editing;
  }

  onReplyingToMessage(replying: boolean) {
    this.replyingToMessage = replying;
  }

  getMessageById(id: number | null) {
    if(id == null) {
      return null;
    }

    const message: Message | undefined = this.messages.find(message => message.id === id);
    
    if(message == undefined) {
      return null;
    }

    return message;
  }
}

