// Core
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

// DTO
import { GetPollVotesDto } from './dto/get-poll-votes.dto';

// Services
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('slow-get-courses')
  public getCourses() {
    return this.appService.getCourses();
  }

  @Get('poll')
  public getPoll() {
    return this.appService.getPoll();
  }

  @Post('poll')
  public getPollVotes(@Body() body: GetPollVotesDto) {
    return this.appService.getPollVotes(body);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public upload(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    response.send({
      success: true,
      message: 'Upload was successful',
    });
    response.end();
  }
}
