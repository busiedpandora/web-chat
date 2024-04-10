import { Component, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Channel } from '../channel';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Output } from '@angular/core';

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.css'
})
export class ChannelsListComponent {
  @Input() url: string;
  @Input() showChannelsList: boolean;
  channels : Channel[] = [];

  selectedChannel : Channel | null = null;

  @Output() selectChannelEvent = new EventEmitter<Channel>();

  @Output() channelsLoadedEvent = new EventEmitter<number>();

  unreadMessagesInChannels: number[];


  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes.url) {
      this.initChannels();
    }
  }

  initChannels() {
    this.http.get(this.url + 'channels')
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
        this.unreadMessagesInChannels = new Array(this.channels.length).fill(0);

        this.channelsLoadedEvent.emit(this.channels.length);
        
        this.selectedChannel = this.channels[0];
        this.selectChannelEvent.emit(this.selectedChannel);
      }, (error) => {
        console.error('Error:', error);
      });
  }

  onSelect(channel : Channel) {
    if(this.selectedChannel != null) {
      this.selectedChannel.selected = false;
      this.selectedChannel = channel;
      this.selectedChannel.selected = true;
      this.resetNumberOfUnreadMessagesInChannel(this.selectedChannel.id);
      this.selectChannelEvent.emit(this.selectedChannel);
    }
  }

  getNumberOfUnreadMessagesInChannel(channelId: number) {
    const index: number = channelId - 1;
    if(index < this.unreadMessagesInChannels.length) { 
      return this.unreadMessagesInChannels[index];
    }

    return -1;
  }

  increaseNumberOfUnreadMessagesInChannel(channelId: number) {
    const index: number = channelId - 1;
    if(index < this.unreadMessagesInChannels.length) {
      this.unreadMessagesInChannels = this.unreadMessagesInChannels.map((value, idx) => {
        if (idx === index) {
          return value + 1;
        }
        return value;
      });
    }
  }

  resetNumberOfUnreadMessagesInChannel(channelId: number) {
    const index: number = channelId - 1;
    if(index < this.unreadMessagesInChannels.length) {
      this.unreadMessagesInChannels[index] = 0;
    }
  }
}
