import { Snowflake } from "./snowflakeID";

// Snowflake ID生成器
export class SnowflakeIDGenerator {
  // Epoch = ID生成の起点. 2020年04月01日 午前00:00:00 (UTC)
  readonly EPOCH: bigint = 1585699200n * 1000n;

  public newID(t: Date): Snowflake {
    // ToDo: タイムゾーンをUTCに固定したい
    process.env.TZ = "UTC";
    let time = BigInt(t.getTime());
    if (t.getTimezoneOffset() !== 0) {
      // UTCにそろえる
      const offset: bigint = BigInt(t.getTimezoneOffset()) * 60n * 1000n;
      time = time - offset;
    }

    const date: bigint = time - this.EPOCH;
    // // ToDo: この部分を環境変数から読むようにする
    const [workerID, processID, increment] = [0n, 0n, 0n];
    const id: bigint =
      (date << 22n) +
      (workerID << 17n) +
      (processID << 12n) +
      (increment << 0n);

    return id.toString() as Snowflake;
  }
}
