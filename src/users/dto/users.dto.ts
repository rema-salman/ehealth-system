import { OrganizationDto } from './organization.dto';
import { RoleDto } from './roles.dto';

export class UserDto {
  userID: number;
  username: string;
  email: string;
  Role_IDrole: number;
  Organization: number;
  Lat: number;
  Long: number;
  role: RoleDto;
  organization: OrganizationDto;

  //  get map(){
  //    return "http://maps.google.com/maps/api/staticmap?center="+this.Lat+","+this.Long+"&zoom=7&size=640x480&scale=2&maptype=hybrid&key="
  //  }
}
