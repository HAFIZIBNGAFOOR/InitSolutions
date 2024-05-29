import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  chatForm: FormGroup;
  messages: { room: string, message: string }[] = [];
  selectedFile: File | null = null;
  room!: string;
  rooms: string[] = ['Room1', 'Room2', 'Room3'];
  users: string[] = ['User1', 'User2', 'User3'];
  privateChats!: { user: string, messages: string[] } ;

  constructor(private fb: FormBuilder, private chatService: ChatService) {
    this.chatForm = this.fb.group({
      message: ['']
    });
  }

  ngOnInit() {
    

    this.chatService.getMessages().subscribe(({ room, message }) => {
      if (room === this.room) {
        this.messages.push({ room, message });
      }
    });

    this.chatService.getFiles().subscribe(({ room, file }) => {
      // Handle file display logic here
    });
  }

  joinRoom(target: any) {
    this.room = target.value;
    this.chatService.joinRoom(this.room);
  }

  sendMessage() {
    const message = this.chatForm.get('message')?.value;
    if (this.room) {
      this.chatService.sendMessage(this.room, message);
      this.messages.push({ room: this.room, message });
    }
    this.chatForm.reset();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendFile() {
    if (this.selectedFile && this.room) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileData = {
          name: this.selectedFile?.name,
          type: this.selectedFile?.type,
          content: e.target.result,
        };
        this.chatService.sendFile(this.room, fileData);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
