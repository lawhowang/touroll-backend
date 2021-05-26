import { Injectable } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class ChatService {
  client: StreamChat;

  constructor() {
    this.client = new StreamChat('', '');
  }

  generateToken(identifier: string) {
    return this.client.createToken(identifier, Math.floor(Date.now() / 1000) + (60 * 60));
  }

  async createChannel(userId, members: string[]) {
    const channel = this.client.channel('messaging', { members, created_by_id: userId });
    await channel.create()
    return channel.id
  }
}
