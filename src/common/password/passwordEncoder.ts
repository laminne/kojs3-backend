export type EncodedPassword = string;
// パスワードをハッシュしたりエンコードしたりするインタフェース
export interface IPasswordEncoder {
  EncodePassword(raw: string): Promise<EncodedPassword>;
  IsMatchPassword(raw: string, encoded: EncodedPassword): Promise<boolean>;
}
