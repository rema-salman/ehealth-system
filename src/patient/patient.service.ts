import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { getConnection } from 'typeorm';
import { MedicineDto } from './dto/medicine.dto';
import { NoteDto } from './dto/note.dto';
import { TestSessionDto } from './dto/test-session.dto';
import { TestDto } from './dto/test.dto';
import { TherapyListDto } from './dto/therapy-list.dto';
import { TherapyDto } from './dto/therapy.dto';

@Injectable()
export class PatientService {
  constructor(private readonly userService: UsersService) {}

  /**
   * gets therapylist by its id
   * @param {number} id - therapy_listID
   * @returns {Array} Promise - array of therapy_listDto
   */
  async getTherapyListById(id: number): Promise<TherapyListDto[]> {
    const results: TherapyListDto[] = await getConnection().query(
      `
      SELECT * FROM  Therapy_List   WHERE therapy_listID=?
      `,
      [id],
    );
    for (const therapyList of results) {
      therapyList.medicines = await this.getMedicineById(
        therapyList.Medicine_IDmedicine,
      );
    }
    return results;
  }
  /**
   * gets nedicine by its id
   * @param {number} id - medicineID
   * @returns {Array} Promise - array of medicineID
   */
  async getMedicineById(id: number): Promise<MedicineDto[]> {
    const results: MedicineDto[] = await getConnection().query(
      `
      SELECT * FROM  Medicine 
      WHERE medicineID=?
      `,
      [id],
    );

    return results;
  }

  /**
   * gets test by Therapy_IDtherapy id
   * @param {number} id - Therapy_IDtherapy
   * @returns {Array} Promise - array of TestDto
   */
  async getTestByTherapyId(id: number): Promise<TestDto[]> {
    const results: TestDto[] = await getConnection().query(
      `
      SELECT * FROM  Test
      WHERE Therapy_IDtherapy=?
      `,
      [id],
    );
    for (const test of results) {
      test.testSessions = await this.getTestSessionByTestId(test.testID);
    }
    return results;
  }

  /**
   * gets the testsession by its id
   * @param {number} id - Test_IDtest
   * @returns {Array} Promise - array of TestSessionDto
   */
  async getTestSessionByTestId(id: number): Promise<TestSessionDto[]> {
    const results: TestSessionDto[] = await getConnection().query(
      `
      SELECT * FROM  Test_Session
      WHERE Test_IDtest=?
      `,
      [id],
    );

    for (const testSession of results) {
      testSession.notes = await this.getNotesByTestSessionId(
        testSession.test_SessionID,
      );
      testSession.data = await this.getDataByDataUrl(testSession.DataURL);
    }
    return results;
  }
  /**
   * gets the nots of testsession
   * @param {number} id - Test_Session_IDtest_session
   * @returns {Array} Promise - array of NoteDto
   */
  async getNotesByTestSessionId(id: number): Promise<NoteDto[]> {
    const results: NoteDto[] = await getConnection().query(
      `
      SELECT * FROM  Note
      WHERE Test_Session_IDtest_session=?
      `,
      [id],
    );
    for (const note of results) {
      note.medic = await this.userService.getUserByEmail(null, note.User_IDmed);
    }

    return results;
  }

  /**
   * gets the medic's therapy sessions
   * @param {number} id- user_IDmed
   * @returns {Array} Promise- array of TherapyDto
   */
  async getTherapies(id: number = null): Promise<TherapyDto[]> {
    const params = [];
    if (id != null) {
      params.push(id);
    }
    const results: TherapyDto[] = await getConnection().query(
      `
      SELECT * FROM  Therapy 

      ` + (id != null ? ' WHERE User_IDmed=? ' : ''),
      params,
    );
    for (const therapy of results) {
      therapy.medic = await this.userService.getUserByEmail(
        null,
        therapy.User_IDmed,
      );
      therapy.patient = await this.userService.getUserByEmail(
        null,
        therapy.User_IDpatient,
      );
      therapy.theraphyList = await this.getTherapyListById(
        therapy.TherapyList_IDtherapylist,
      );
      therapy.tests = await this.getTestByTherapyId(therapy.therapyID);
    }
    return results;
  }

  /**
   * gets the patient's therapy sessions
   * @param {number} id- user_IDpatient
   * @returns {Array} Promise- array of TherapyDto
   */
  async getTherapySessions(id: number = null): Promise<TherapyDto[]> {
    const params = [];
    if (id != null) {
      params.push(id);
    }
    const results: TherapyDto[] = await getConnection().query(
      `
      SELECT * FROM  Therapy 

      ` + (id != null ? ' WHERE User_IDpatient=? ' : ''),
      params,
    );
    for (const therapy of results) {
      therapy.medic = await this.userService.getUserByEmail(
        null,
        therapy.User_IDpatient,
      );
      therapy.patient = await this.userService.getUserByEmail(
        null,
        therapy.User_IDpatient,
      );
      therapy.theraphyList = await this.getTherapyListById(
        therapy.TherapyList_IDtherapylist,
      );
      therapy.tests = await this.getTestByTherapyId(therapy.therapyID);
    }
    return results;
  }

  /**
   * get the matching data file to the dataURL
   * @param {string} dataUrl- the testSession.DataURL
   * @returns {Array} jsonArray- Json array of the data file X,  Y, time
   *    or X, Y, time, button, and correct
   */
  async getDataByDataUrl(dataUrl: string): Promise<any> {
    const path = require('path');
    const csv = require('csvtojson');
    const jsonArray = await csv().fromFile(
      path.join(__dirname, '../../resources/', dataUrl + '.csv'),
    );
    // console.log(jsonArray);
    return jsonArray;
  }
}
