import { Component, EventEmitter } from '@angular/core';
import { Message } from '../message';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config';
import { HttpHeaders } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  apiKey: string;
  @Input() url: string;
  @Input() message : Message;
  @Input() authorRegistered: string;
  onEdit: boolean = false;
  editedMessage: string = "";
  onReply: boolean = false;
  repliedMessage: string = "";
  @Input() parentMessage: Message | null = null;
  @ViewChild('attachment') attachment!: ElementRef<HTMLInputElement>;


  constructor(private http: HttpClient, private websocketService: WebsocketService) {}

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;
  }

  formatDate(date : Date) {
    let formattedDate = date.toLocaleString(
      'it-CH', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', 
      hour12: true });

    formattedDate = formattedDate.replace("T", " ").slice(0, -7);

    return formattedDate;
  }

  editMessage() {
    this.onEdit = true;

    this.editedMessage = this.message.body;
  }

  saveEdit() {
    if(this.editedMessage === "") {
      return;
    }

    this.message.body = this.editedMessage;

    const body = {
      body: this.message.body,
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.put(this.url + `messages/${this.message.id}/body?apiKey=${this.apiKey}`, body, {headers: headers})
    .subscribe({
      next: (data: any) => {
        console.log('Message edited: ' + data);
        this.onEdit = false;

        const message = {
          id: data.id,
          body: data.body,
          author: data.author,
          channelId: data.channelId,
          date: data.date,
          lastEditTime: data.lastEditTime,
          parentMessageId: data.parentMessageId,
          attachment: data.attachment
        }

        this.websocketService.sendMessage('update-message', JSON.stringify(message));
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  replyToMessage() {
    this.onReply = true;
  }

  saveReply() {
    if(this.repliedMessage === "") {
      return;
    }

    const message = {
      body: this.repliedMessage,
      author: this.authorRegistered,
      parentMessageId: this.message.id
    }
    
    const formData = new FormData();
    formData.append("message", new Blob([JSON.stringify(message)], {type: 'application/json'}));

    if(this.attachment == null) {
      formData.append('attachment', new Blob());
    }
    else {
      const attachmentFiles = this.attachment.nativeElement.files;
      formData.append('attachment', attachmentFiles != null && attachmentFiles?.length > 0 ? attachmentFiles[0] : new Blob());
    }
    
    this.http.post(this.url + `channels/${this.message.channelId}/messages?apiKey=${this.apiKey}`,
    formData)
    .subscribe({
      next: (data: any) => {
        console.log('Reply message sent: ' + data);
        this.onReply = false;

        const message = {
          id: data.id,
          body: data.body,
          author: data.author,
          channelId: data.channelId,
          date: data.date,
          lastEditTime: data.lastEditTime,
          parentMessageId: data.parentMessageId,
          attachment: data.attachment
        }
    
        this.websocketService.sendMessage('new-message', JSON.stringify(message));
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
}
