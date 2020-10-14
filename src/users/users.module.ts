import { HttpModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { VideosModule } from 'src/videos/videos.module';
import { VideosService } from 'src/videos/videos.service';
import { NewsModule } from 'src/news/news.module';
import { NewsService } from 'src/news/news.service';
import { PatientService } from 'src/patient/patient.service';

@Module({
  imports: [VideosModule, NewsModule, HttpModule],
  providers: [UsersService, NewsService, VideosService, PatientService],
  controllers: [UsersController],
})
export class UsersModule {}
