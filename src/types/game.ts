export type Position = {
  row: number;
  col: number;
};

export type Move = {
  row: number;          // ตำแหน่งปลายทาง
  col: number;          // ตำแหน่งปลายทาง
  capture?: Position;   // ถ้ามีการกินหมาก จะบอกตำแหน่งหมากที่ถูกกิน
};
