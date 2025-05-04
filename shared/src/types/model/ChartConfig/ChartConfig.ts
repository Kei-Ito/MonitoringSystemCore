import { ChartTypes } from '@shared/enum/ChartTypes';
import { GridLayout } from './utils/GridLayout';

export interface ChartConfig {
    readonly chart_uuid: string;
    readonly chart_type:ChartTypes;
    channel_uuids: string[];
    grid_layout: GridLayout; 
    chart_options: any;
    category1: string|null;
    category2: string|null;
}