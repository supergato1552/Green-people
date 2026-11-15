export type GenderOption = 'Hombre' | 'Mujer' | 'Gay' | 'Lesbiana' | 'No Binario';

export type FilterType = 'normal' | 'bw' | 'cinema-teal' | 'vintage-red';

export interface UserRegistrationData {
  gender: GenderOption | '';
  realName: string;
  username: string;
  realAge: number | '';
  agreedHonesty: boolean;
  avatarUrl: string | null;
  detectedAge: number | null;
  aiVerificationPassed: boolean;
}