/**
 * Modbus系通信で使用するFunctionCodeの列挙型
 */
export enum ModbusFunctionCode{
    //読み込み系
    read_coils=1,
    read_discrete_inputs=2,
    read_holding_registers=3,
    read_input_registers=4,
    //書き込み系
    write_single_coil=5,
    write_single_register=6,
    write_multiple_coils=15,
    write_multiple_registers=16,
}