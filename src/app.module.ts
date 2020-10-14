import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAdminCoreModule } from '@tfarras/nestjs-firebase-admin';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VideosModule } from './videos/videos.module';
import { PatientService } from './patient/patient.service';
import { PatientModule } from './patient/patient.module';
import { NewsModule } from './news/news.module';
import { UsersService } from './users/users.service';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

var admin = require('firebase-admin'); //used in the credential

/**
 * IMPORTS the connections with DB, Firebase API, and client app
 * ALL Other Modules used in server
 */
@Module({
  imports: [
    ConfigModule.forRoot({}), //dotenv file globaly
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: true,
    }),
    FirebaseAdminCoreModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert({
          type: process.env.FIREBASE_TYPE,
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI,
          token_uri: process.env.FIREBASE_TOKEN_URI,
          auth_provider_x509_cert_url:
            process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        }),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),

    AuthModule,
    VideosModule,
    PatientModule,
    NewsModule,
    UsersModule,
    FilesModule,
  ],
  providers: [PatientService, UsersService],
})
export class AppModule {}
