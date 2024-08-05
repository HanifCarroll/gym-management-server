import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly supabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.getClient();
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const { user, error } = await this.supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const { session, error } = await this.supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) throw error;
    return session;
  }

  async logout() {
    const { error } = await this.supabaseClient.auth.signOut();
    if (error) throw error;
    return { message: 'Successfully logged out' };
  }

  async getCurrentUser() {
    const user = this.supabaseClient.auth.user();
    if (!user) throw new Error('No user logged in');
    return user;
  }

  async updateCurrentUser(updateUserDto: Partial<CreateUserDto>) {
    const { user, error } =
      await this.supabaseClient.auth.update(updateUserDto);
    if (error) throw error;
    return user;
  }
}
