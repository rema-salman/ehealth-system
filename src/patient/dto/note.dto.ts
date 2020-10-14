import { UserDto } from 'src/users/dto/users.dto';

export class NoteDto {
  noteID: number;
  Test_Session_IDtest_session: number;
  note: string;
  User_IDmed: number;
  medic: UserDto;
}
