// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { UserService } from '../user.service';
// import { Injectable, UnauthorizedException } from '@nestjs/common';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private userService: UserService) {
//     super();
//   }

//   validate(username: string) {
//     console.log('inside LocalStrategy');
//     const user = this.userService.validateUser({ username });
//     if (!user) throw new UnauthorizedException();
//     return user;
//   }
// }
