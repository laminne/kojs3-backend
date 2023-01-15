/*
  普通にtype Snowflake = string とするとIDじゃないstringも入れれるのでSymbolを作ってからstringと合成する
  Cf. https://qiita.com/suin/items/ae9ed911ebab48c98835
*/
declare const snowflakeIDSymbol: unique symbol;
export type Snowflake = string & { [snowflakeIDSymbol]: never };
