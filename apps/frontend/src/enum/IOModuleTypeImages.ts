import HPADDA_Raspi_Image from '@/assets/img/High-Precision-AD-DA-Board_l.jpg'
import DummyModule_Image from '@/assets/img/DummyModule.jpg'
import ModbusRTU_Image from '@/assets/img/ModbusRTU.png'
import { IOModuleTypes } from '@monitoring/shared/enum'

export const IOModuleTypeImages = [
    {module_type: IOModuleTypes.Dummy, image: DummyModule_Image},
    {module_type: IOModuleTypes.HPADDA_Raspi, image: HPADDA_Raspi_Image},
    {module_type: IOModuleTypes.ModbusRTU, image: ModbusRTU_Image},
    {module_type: IOModuleTypes.ModbusTCP, image: ModbusRTU_Image},
    {module_type: IOModuleTypes.ContecRAI, image: DummyModule_Image}
]