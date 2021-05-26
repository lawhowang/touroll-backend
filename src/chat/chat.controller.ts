import { Body, Controller, Get, NotFoundException, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/auth/auth.guard"
import { User } from "src/users/entities/user.entity"
import { Me } from "src/users/users.decorator"
import { UsersService } from "src/users/users.service"
import { ChatService } from "./chat.service"
import { NewDto } from "./dto/new.dto"

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService,
    private readonly usersService: UsersService) { }

  @Post('new')
  @UseGuards(AuthGuard)
  async newChat(@Body() newDto: NewDto, @Me() me: User) {
    const userId = newDto.userId;
    const user = await this.usersService.findOneByFirebaseUid(userId);
    if (!user) {
        throw new NotFoundException();
    }
    const myId = me.firebaseUid;
    //const channelId = myId > userId ? `${myId}-${userId}` : `${userId}-${myId}`
    const channelId = await this.chatService.createChannel(myId, [myId, userId])
    return { channelId }
  }

  @Get('token')
  @UseGuards(AuthGuard)
  getChatToken(@Me() user) {
    const token = this.chatService.generateToken(user.firebaseUid)
    return {
      token
    }
  }
}
