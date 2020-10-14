import { HttpModule, HttpService, Module } from '@nestjs/common';
import { VideosService } from './videos.service';

@Module({
  imports: [HttpModule],
  providers: [VideosService],
})
export class VideosModule {}
