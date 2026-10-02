/** Khai báo tối thiểu cho @3d-dice/dice-box (thư viện không kèm kiểu TypeScript). */
declare module "@3d-dice/dice-box" {
  const DiceBox: new (config: Record<string, unknown>) => unknown;
  export default DiceBox;
}
