import type { MockMethod } from 'vite-plugin-mock';


export default [
  {
    url: '/api/ui/layouts/',
    method: 'get',
    response: () => {
      return {
        "dashboard": [
          {
            "chart_uuid": "chart001",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid1",
              "channel_mock_uuid2",
              "channel_mock_uuid3",
              "channel_mock_uuid4",
              "channel_mock_uuid5",
              "channel_mock_uuid6",
              "channel_mock_uuid7"
            ],
            "chart_title": "液温",
            "chart_unit": "℃",
            "grid_layout": {
              "i": "chart001",
              "x": 2,
              "y": 0,
              "w": 12,
              "h": 15,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 70,
              "minValue": 0,
              "colors": [
                "#65B581",
                "#ff7300",
                "#FF6E76"
              ],
              "thresholds": [
                55,
                60
              ]
            },
            "category1": "照射炉1",
            "category2": "液温"
          },
          {
            "chart_uuid": "chart002",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid1",
              "channel_mock_uuid2",
              "channel_mock_uuid3"
            ],
            "chart_title": "UV強度",
            "chart_unit": "%",
            "grid_layout": {
              "i": "chart002",
              "x": 0,
              "y": 15,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 150,
              "minValue": 0,
              "colors": [
                "#FF6E76",
                "#ff7300",
                "#65B581"
              ],
              "thresholds": [
                60,
                70
              ]
            },
            "category1": "照射炉1",
            "category2": "UV強度"
          },
          {
            "chart_uuid": "chart003",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid4"
            ],
            "chart_title": "炉内温度",
            "chart_unit": "℃",
            "grid_layout": {
              "i": "chart003",
              "x": 0,
              "y": 26,
              "w": 12,
              "h": 8,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 90,
              "minValue": 0,
              "colors": [
                "#65B581",
                "#ff7300",
                "#FF6E76"
              ],
              "thresholds": [
                75,
                80
              ]
            },
            "category1": "照射炉1",
            "category2": "炉内温度"
          },
          {
            "chart_uuid": "chart004",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid2",
              "channel_mock_uuid4",
              "channel_mock_uuid6"
            ],
            "chart_title": "ランプ電圧",
            "chart_unit": "V",
            "grid_layout": {
              "i": "chart004",
              "x": 0,
              "y": 34,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 1200,
              "minValue": 0,
              "colors": [
                "#FF6E76",
                "#ff7300",
                "#65B581",
                "#ff7300",
                "#FF6E76"
              ],
              "thresholds": [
                450,
                470,
                950,
                1000
              ]
            },
            "category1": "照射炉1",
            "category2": "ランプ電圧"
          },
          {
            "chart_uuid": "chart005",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid1",
              "channel_mock_uuid3",
              "channel_mock_uuid5",
              "channel_mock_uuid7"
            ],
            "chart_title": "ランプ電流",
            "chart_unit": "A",
            "grid_layout": {
              "i": "chart005",
              "x": 0,
              "y": 45,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 9,
              "minValue": 0,
              "colors": [
                "#FF6E76",
                "#ff7300",
                "#65B581",
                "#ff7300",
                "#FF6E76"
              ],
              "thresholds": [
                1.5,
                2,
                5,
                5.5
              ]
            },
            "category1": "照射炉1",
            "category2": "ランプ電流"
          },
          {
            "chart_uuid": "chart006",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid1",
              "channel_mock_uuid2",
              "channel_mock_uuid3"
            ],
            "chart_title": "安定器電流",
            "chart_unit": "A",
            "grid_layout": {
              "i": "chart006",
              "x": 0,
              "y": 56,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 17,
              "minValue": 0,
              "colors": [
                "#FF6E76",
                "#ff7300",
                "#65B581",
                "#ff7300",
                "#FF6E76"
              ],
              "thresholds": [
                10,
                10.5,
                14.5,
                15
              ]
            },
            "category1": "照射炉1",
            "category2": "安定器電流"
          },
          {
            "chart_uuid": "chart007",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid7"
            ],
            "chart_title": "冷却ファン周波数",
            "chart_unit": "Hz",
            "grid_layout": {
              "i": "chart007",
              "x": 0,
              "y": 67,
              "w": 12,
              "h": 8,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "maxValue": 70,
              "minValue": 0,
              "colors": [
                "#65B581",
                "#65B581"
              ],
              "thresholds": [
                0
              ]
            },
            "category1": "照射炉1",
            "category2": "冷却ファン周波数"
          }
        ],
        "trend": [
          {
            "chart_uuid": "chart011",
            "chart_type": "LineChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid1",
              "channel_mock_uuid2",
              "channel_mock_uuid3",
              "channel_mock_uuid4",
              "channel_mock_uuid5",
              "channel_mock_uuid6",
              "channel_mock_uuid7"
            ],
            "chart_title": "液温",
            "chart_unit": "℃",
            "grid_layout": {
              "i": "chart011",
              "x": 0,
              "y": 0,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "thresholds": {
                "max": 60,
                "min": -10,
                "color": "#FF0000"
              }
            },
            "category1": "照射炉1",
            "category2": "液温"
          },
          {
            "chart_uuid": "chart012",
            "chart_type": "LineChart",
            "channel_uuids": [
              "channel_mock_uuid0",
              "channel_mock_uuid1",
              "channel_mock_uuid2",
              "channel_mock_uuid3"
            ],
            "chart_title": "UV強度",
            "chart_unit": "%",
            "grid_layout": {
              "i": "chart012",
              "x": 0,
              "y": 11,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "thresholds": {
                "max": 200,
                "min": 50,
                "color": "#FF0000"
              }
            },
            "category1": "照射炉1",
            "category2": "UV強度"
          },
          {
            "chart_uuid": "chart013",
            "chart_type": "LineChart",
            "channel_uuids": [
              "channel_mock_uuid4"
            ],
            "chart_title": "炉内温度",
            "chart_unit": "℃",
            "grid_layout": {
              "i": "chart013",
              "x": 0,
              "y": 22,
              "w": 12,
              "h": 11,
              "static": false,
              "minW": null,
              "minH": null,
              "maxW": null,
              "maxH": null
            },
            "chart_options": {
              "thresholds": {
                "max": 80,
                "min": 0,
                "color": "#FF0000"
              }
            },
            "category1": "照射炉1",
            "category2": "炉内温度"
          }
        ]
      };
    },
  },
] as MockMethod[];