import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FirebaseAdminSDK,
  FIREBASE_ADMIN_INJECT,
} from '@tfarras/nestjs-firebase-admin';
import { NewsService } from 'src/news/news.service';
import { NoteDto } from 'src/patient/dto/note.dto';
import { ReasearcherNoteDto } from 'src/patient/dto/reasercher-note.dto';
import { PatientService } from 'src/patient/patient.service';
import { VideosService } from 'src/videos/videos.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users') //
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly videosService: VideosService,
    private readonly newsService: NewsService,
    private readonly patientService: PatientService,
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK, // firebase middelware
  ) {}

  /**
   * Provides an API route for the client side and sends the corresponding data
   * according to the user role, the function uses a guard from firebaseSDK
   * @param {Request} - from the client side
   * @returns {Array} - array of a structured data (objects)
   */
  @Get('me')
  @UseGuards(AuthGuard('firebase')) // firebase header as guard
  async userProfile(@Request() req) {
    console.log(req.user);

    // check user if not exist then creates a new one
    let result = await this.userService.getUserByEmail(req.user.email);
    if (!result) {
      result = await this.userService.createUser(req.user);
    }

    //patient: resluts sent as youtube and therapysessions without notes
    if (result.Role_IDrole == 1) {
      const videos = await this.videosService.getYoutubeVideos();
      const myTherapySessions = await this.patientService.getTherapySessions(
        result.userID,
      );
      result['feed'] = {
        youtube: videos['items'],
        myTherapySessions: myTherapySessions.map(therapy => {
          therapy.tests = therapy.tests.map(test => {
            test.testSessions = test.testSessions.map(testSession => {
              testSession.notes = [];
              return testSession;
            });
            return test;
          });
          return therapy;
        }),
      };
    } else {
      //physician: returns result as his/her theraysessions and all therapysessions
      const therapies = await this.patientService.getTherapies();
      const myTherapies = await this.patientService.getTherapies(result.userID);
      result['feed'] = {
        myTherapies: myTherapies,
        therapies: therapies,
      };
      //researcher or junior researcher: results 2 types of therapysissions and rss news
      if (result.Role_IDrole == 3 || result.Role_IDrole == 4) {
        const news = await this.newsService.getNews();
        result['feed']['rss'] = news;
      }
    }
    return result;
  }
  /**
   * Provides an API route for the notes and sends the notes
   * @param {Request} - from the client side
   * @returns {Array} - array of a structured data of the researcher notes(objects)
   */
  @Get('notes')
  @UseGuards(AuthGuard('firebase')) // firebase header as guard
  async notes(@Request() req): Promise<ReasearcherNoteDto[]> {
    console.log(req.user);

    // check user if not exist then creates a new one
    let result = await this.userService.getUserByEmail(req.user.email);
    if (!result || ![3, 4].includes(result.Role_IDrole)) {
      throw new HttpException(
        'User unavailable or not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.patientService.getReasercherNotes(result.userID);
  }

  /**
   * Provides an API route for the creating the notes and sends the sucess respons
   * @param {Request} - from the client side
   * @returns {promise} - respons
   */
  @Post('notes')
  @UseGuards(AuthGuard('firebase')) // firebase header as guard
  async createNote(
    @Request() req,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<any> {
    console.log(req.user);

    // check user if not exist then creates a new one
    let result = await this.userService.getUserByEmail(req.user.email);
    if (!result || ![3, 4].includes(result.Role_IDrole)) {
      throw new HttpException(
        'User unavailable or not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!createNoteDto.note || createNoteDto.note.trim() == '') {
      throw new HttpException(
        'A note should have a note :)',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.patientService.createResearcherNote(
      createNoteDto.note,
      result.userID,
    );

    throw new HttpException('Note created', HttpStatus.CREATED);
  }

  @Get('patients')
  @UseGuards(AuthGuard('firebase')) // firebase header as guard
  async getPatients(@Request() req): Promise<UserDto[]> {
    console.log(req.user);

    // check user if not exist then creates a new one
    let result = await this.userService.getUserByEmail(req.user.email);
    if (!result || ![3, 4].includes(result.Role_IDrole)) {
      throw new HttpException(
        'User unavailable or not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.userService.getAllPatients();
  }
}
