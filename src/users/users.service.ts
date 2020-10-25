import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { OrganizationDto } from './dto/organization.dto';
import { RoleDto } from './dto/roles.dto';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  async getAllPatients(): Promise<UserDto[]> {
    let results: UserDto[] = await getConnection().query(
      `SELECT * FROM User WHERE Role_IDrole=1`,
    );
    return results;
  }

  async getUserByEmail(email: string, id: number = null): Promise<UserDto> {
    let results: UserDto[] = null;
    if (id) {
      results = await getConnection().query(
        `
          SELECT * FROM User
          WHERE userID=?
          `,
        [id],
      );
    } else {
      results = await getConnection().query(
        `
          SELECT * FROM User
          WHERE email=?
          `,
        [email],
      );
    }

    for (const user of results) {
      user.role = await this.getRoleById(user.Role_IDrole);
      user.organization = await this.getOrganizationById(user.Organization);
    }
    return results.length > 0 ? results[0] : null;
  }

  async getRoleById(id: number): Promise<RoleDto> {
    const results: RoleDto[] = await getConnection().query(
      `
    SELECT * FROM Role
    WHERE roleID=?
    `,
      [id],
    );

    return results.length > 0 ? results[0] : null;
  }

  async generateUserName(
    suggestion: string,
    postfix: number = 0,
  ): Promise<string> {
    const restults = await getConnection().query(
      `
      SELECT * FROM User
      WHERE username=?
      `,
      [suggestion + (postfix == 0 ? '' : postfix)],
    );
    if (restults.length > 0) {
      return this.generateUserName(suggestion, postfix + 1);
    }
    return suggestion + (postfix == 0 ? '' : postfix);
  }

  /**
   * Create/insert a new user in DB , using email and name from firebase response
   * while role and organization from the sign in provider.
   * @param {Object} firebaseUser - the user info from firebase with signin provider
   * @returns {Promise} Promise user object through the returned function
   */
  async createUser(firebaseUser): Promise<UserDto> {
    let roleID = 1; // patient roleID
    let organization = 1; // patient and physician
    if (firebaseUser.firebase.sign_in_provider.includes('github.com')) {
      // user assigned as a researcher
      roleID = 3;
      organization = 2;
    } else if (firebaseUser.firebase.sign_in_provider.includes('twitter.com')) {
      // user assigned as a physician
      roleID = 2;
    }
    // insteart to DB the new user
    const name = await this.generateUserName(firebaseUser.name);
    await getConnection().query(
      `
      INSERT INTO User(  username, email, Role_IDrole, Organization)
       VALUES (?,?,?,?)
      `,
      [name, firebaseUser.email, roleID, organization],
    );
    /**
     * @innerfunction gets the user info by email
     * @param {string} firebaseUser.email - the email of this (new) user
     */
    return this.getUserByEmail(firebaseUser.email);
  }
  /**
   * Gets the organization by its id
   * @param {number} id - organization Id
   * @returns {Promise} Promise Organization object through the returned function
   */
  async getOrganizationById(id: number): Promise<OrganizationDto> {
    const results: OrganizationDto[] = await getConnection().query(
      `
    SELECT * FROM Organization
    WHERE organizationID=?
    `,
      [id],
    );

    return results.length > 0 ? results[0] : null;
  }
}
