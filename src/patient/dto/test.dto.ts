import { TestSessionDto } from './test-session.dto';

export class TestDto {
  testID: number;
  dateTime: string;
  Therapy_IDtherapy: number;
  testSessions: TestSessionDto[];
}
