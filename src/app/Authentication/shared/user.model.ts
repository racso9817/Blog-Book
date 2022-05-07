export class User {
  uid: string;
  constructor(
    public email: string,
    public id: string,
    public role: role,
    private _token: string,
    private _tokenExpirationDate: Date
  ) { }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export class Profile {
  desc: string;
  email: string;
  imgurl: string;
  name: string;
  uname: string;
  isProfileSet?: boolean
  isStudent?: boolean
  isTeacher?: boolean
  isAdmin?: boolean
  birthDate?: Date
  tutorEmail?: string
}


export interface User1 {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  role: role;
}

export interface role {
  student: boolean;
  teacher: boolean;
  admin: boolean;
}