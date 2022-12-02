import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
