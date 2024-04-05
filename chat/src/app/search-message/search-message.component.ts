import { Component, EventEmitter, OnChanges } from '@angular/core';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Channel } from '../channel';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-search-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-message.component.html',
  styleUrl: './search-message.component.css'
})
export class SearchMessageComponent implements OnChanges {
  searchInput: string = "";
  @Output() searchMessagesEvent = new EventEmitter<string>();
  @Input() channel: Channel;


  ngOnChanges(changes: SimpleChanges) {
    if(changes.channel) {
      this.clearSearchInput();
    }
  }

  searchMessages() {
    if(this.searchInput == null) {
      return;
    }
    
    this.searchMessagesEvent.emit(this.searchInput);
  }

  clearSearchInput() {
    this.searchInput = "";

    this.searchMessagesEvent.emit("");
  }
}
