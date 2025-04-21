import { ChartTypes } from '@shared/enum/ChartTypes';
import { ChartPosition } from './utils/ChartPosition';
export interface ChartSetting {
    chart_id: number;
    module_uuid: string;
    channel_id: number;
    chart_type:ChartTypes;
    chart_position: ChartPosition;
    specific_chart_setting: any;
}