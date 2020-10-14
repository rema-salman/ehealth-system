import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class VideosService {
  constructor(private readonly httpService: HttpService) {}

  async getYoutubeVideos() {
    const results = await this.httpService
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=parkinsons%20exersice&type=video&key=${process.env.YOUTUBE_API}`,
      )
      .toPromise();

    return results.data;
  }
}
