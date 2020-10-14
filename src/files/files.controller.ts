import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Provides an API route for the client side and returns the data file
 * from the folder resources according to requested file name
 * @param {Request} filename - filename of the needed data file
 * @returns {file} - the .csv file to
 */
@Controller('files')
export class FilesController {
  @Get(':filename')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=data.csv')
  getFile(@Param('filename') filename, @Res() res: Response) {
    if (!filename) {
      throw new HttpException('filename required', HttpStatus.BAD_REQUEST);
    }

    const path = require('path');
    //const fs = require('fs');

    try {
      res.sendFile(path.join(__dirname, '../../resources/', filename + '.csv'));
    } catch (e) {
      throw new HttpException('file not foud', HttpStatus.NOT_FOUND);
    }
  }
}
