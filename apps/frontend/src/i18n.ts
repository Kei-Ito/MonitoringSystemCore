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
        edit_sampling_intervals: 'サンプリング周期を編集',
        interval: {
          name: '名前',
          add: '新しいサンプリング周期を追加'
        },
        clock:{
          second: '秒',
          minute: '分',
          hour: '時間',
          day: '日',
          week: '週',
          month: '月',
          year: '年'
        }
    },
    io_settings:{
      title: '入力設定',
      name: '名称',
      status: 'ステータス',
      created: '追加日',
    },
    system_control: {
      title: 'システム制御',
      description: 'システムの再起動またはシャットダウンを実行します。',
      shutdown: 'シャットダウン',
      reboot: '再起動',
      cancel: 'キャンセル',
      confirm_shutdown_title: 'シャットダウンの確認',
      confirm_shutdown_message: 'システムをシャットダウンしますか？この操作により、すべてのアプリケーションが終了します。',
      confirm_shutdown: 'シャットダウン',
      confirm_reboot_title: '再起動の確認',
      confirm_reboot_message: 'システムを再起動しますか？この操作により、すべてのアプリケーションが一時的に終了します。',
      confirm_reboot: '再起動',
      shutdown_success: 'システムをシャットダウンしています...',
      reboot_success: 'システムを再起動しています...',
      shutdown_error: 'シャットダウンに失敗しました',
      reboot_error: '再起動に失敗しました',
      shutting_down: 'シャットダウン中...',
      rebooting: '再起動中...',
    },
    modal_window: {
      update: '更新',
      cancel: 'キャンセル',
      delete: '削除',
      close: '閉じる',
    },
    trend: {
      select_date_range: '表示期間を選択',
    },
    chart: {
      settings: 'グラフ設定',
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
        edit_sampling_intervals: 'Edit Sampling Intervals',
        interval: {
          name: 'Name',
          add: 'Add New Sampling Interval'
        },
        clock:{
          second: 'sec',
          minute: 'min',
          hour: 'hr',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          year: 'Year'
        }
    },
    io_settings:{
      title: 'Input Settings',
      name: 'Name',
      status: 'Status',
      created: 'Created',
    },
    system_control: {
      title: 'System Control',
      description: 'You can reboot or shut down the system.',
      shutdown: 'Shutdown',
      reboot: 'Reboot',
      cancel: 'Cancel',
      confirm_shutdown_title: 'Confirm Shutdown',
      confirm_shutdown_message: 'Are you sure you want to shut down the system? This will close all applications.',
      confirm_shutdown: 'Execute Shutdown',
      confirm_reboot_title: 'Confirm Reboot',
      confirm_reboot_message: 'Are you sure you want to reboot the system? This will temporarily close all applications.',
      confirm_reboot: 'Execute Reboot',
      shutdown_success: 'System is shutting down...',
      reboot_success: 'System is rebooting...',
      shutdown_error: 'Failed to shutdown',
      reboot_error: 'Failed to reboot',
      shutting_down: 'Shutting down...',
      rebooting: 'Rebooting...',
    },
    modal_window: {
      update: 'Update',
      cancel: 'Cancel',
      delete: 'Delete',
      close: 'Close',
    },
    trend: {
      select_date_range: 'Select Date Range',
    },
    chart: {
      settings: 'Chart Settings',
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
        edit_sampling_intervals: '编辑采样周期',
        interval: {
          name: '名称',
          add: '添加新采样周期'
        },
        clock:{
          second: '秒',
          minute: '分钟',
          hour: '小时',
          day: '天',
          week: '周',
          month: '月',
          year: '年'
        }
    },
    io_settings: {
      title: '输入设置',
      name: '名称',
      status: '状态',
      created: '创建时间',
    },
    system_control: {
      title: '系统控制',
      description: '您可以重启或关闭系统。',
      shutdown: '关机',
      reboot: '重启',
      cancel: '取消',
      confirm_shutdown_title: '确认关机',
      confirm_shutdown_message: '您确定要关闭系统吗？这将关闭所有应用程序。',
      confirm_shutdown: '执行关机',
      confirm_reboot_title: '确认重启',
      confirm_reboot_message: '您确定要重启系统吗？这将暂时关闭所有应用程序。',
      confirm_reboot: '执行重启',
      shutdown_success: '系统正在关机...',
      reboot_success: '系统正在重启...',
      shutdown_error: '关机失败',
      reboot_error: '重启失败',
      shutting_down: '关机中...',
      rebooting: '重启中...',
    },
    modal_window: {
      update: '更新',
      cancel: '取消',
      delete: '删除',
      close: '关闭',
    },
    trend: {
      select_date_range: '选择日期范围',
    },
    chart: {
      settings: '图表设置',
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
        edit_sampling_intervals: '샘플링 주기 편집',
        interval: {
          name: '이름',
          add: '새 샘플링 주기 추가'
        },
        clock:{
          second: '초',
          minute: '분',
          hour: '시간',
          day: '일',
          week: '주',
          month: '월',
          year: '년'
        }
    },
    io_settings: {
      title: '입력 설정',
      name: '이름',
      status: '상태',
      created: '추가일',
    },
    system_control: {
      title: '시스템 제어',
      description: '시스템을 재시작하거나 종료할 수 있습니다.',
      shutdown: '종료',
      reboot: '재시작',
      cancel: '취소',
      confirm_shutdown_title: '종료 확인',
      confirm_shutdown_message: '시스템을 종료하시겠습니까? 이 작업은 모든 애플리케이션을 닫습니다.',
      confirm_shutdown: '종료 실행',
      confirm_reboot_title: '재시작 확인',
      confirm_reboot_message: '시스템을 재시작하시겠습니까? 이 작업은 모든 애플리케이션을 일시적으로 닫습니다.',
      confirm_reboot: '재시작 실행',
      shutdown_success: '시스템을 종료하는 중...',
      reboot_success: '시스템을 재시작하는 중...',
      shutdown_error: '종료 실패',
      reboot_error: '재시작 실패',
      shutting_down: '종료 중...',
      rebooting: '재시작 중...',
    },
    modal_window: {
      update: '업데이트',
      cancel: '취소',
      delete: '삭제',
      close: '닫기',
    },
    trend: {
      select_date_range: '날짜 범위 선택',
    },
    chart: {
      settings: '차트 설정',
    }
  }
}

export default createI18n({
  legacy: false,  // Vue 3では必須
  locale: savedLocale || 'ja',   // デフォルト言語
  fallbackLocale: 'en',  // フォールバック言語
  messages: translations
})