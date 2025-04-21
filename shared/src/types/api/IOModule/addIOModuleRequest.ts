import { IOModuleTypes } from '@shared/enum/IOModuleTypes'

/**
 * センサ追加リクエストを送るためのデータ型
 */
export interface addIOModuleRequest {
  module_type: IOModuleTypes;  // センサの種類（特定のIOモジュールなど）
  module_name: string;         // センサの名前
}
