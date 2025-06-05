/* eslint-disable @typescript-eslint/naming-convention */
import { createI18n } from 'vue-i18n'

// 言語設定の永続化
const savedLocale = localStorage.getItem('locale')
const translations:any = {
  ja: {
    menu: {
      operation_condition: '稼働状態',
      dashboard: 'ダッシュボード',
      custom_dashboard: 'カスタムダッシュボード',
      trend: 'トレンド', 
      configurations: '設定',
      analytics: '分析',
      notifications: '通知',
      profile: 'プロフィール',
      signIn: 'ログイン',
      signUp: '新規登録'
    },
    system_settings: {
        title: 'システム設定',
        setting_item: '設定項目',
        setting_value: '設定値', 
        discription: '説明',
        system_color: 'システムの配色',
        language: '言語',
        dark_mode: 'ダークモード',
        fixed_navbar: '固定ナビゲーションバー',
        sampling_clock: 'サンプリング周期',
        sampling_clock_unit: 'サンプリング周期の単位',
        data_retention: 'データ保持期間',
        data_retention_unit: 'データ保持期間の単位',
        input_data_setting: '入力データ設定',
        clock:{
          second: '秒',
          minute: '分',
          hour: '時間',
          day: '日',
          week: '週',
          month: '月',
          year: '年'
        },
        descriptions: {
          system_color: 'システムの配色を設定します',
          language: '表示言語を設定します',
          dark_mode: 'ダークモードを有効/無効にします',
          fixed_navbar: 'ナビゲーションバーを固定するかどうかを設定します',
          sampling_clock: 'データ収集の周期を設定します',
          data_retention: 'データを保持する期間を設定します'
        }
    },
    modal_window: {
      update: '更新',
      cancel: 'キャンセル',
    }
  },
  en: {
    menu: {
      operation_condition: 'Operation Condition',
      dashboard: 'Dashboard',
      custom_dashboard: 'Custom Dashboard',
      trend: 'Trend',
      configurations: 'Configurations', 
      analytics: 'Analytics',
      notifications: 'Notifications',
      profile: 'Profile',
      signIn: 'Sign In',
      signUp: 'Sign Up'
    },
    system_settings: {
        title: 'System Settings',
        setting_item: 'Setting Item',
        setting_value: 'Value',
        discription: 'Description',
        system_color: 'System Color',
        language: 'Language',
        dark_mode: 'Dark Mode',
        fixed_navbar: 'Fixed Navigation Bar',
        sampling_clock: 'Sampling Clock',
        sampling_clock_unit: 'Sampling Clock Unit',
        data_retention: 'Data Retention Period',
        data_retention_unit: 'Data Retention Unit',
        input_data_setting: 'Input Data Setting',
        clock:{
          second: 'sec',
          minute: 'min',
          hour: 'hr',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          year: 'Year'
        },
        descriptions: {
            system_color: 'Set the system color scheme',
          language: 'Set the display language',
          dark_mode: 'Enable/disable dark mode',
          fixed_navbar: 'Set whether to fix the navigation bar',
          sampling_clock: 'Set the data collection interval',
          data_retention: 'Set the period for which data is retained'
        }
    },
    modal_window: {
      update: 'Update',
      cancel: 'Cancel',
    }
  },
  zh: {
    menu: {
      operation_condition: '运行状态',
      dashboard: '仪表板',
      custom_dashboard: '自定义仪表板',
      trend: '趋势',
      configurations: '设置',
      analytics: '分析',
      notifications: '通知', 
      profile: '个人资料',
      signIn: '登录',
      signUp: '注册'
    },
    system_settings: {
        title: '系统设置',
        setting_item: '设置项目',
        setting_value: '设置值',
        discription: '说明',
        system_color: '系统颜色',
        language: '语言',
        dark_mode: '深色模式',
        fixed_navbar: '固定导航栏',
        sampling_clock: '采样周期',
        sampling_clock_unit: '采样周期单位',
        data_retention: '数据保留期',
        data_retention_unit: '数据保留期单位',
        input_data_setting: '输入数据设置',
        clock:{
          second: '秒',
          minute: '分钟',
          hour: '小时',
          day: '天',
          week: '周',
          month: '月',
          year: '年'
        },
        descriptions: {
          system_color: '设置系统配色',
          language: '设置显示语言',
          dark_mode: '启用/禁用深色模式',
          fixed_navbar: '设置是否固定导航栏',
          sampling_clock: '设置数据采集间隔',
          data_retention: '设置数据保留期限'
        }
    },
    modal_window: {
      update: '更新',
      cancel: '取消',
    }
  },
  ko: {
    menu: {
      operation_condition: '운영 상태',
      dashboard: '대시보드',
      custom_dashboard: '커스텀 대시보드',
      trend: '트렌드',
      configurations: '설정',
      analytics: '분석',
      notifications: '알림',
      profile: '프로필',
      signIn: '로그인',
      signUp: '회원가입'
    },
    system_settings: {
        title: '시스템 설정',
        setting_item: '설정 항목',
        setting_value: '설정값',
        discription: '설명',
        system_color: '시스템 색상',
        language: '언어',
        dark_mode: '다크 모드',
        fixed_navbar: '고정 네비게이션 바',
        sampling_clock: '샘플링 주기',
        sampling_clock_unit: '샘플링 주기 단위',
        data_retention: '데이터 보존 기간',
        data_retention_unit: '데이터 보존 기간 단위',
        input_data_setting: '입력 데이터 설정',
        clock:{
          second: '초',
          minute: '분',
          hour: '시간',
          day: '일',
          week: '주',
          month: '월',
          year: '년'
        },
        descriptions: {
          system_color: '시스템 색상을 설정합니다',
          language: '표시 언어를 설정합니다',
          dark_mode: '다크 모드를 활성화/비활성화합니다',
          fixed_navbar: '네비게이션 바 고정 여부를 설정합니다',
          sampling_clock: '데이터 수집 주기를 설정합니다',
          data_retention: '데이터 보존 기간을 설정합니다'
        }
    },
    modal_window: {
      update: '업데이트',
      cancel: '취소',
    }
  }
}

export default createI18n({
  legacy: false,  // Vue 3では必須
  locale: savedLocale || 'ja',   // デフォルト言語
  fallbackLocale: 'en',  // フォールバック言語
  messages: translations
})