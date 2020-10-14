import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}
  async getNews() {
    const xml2js = require('xml2js');
    const results = await this.httpService
      .get('https://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx')
      .toPromise();

    return new Promise((resolve, reject) => {
      xml2js.parseString(results.data, (err, result) => {
        if (err) {
          reject(err);
        }
        // log JSON string
        // console.log(result);
        resolve(
          result.rss.channel[0].item.map(element => {
            return {
              title: element.title[0],
              description: element.description[0],
              image: element['media:content'][0]['$'].url,
              link: element.link[0],
            };
          }),
        );
      });
    });
  }
}
