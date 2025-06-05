import { IOModuleTypes } from '@monitoring/shared/enum'

import DummyModuleImage from '@/assets/img/DummyModule.jpg'
import HPADDARaspiImage from '@/assets/img/High-Precision-AD-DA-Board_l.jpg'
import ModbusRTUImage from '@/assets/img/ModbusRTU.png'

export const IOModuleTypeImages = [
    {module_type: IOModuleTypes.Dummy, image: DummyModuleImage},
    {module_type: IOModuleTypes.HPADDA_Raspi, image: HPADDARaspiImage},
    {module_type: IOModuleTypes.ModbusRTU, image: ModbusRTUImage},
    {module_type: IOModuleTypes.ModbusTCP, image: ModbusRTUImage},
    {module_type: IOModuleTypes.ContecRAI, image: DummyModuleImage}
]