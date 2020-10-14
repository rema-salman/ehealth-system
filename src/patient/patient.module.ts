import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PatientService } from './patient.service';

@Module({
  imports: [UsersModule],
  providers: [PatientService, UsersService],
})
export class PatientModule {}
