import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;
  }

  ngOnChanges() {
    if (this.channel != undefined) {
      this.initMessages();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  initMessages() {
    this.http.get(this.url + 'channels/' + this.channel.id + '/messages?apiKey=' + this.apiKey)
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
}

