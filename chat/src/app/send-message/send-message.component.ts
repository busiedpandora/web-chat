import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Channel } from '../channel';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.css'
})
export class SendMessageComponent {
  apiKey: string;
  @Input() url: string;
  @Input() authorRegistered: string;
  @Input() channel: Channel;
  sendMessageInput: string="";


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;
  }

  sendMessage(input: HTMLInputElement, attachment: FileList | null) {
    const messageText: string = input.value;

    if(messageText === "") {
      return;
    }

    const message = {
      body: messageText,
      author: this.authorRegistered
    }
    
    const formData = new FormData();
    formData.append("message", new Blob([JSON.stringify(message)], {type: 'application/json'}));
    formData.append('attachment',  attachment != null && attachment?.length > 0 ? attachment[0] : new Blob());

    this.http.post(this.url + `channels/${this.channel.id}/messages?apiKey=${this.apiKey}`,
    formData)
    .subscribe({
      next: data => {
        console.log('Message sent: ' + data);
        input.value = "";
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
}
  
