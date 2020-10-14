import { UserDto } from 'src/users/dto/users.dto';
import { TestDto } from './test.dto';
import { TherapyListDto } from './therapy-list.dto';

export class TherapyDto {
  User_IDpatient: number;
  //the pysichian
  User_IDmed: number;
  TherapyList_IDtherapylist: number;
  therapyID: number;

  patient: UserDto;
  medic: UserDto;
  theraphyList: TherapyListDto[];
  tests: TestDto[];
}
