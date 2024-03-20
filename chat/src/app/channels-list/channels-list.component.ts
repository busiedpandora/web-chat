import { Component } from '@angular/core';
import { Channel } from '../channel';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.css'
})
export class ChannelsListComponent {
  channels : Channel[] = [];

  selectedChannel : Channel | null = null;


  constructor(private http: HttpClient) {
    this.initChannels(); 
  }

  initChannels() {
    this.http.get('https://supsi-ticket.cloudns.org/supsi-chat/bff/channels')
      .subscribe((response: any) => {
        const channelsJson : any[] = response;
        
        for(let i = 0; i < channelsJson.length; i++) {
          const channelJson : any = channelsJson[i];

          const channel : Channel = new Channel();
          channel.id = channelJson.id;
          channel.name = channelJson.name;
          i == 0 ? channel.selected = true : channel.selected = false;

          this.channels[i] = channel;
        }

        this.selectedChannel = this.channels[0];

      }, (error) => {
        console.error('Error:', error);
      });
  }

  onSelect(channel : Channel) {
    if(this.selectedChannel != null) {
      this.selectedChannel.selected = false;
      this.selectedChannel = channel;
      this.selectedChannel.selected = true;
    }
  }
}
