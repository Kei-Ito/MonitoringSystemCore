// src/mock/uiLayoutAPI.mock.ts
import { ChartTypes } from "@monitoring/shared/enum";
import { createChartForInitialization } from "@monitoring/shared/model";
var uiLayoutAPI_mock_default = [
  {
    url: "/api/ui/layouts/",
    method: "get",
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
            "chart_title": "\u6DB2\u6E29",
            "chart_unit": "\u2103",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u6DB2\u6E29"
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
            "chart_title": "UV\u5F37\u5EA6",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "UV\u5F37\u5EA6"
          },
          {
            "chart_uuid": "chart003",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid4"
            ],
            "chart_title": "\u7089\u5185\u6E29\u5EA6",
            "chart_unit": "\u2103",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u7089\u5185\u6E29\u5EA6"
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
            "chart_title": "\u30E9\u30F3\u30D7\u96FB\u5727",
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
                1e3
              ]
            },
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u30E9\u30F3\u30D7\u96FB\u5727"
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
            "chart_title": "\u30E9\u30F3\u30D7\u96FB\u6D41",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u30E9\u30F3\u30D7\u96FB\u6D41"
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
            "chart_title": "\u5B89\u5B9A\u5668\u96FB\u6D41",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u5B89\u5B9A\u5668\u96FB\u6D41"
          },
          {
            "chart_uuid": "chart007",
            "chart_type": "HorizontalBarChart",
            "channel_uuids": [
              "channel_mock_uuid7"
            ],
            "chart_title": "\u51B7\u5374\u30D5\u30A1\u30F3\u5468\u6CE2\u6570",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u51B7\u5374\u30D5\u30A1\u30F3\u5468\u6CE2\u6570"
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
            "chart_title": "\u6DB2\u6E29",
            "chart_unit": "\u2103",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u6DB2\u6E29"
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
            "chart_title": "UV\u5F37\u5EA6",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "UV\u5F37\u5EA6"
          },
          {
            "chart_uuid": "chart013",
            "chart_type": "LineChart",
            "channel_uuids": [
              "channel_mock_uuid4"
            ],
            "chart_title": "\u7089\u5185\u6E29\u5EA6",
            "chart_unit": "\u2103",
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
            "category1": "\u7167\u5C04\u70891",
            "category2": "\u7089\u5185\u6E29\u5EA6"
          }
        ]
      };
    }
  }
];
export {
  uiLayoutAPI_mock_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svdWlMYXlvdXRBUEkubW9jay50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJEOlxcXFxNb25pdG9yaW5nU3lzdGVtXFxcXE1vbml0b3JpbmdTeXN0ZW1Db3JlU2VydmljZVxcXFxhcHBzXFxcXGZyb250ZW5kXFxcXHNyY1xcXFxtb2NrXFxcXHVpTGF5b3V0QVBJLm1vY2sudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiRDpcXFxcTW9uaXRvcmluZ1N5c3RlbVxcXFxNb25pdG9yaW5nU3lzdGVtQ29yZVNlcnZpY2VcXFxcYXBwc1xcXFxmcm9udGVuZFxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRDovTW9uaXRvcmluZ1N5c3RlbS9Nb25pdG9yaW5nU3lzdGVtQ29yZVNlcnZpY2UvYXBwcy9mcm9udGVuZC9zcmMvbW9jay91aUxheW91dEFQSS5tb2NrLnRzXCI7aW1wb3J0IHsgQ2hhcnRUeXBlcyB9IGZyb20gJ0Btb25pdG9yaW5nL3NoYXJlZC9lbnVtJztcclxuaW1wb3J0IHsgdHlwZSBDaGFydENvbmZpZywgY3JlYXRlQ2hhcnRGb3JJbml0aWFsaXphdGlvbiB9IGZyb20gJ0Btb25pdG9yaW5nL3NoYXJlZC9tb2RlbCc7XHJcbmltcG9ydCB0eXBlIHsgTW9ja01ldGhvZCB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2snO1xyXG5cclxuZnVuY3Rpb24gZ2V0RGFzaGJvYXJkTGF5b3V0KCkge1xyXG4gIGNvbnN0IGRhc2hib2FyZExheW91dDogQ2hhcnRDb25maWdbXSA9IFtdXHJcbiAgY29uc3QgY2hhcnQxID0gY3JlYXRlQ2hhcnRGb3JJbml0aWFsaXphdGlvbihDaGFydFR5cGVzLkhvcml6b250YWxCYXJDaGFydCk7XHJcbiAgY2hhcnQxLmdyaWRfbGF5b3V0LmggPSA4O1xyXG4gIGNoYXJ0MS5jYXRlZ29yeTEgPSAnXHU3MTY3XHU1QzA0XHU3MDg5MSc7XHJcbiAgY2hhcnQxLmNhdGVnb3J5MiA9ICdcdTZEQjJcdTZFMjknO1xyXG4gIGNoYXJ0MS5jaGFydF90aXRsZSA9ICdzdXBlciBzcGVjaWFsIHZlcnkgdmVyeSBsb25nIHRleHQnO1xyXG4gIGNoYXJ0MS5jaGFydF91bml0ID0gJ1cvY20yJztcclxuICBjaGFydDEuY2hhbm5lbF91dWlkcyA9IFsnY2hhbm5lbF9tb2NrX3V1aWQwJywgJ2NoYW5uZWxfbW9ja191dWlkMScsICdjaGFubmVsX21vY2tfdXVpZDInLCAnY2hhbm5lbF9tb2NrX3V1aWQzJywgJ2NoYW5uZWxfbW9ja191dWlkNCcsICdjaGFubmVsX21vY2tfdXVpZDUnLCAnY2hhbm5lbF9tb2NrX3V1aWQ2JywgJ2NoYW5uZWxfbW9ja191dWlkNycsXTtcclxuICBjaGFydDEuZ3JpZF9sYXlvdXQgPSB7XHJcbiAgICAuLi5jaGFydDEuZ3JpZF9sYXlvdXQsXHJcbiAgICBoOiA4LFxyXG4gICAgdzogMTIsXHJcbiAgICB4OiAwLFxyXG4gICAgeTogMCxcclxuICB9XHJcblxyXG4gIGNvbnN0IGNoYXJ0MiA9IGNyZWF0ZUNoYXJ0Rm9ySW5pdGlhbGl6YXRpb24oQ2hhcnRUeXBlcy5Ib3Jpem9udGFsQmFyQ2hhcnQpO1xyXG4gIGNoYXJ0Mi5ncmlkX2xheW91dC5oID0gODtcclxuICBjaGFydDIuY2F0ZWdvcnkxID0gJ1x1NzE2N1x1NUMwNFx1NzA4OTEnO1xyXG4gIGNoYXJ0Mi5jYXRlZ29yeTIgPSAnXHU2REIyXHU2RTI5JztcclxuICBjaGFydDIuY2hhcnRfdGl0bGUgPSAnc3VwZXIgc3BlY2lhbCB2ZXJ5IHZlcnkgbG9uZyB0ZXh0JztcclxuICBjaGFydDIuY2hhcnRfdW5pdCA9ICdXL2NtMic7XHJcbiAgY2hhcnQyLmNoYW5uZWxfdXVpZHMgPSBbJ2NoYW5uZWxfbW9ja191dWlkMCcsICdjaGFubmVsX21vY2tfdXVpZDEnLCAnY2hhbm5lbF9tb2NrX3V1aWQyJywgJ2NoYW5uZWxfbW9ja191dWlkMycsICdjaGFubmVsX21vY2tfdXVpZDQnLCAnY2hhbm5lbF9tb2NrX3V1aWQ1JywgJ2NoYW5uZWxfbW9ja191dWlkNicsICdjaGFubmVsX21vY2tfdXVpZDcnLF07XHJcbiAgY2hhcnQyLmdyaWRfbGF5b3V0ID0ge1xyXG4gICAgLi4uY2hhcnQyLmdyaWRfbGF5b3V0LFxyXG4gICAgaDogOCxcclxuICAgIHc6IDEyLFxyXG4gICAgeDogMCxcclxuICAgIHk6IDAsXHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgY2F0ZWdvcnkyTGlzdCA9IFsnXHU2REIyXHU2RTI5JywgJ1VWXHU1RjM3XHU1RUE2JywgJ1x1NzA4OVx1NTE4NVx1NkUyOVx1NUVBNicsICdcdTMwRTlcdTMwRjNcdTMwRDdcdTk2RkJcdTU3MjcnLCAnXHUzMEU5XHUzMEYzXHUzMEQ3XHU5NkZCXHU2RDQxJywgJ1x1NUI4OVx1NUI5QVx1NTY2OFx1OTZGQlx1NkQ0MScsICdcdTUxQjdcdTUzNzRcdTMwRDVcdTMwQTFcdTMwRjNcdTU0NjhcdTZDRTJcdTY1NzAnLCBudWxsXTtcclxuICBkYXNoYm9hcmRMYXlvdXQucHVzaChjaGFydDEpO1xyXG4gIGRhc2hib2FyZExheW91dC5wdXNoKGNoYXJ0Mik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcclxuICAgIGxldCBjaGFydCA9IGNyZWF0ZUNoYXJ0Rm9ySW5pdGlhbGl6YXRpb24oQ2hhcnRUeXBlcy5HYXVnZUNoYXJ0KTtcclxuICAgIGNoYXJ0ID0ge1xyXG4gICAgICAuLi5jaGFydCxcclxuICAgICAgY2hhcnRfdGl0bGU6IGB0aXRsZSAke2l9YCxcclxuICAgICAgY2hhcnRfdW5pdDogJ3VuaXQnLFxyXG4gICAgICBjaGFubmVsX3V1aWRzOiBbYGNoYW5uZWxfbW9ja191dWlkJHtpfWBdLFxyXG4gICAgICBjYXRlZ29yeTE6ICdcdTcxNjdcdTVDMDRcdTcwODkxJyxcclxuICAgICAgY2F0ZWdvcnkyOiBjYXRlZ29yeTJMaXN0W2ldLFxyXG4gICAgICBncmlkX2xheW91dDoge1xyXG4gICAgICAgIC4uLmNoYXJ0LmdyaWRfbGF5b3V0LFxyXG4gICAgICAgIGg6IDgsXHJcbiAgICAgICAgdzogNCxcclxuICAgICAgICB4OiAoaSAlIDQpICogNCxcclxuICAgICAgICB5OiBNYXRoLmZsb29yKGkgLyA0KSAqIDgsXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGRhc2hib2FyZExheW91dC5wdXNoKGNoYXJ0KTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gZGFzaGJvYXJkTGF5b3V0O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlbmRMYXlvdXQoKSB7XHJcblxyXG5cclxuICBjb25zdCB0cmVuZExheW91dDogQ2hhcnRDb25maWdbXSA9IFtdXHJcbiAgY29uc3QgY2hhcnQxID0gY3JlYXRlQ2hhcnRGb3JJbml0aWFsaXphdGlvbihDaGFydFR5cGVzLkxpbmVDaGFydCk7XHJcbiAgY2hhcnQxLmdyaWRfbGF5b3V0LmggPSA4O1xyXG4gIGNoYXJ0MS5jYXRlZ29yeTEgPSAnXHU3MTY3XHU1QzA0XHU3MDg5MSc7XHJcbiAgY2hhcnQxLmNhdGVnb3J5MiA9ICdcdTZEQjJcdTZFMjknO1xyXG4gIGNoYXJ0MS5jaGFydF90aXRsZSA9ICdzdXBlciBzcGVjaWFsIHZlcnkgdmVyeSBsb25nIHRleHQnO1xyXG4gIGNoYXJ0MS5jaGFydF91bml0ID0gJ1cvY20yJztcclxuICBjaGFydDEuY2hhbm5lbF91dWlkcyA9IFsnY2hhbm5lbF9tb2NrX3V1aWQwJywgJ2NoYW5uZWxfbW9ja191dWlkMScsICdjaGFubmVsX21vY2tfdXVpZDInLCAnY2hhbm5lbF9tb2NrX3V1aWQzJywgJ2NoYW5uZWxfbW9ja191dWlkNCcsICdjaGFubmVsX21vY2tfdXVpZDUnLCAnY2hhbm5lbF9tb2NrX3V1aWQ2JywgJ2NoYW5uZWxfbW9ja191dWlkNyddO1xyXG4gIGNoYXJ0MS5ncmlkX2xheW91dCA9IHtcclxuICAgIC4uLmNoYXJ0MS5ncmlkX2xheW91dCxcclxuICAgIGg6IDEwLFxyXG4gICAgdzogMTIsXHJcbiAgICB4OiAwLFxyXG4gICAgeTogMCxcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBjYXRlZ29yeTJMaXN0ID0gWydcdTZEQjJcdTZFMjknLCAnVVZcdTVGMzdcdTVFQTYnLCAnXHU3MDg5XHU1MTg1XHU2RTI5XHU1RUE2JywgJ1x1MzBFOVx1MzBGM1x1MzBEN1x1OTZGQlx1NTcyNycsICdcdTMwRTlcdTMwRjNcdTMwRDdcdTk2RkJcdTZENDEnLCAnXHU1Qjg5XHU1QjlBXHU1NjY4XHU5NkZCXHU2RDQxJywgJ1x1NTFCN1x1NTM3NFx1MzBENVx1MzBBMVx1MzBGM1x1NTQ2OFx1NkNFMlx1NjU3MCcsIG51bGxdO1xyXG4gIHRyZW5kTGF5b3V0LnB1c2goY2hhcnQxKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcclxuICAgIGxldCBjaGFydCA9IGNyZWF0ZUNoYXJ0Rm9ySW5pdGlhbGl6YXRpb24oQ2hhcnRUeXBlcy5MaW5lQ2hhcnQpO1xyXG4gICAgY2hhcnQgPSB7XHJcbiAgICAgIC4uLmNoYXJ0LFxyXG4gICAgICBjaGFydF90aXRsZTogYHRpdGxlICR7aX1gLFxyXG4gICAgICBjaGFydF91bml0OiAndW5pdCcsXHJcbiAgICAgIGNoYW5uZWxfdXVpZHM6IFtgY2hhbm5lbF9tb2NrX3V1aWQke2l9YF0sXHJcbiAgICAgIGNhdGVnb3J5MTogJ1x1NzE2N1x1NUMwNFx1NzA4OTEnLFxyXG4gICAgICBjYXRlZ29yeTI6IGNhdGVnb3J5Mkxpc3RbaV0sXHJcbiAgICAgIGdyaWRfbGF5b3V0OiB7XHJcbiAgICAgICAgLi4uY2hhcnQuZ3JpZF9sYXlvdXQsXHJcbiAgICAgICAgaDogMTAsXHJcbiAgICAgICAgdzogNCxcclxuICAgICAgICB4OiAoaSAlIDQpICogNCxcclxuICAgICAgICB5OiBNYXRoLmZsb29yKGkgLyA0KSAqIDEwLFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0cmVuZExheW91dC5wdXNoKGNoYXJ0KTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gdHJlbmRMYXlvdXQ7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBbXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS91aS9sYXlvdXRzLycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBcImRhc2hib2FyZFwiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY2hhcnRfdXVpZFwiOiBcImNoYXJ0MDAxXCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdHlwZVwiOiBcIkhvcml6b250YWxCYXJDaGFydFwiLFxyXG4gICAgICAgICAgICBcImNoYW5uZWxfdXVpZHNcIjogW1xyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQwXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDFcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkMlwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQzXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDRcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkNVwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQ2XCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDdcIlxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3RpdGxlXCI6IFwiXHU2REIyXHU2RTI5XCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdW5pdFwiOiBcIlx1MjEwM1wiLFxyXG4gICAgICAgICAgICBcImdyaWRfbGF5b3V0XCI6IHtcclxuICAgICAgICAgICAgICBcImlcIjogXCJjaGFydDAwMVwiLFxyXG4gICAgICAgICAgICAgIFwieFwiOiAyLFxyXG4gICAgICAgICAgICAgIFwieVwiOiAwLFxyXG4gICAgICAgICAgICAgIFwid1wiOiAxMixcclxuICAgICAgICAgICAgICBcImhcIjogMTUsXHJcbiAgICAgICAgICAgICAgXCJzdGF0aWNcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgXCJtaW5XXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtaW5IXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhXXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhIXCI6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjaGFydF9vcHRpb25zXCI6IHtcclxuICAgICAgICAgICAgICBcIm1heFZhbHVlXCI6IDcwLFxyXG4gICAgICAgICAgICAgIFwibWluVmFsdWVcIjogMCxcclxuICAgICAgICAgICAgICBcImNvbG9yc1wiOiBbXHJcbiAgICAgICAgICAgICAgICBcIiM2NUI1ODFcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmNzMwMFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjRkY2RTc2XCJcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIFwidGhyZXNob2xkc1wiOiBbXHJcbiAgICAgICAgICAgICAgICA1NSxcclxuICAgICAgICAgICAgICAgIDYwXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MVwiOiBcIlx1NzE2N1x1NUMwNFx1NzA4OTFcIixcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTJcIjogXCJcdTZEQjJcdTZFMjlcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjaGFydF91dWlkXCI6IFwiY2hhcnQwMDJcIixcclxuICAgICAgICAgICAgXCJjaGFydF90eXBlXCI6IFwiSG9yaXpvbnRhbEJhckNoYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiY2hhbm5lbF91dWlkc1wiOiBbXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDBcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkMVwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQyXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDNcIlxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3RpdGxlXCI6IFwiVVZcdTVGMzdcdTVFQTZcIixcclxuICAgICAgICAgICAgXCJjaGFydF91bml0XCI6IFwiJVwiLFxyXG4gICAgICAgICAgICBcImdyaWRfbGF5b3V0XCI6IHtcclxuICAgICAgICAgICAgICBcImlcIjogXCJjaGFydDAwMlwiLFxyXG4gICAgICAgICAgICAgIFwieFwiOiAwLFxyXG4gICAgICAgICAgICAgIFwieVwiOiAxNSxcclxuICAgICAgICAgICAgICBcIndcIjogMTIsXHJcbiAgICAgICAgICAgICAgXCJoXCI6IDExLFxyXG4gICAgICAgICAgICAgIFwic3RhdGljXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIFwibWluV1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWluSFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4V1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4SFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfb3B0aW9uc1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJtYXhWYWx1ZVwiOiAxNTAsXHJcbiAgICAgICAgICAgICAgXCJtaW5WYWx1ZVwiOiAwLFxyXG4gICAgICAgICAgICAgIFwiY29sb3JzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiI0ZGNkU3NlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmY3MzAwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM2NUI1ODFcIlxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgXCJ0aHJlc2hvbGRzXCI6IFtcclxuICAgICAgICAgICAgICAgIDYwLFxyXG4gICAgICAgICAgICAgICAgNzBcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkxXCI6IFwiXHU3MTY3XHU1QzA0XHU3MDg5MVwiLFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MlwiOiBcIlVWXHU1RjM3XHU1RUE2XCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY2hhcnRfdXVpZFwiOiBcImNoYXJ0MDAzXCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdHlwZVwiOiBcIkhvcml6b250YWxCYXJDaGFydFwiLFxyXG4gICAgICAgICAgICBcImNoYW5uZWxfdXVpZHNcIjogW1xyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQ0XCJcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJjaGFydF90aXRsZVwiOiBcIlx1NzA4OVx1NTE4NVx1NkUyOVx1NUVBNlwiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3VuaXRcIjogXCJcdTIxMDNcIixcclxuICAgICAgICAgICAgXCJncmlkX2xheW91dFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJpXCI6IFwiY2hhcnQwMDNcIixcclxuICAgICAgICAgICAgICBcInhcIjogMCxcclxuICAgICAgICAgICAgICBcInlcIjogMjYsXHJcbiAgICAgICAgICAgICAgXCJ3XCI6IDEyLFxyXG4gICAgICAgICAgICAgIFwiaFwiOiA4LFxyXG4gICAgICAgICAgICAgIFwic3RhdGljXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIFwibWluV1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWluSFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4V1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4SFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfb3B0aW9uc1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJtYXhWYWx1ZVwiOiA5MCxcclxuICAgICAgICAgICAgICBcIm1pblZhbHVlXCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJjb2xvcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCIjNjVCNTgxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZjczMDBcIixcclxuICAgICAgICAgICAgICAgIFwiI0ZGNkU3NlwiXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICBcInRocmVzaG9sZHNcIjogW1xyXG4gICAgICAgICAgICAgICAgNzUsXHJcbiAgICAgICAgICAgICAgICA4MFxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTFcIjogXCJcdTcxNjdcdTVDMDRcdTcwODkxXCIsXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkyXCI6IFwiXHU3MDg5XHU1MTg1XHU2RTI5XHU1RUE2XCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY2hhcnRfdXVpZFwiOiBcImNoYXJ0MDA0XCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdHlwZVwiOiBcIkhvcml6b250YWxCYXJDaGFydFwiLFxyXG4gICAgICAgICAgICBcImNoYW5uZWxfdXVpZHNcIjogW1xyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQwXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDJcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkNFwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQ2XCJcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJjaGFydF90aXRsZVwiOiBcIlx1MzBFOVx1MzBGM1x1MzBEN1x1OTZGQlx1NTcyN1wiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3VuaXRcIjogXCJWXCIsXHJcbiAgICAgICAgICAgIFwiZ3JpZF9sYXlvdXRcIjoge1xyXG4gICAgICAgICAgICAgIFwiaVwiOiBcImNoYXJ0MDA0XCIsXHJcbiAgICAgICAgICAgICAgXCJ4XCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJ5XCI6IDM0LFxyXG4gICAgICAgICAgICAgIFwid1wiOiAxMixcclxuICAgICAgICAgICAgICBcImhcIjogMTEsXHJcbiAgICAgICAgICAgICAgXCJzdGF0aWNcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgXCJtaW5XXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtaW5IXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhXXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhIXCI6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjaGFydF9vcHRpb25zXCI6IHtcclxuICAgICAgICAgICAgICBcIm1heFZhbHVlXCI6IDEyMDAsXHJcbiAgICAgICAgICAgICAgXCJtaW5WYWx1ZVwiOiAwLFxyXG4gICAgICAgICAgICAgIFwiY29sb3JzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiI0ZGNkU3NlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmY3MzAwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM2NUI1ODFcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmNzMwMFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjRkY2RTc2XCJcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIFwidGhyZXNob2xkc1wiOiBbXHJcbiAgICAgICAgICAgICAgICA0NTAsXHJcbiAgICAgICAgICAgICAgICA0NzAsXHJcbiAgICAgICAgICAgICAgICA5NTAsXHJcbiAgICAgICAgICAgICAgICAxMDAwXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MVwiOiBcIlx1NzE2N1x1NUMwNFx1NzA4OTFcIixcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTJcIjogXCJcdTMwRTlcdTMwRjNcdTMwRDdcdTk2RkJcdTU3MjdcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjaGFydF91dWlkXCI6IFwiY2hhcnQwMDVcIixcclxuICAgICAgICAgICAgXCJjaGFydF90eXBlXCI6IFwiSG9yaXpvbnRhbEJhckNoYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiY2hhbm5lbF91dWlkc1wiOiBbXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDFcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkM1wiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQ1XCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDdcIlxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3RpdGxlXCI6IFwiXHUzMEU5XHUzMEYzXHUzMEQ3XHU5NkZCXHU2RDQxXCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdW5pdFwiOiBcIkFcIixcclxuICAgICAgICAgICAgXCJncmlkX2xheW91dFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJpXCI6IFwiY2hhcnQwMDVcIixcclxuICAgICAgICAgICAgICBcInhcIjogMCxcclxuICAgICAgICAgICAgICBcInlcIjogNDUsXHJcbiAgICAgICAgICAgICAgXCJ3XCI6IDEyLFxyXG4gICAgICAgICAgICAgIFwiaFwiOiAxMSxcclxuICAgICAgICAgICAgICBcInN0YXRpY1wiOiBmYWxzZSxcclxuICAgICAgICAgICAgICBcIm1pbldcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1pbkhcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heFdcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heEhcIjogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNoYXJ0X29wdGlvbnNcIjoge1xyXG4gICAgICAgICAgICAgIFwibWF4VmFsdWVcIjogOSxcclxuICAgICAgICAgICAgICBcIm1pblZhbHVlXCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJjb2xvcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCIjRkY2RTc2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZjczMDBcIixcclxuICAgICAgICAgICAgICAgIFwiIzY1QjU4MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmY3MzAwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNGRjZFNzZcIlxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgXCJ0aHJlc2hvbGRzXCI6IFtcclxuICAgICAgICAgICAgICAgIDEuNSxcclxuICAgICAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgICAgICA1LFxyXG4gICAgICAgICAgICAgICAgNS41XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MVwiOiBcIlx1NzE2N1x1NUMwNFx1NzA4OTFcIixcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTJcIjogXCJcdTMwRTlcdTMwRjNcdTMwRDdcdTk2RkJcdTZENDFcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjaGFydF91dWlkXCI6IFwiY2hhcnQwMDZcIixcclxuICAgICAgICAgICAgXCJjaGFydF90eXBlXCI6IFwiSG9yaXpvbnRhbEJhckNoYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiY2hhbm5lbF91dWlkc1wiOiBbXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDBcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkMVwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQyXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDNcIlxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3RpdGxlXCI6IFwiXHU1Qjg5XHU1QjlBXHU1NjY4XHU5NkZCXHU2RDQxXCIsXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdW5pdFwiOiBcIkFcIixcclxuICAgICAgICAgICAgXCJncmlkX2xheW91dFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJpXCI6IFwiY2hhcnQwMDZcIixcclxuICAgICAgICAgICAgICBcInhcIjogMCxcclxuICAgICAgICAgICAgICBcInlcIjogNTYsXHJcbiAgICAgICAgICAgICAgXCJ3XCI6IDEyLFxyXG4gICAgICAgICAgICAgIFwiaFwiOiAxMSxcclxuICAgICAgICAgICAgICBcInN0YXRpY1wiOiBmYWxzZSxcclxuICAgICAgICAgICAgICBcIm1pbldcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1pbkhcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heFdcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heEhcIjogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNoYXJ0X29wdGlvbnNcIjoge1xyXG4gICAgICAgICAgICAgIFwibWF4VmFsdWVcIjogMTcsXHJcbiAgICAgICAgICAgICAgXCJtaW5WYWx1ZVwiOiAwLFxyXG4gICAgICAgICAgICAgIFwiY29sb3JzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiI0ZGNkU3NlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmY3MzAwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM2NUI1ODFcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmNzMwMFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjRkY2RTc2XCJcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIFwidGhyZXNob2xkc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAxMCxcclxuICAgICAgICAgICAgICAgIDEwLjUsXHJcbiAgICAgICAgICAgICAgICAxNC41LFxyXG4gICAgICAgICAgICAgICAgMTVcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkxXCI6IFwiXHU3MTY3XHU1QzA0XHU3MDg5MVwiLFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MlwiOiBcIlx1NUI4OVx1NUI5QVx1NTY2OFx1OTZGQlx1NkQ0MVwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNoYXJ0X3V1aWRcIjogXCJjaGFydDAwN1wiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3R5cGVcIjogXCJIb3Jpem9udGFsQmFyQ2hhcnRcIixcclxuICAgICAgICAgICAgXCJjaGFubmVsX3V1aWRzXCI6IFtcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkN1wiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdGl0bGVcIjogXCJcdTUxQjdcdTUzNzRcdTMwRDVcdTMwQTFcdTMwRjNcdTU0NjhcdTZDRTJcdTY1NzBcIixcclxuICAgICAgICAgICAgXCJjaGFydF91bml0XCI6IFwiSHpcIixcclxuICAgICAgICAgICAgXCJncmlkX2xheW91dFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJpXCI6IFwiY2hhcnQwMDdcIixcclxuICAgICAgICAgICAgICBcInhcIjogMCxcclxuICAgICAgICAgICAgICBcInlcIjogNjcsXHJcbiAgICAgICAgICAgICAgXCJ3XCI6IDEyLFxyXG4gICAgICAgICAgICAgIFwiaFwiOiA4LFxyXG4gICAgICAgICAgICAgIFwic3RhdGljXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIFwibWluV1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWluSFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4V1wiOiBudWxsLFxyXG4gICAgICAgICAgICAgIFwibWF4SFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfb3B0aW9uc1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJtYXhWYWx1ZVwiOiA3MCxcclxuICAgICAgICAgICAgICBcIm1pblZhbHVlXCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJjb2xvcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCIjNjVCNTgxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM2NUI1ODFcIlxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgXCJ0aHJlc2hvbGRzXCI6IFtcclxuICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkxXCI6IFwiXHU3MTY3XHU1QzA0XHU3MDg5MVwiLFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MlwiOiBcIlx1NTFCN1x1NTM3NFx1MzBENVx1MzBBMVx1MzBGM1x1NTQ2OFx1NkNFMlx1NjU3MFwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcInRyZW5kXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjaGFydF91dWlkXCI6IFwiY2hhcnQwMTFcIixcclxuICAgICAgICAgICAgXCJjaGFydF90eXBlXCI6IFwiTGluZUNoYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiY2hhbm5lbF91dWlkc1wiOiBbXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDBcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkMVwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQyXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDNcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkNFwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQ1XCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDZcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkN1wiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdGl0bGVcIjogXCJcdTZEQjJcdTZFMjlcIixcclxuICAgICAgICAgICAgXCJjaGFydF91bml0XCI6IFwiXHUyMTAzXCIsXHJcbiAgICAgICAgICAgIFwiZ3JpZF9sYXlvdXRcIjoge1xyXG4gICAgICAgICAgICAgIFwiaVwiOiBcImNoYXJ0MDExXCIsXHJcbiAgICAgICAgICAgICAgXCJ4XCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJ5XCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJ3XCI6IDEyLFxyXG4gICAgICAgICAgICAgIFwiaFwiOiAxMSxcclxuICAgICAgICAgICAgICBcInN0YXRpY1wiOiBmYWxzZSxcclxuICAgICAgICAgICAgICBcIm1pbldcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1pbkhcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heFdcIjogbnVsbCxcclxuICAgICAgICAgICAgICBcIm1heEhcIjogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNoYXJ0X29wdGlvbnNcIjoge1xyXG4gICAgICAgICAgICAgIFwidGhyZXNob2xkc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcIm1heFwiOiA2MCxcclxuICAgICAgICAgICAgICAgIFwibWluXCI6IC0xMCxcclxuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjRkYwMDAwXCJcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkxXCI6IFwiXHU3MTY3XHU1QzA0XHU3MDg5MVwiLFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MlwiOiBcIlx1NkRCMlx1NkUyOVwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNoYXJ0X3V1aWRcIjogXCJjaGFydDAxMlwiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3R5cGVcIjogXCJMaW5lQ2hhcnRcIixcclxuICAgICAgICAgICAgXCJjaGFubmVsX3V1aWRzXCI6IFtcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkMFwiLFxyXG4gICAgICAgICAgICAgIFwiY2hhbm5lbF9tb2NrX3V1aWQxXCIsXHJcbiAgICAgICAgICAgICAgXCJjaGFubmVsX21vY2tfdXVpZDJcIixcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkM1wiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdGl0bGVcIjogXCJVVlx1NUYzN1x1NUVBNlwiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3VuaXRcIjogXCIlXCIsXHJcbiAgICAgICAgICAgIFwiZ3JpZF9sYXlvdXRcIjoge1xyXG4gICAgICAgICAgICAgIFwiaVwiOiBcImNoYXJ0MDEyXCIsXHJcbiAgICAgICAgICAgICAgXCJ4XCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJ5XCI6IDExLFxyXG4gICAgICAgICAgICAgIFwid1wiOiAxMixcclxuICAgICAgICAgICAgICBcImhcIjogMTEsXHJcbiAgICAgICAgICAgICAgXCJzdGF0aWNcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgXCJtaW5XXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtaW5IXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhXXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhIXCI6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjaGFydF9vcHRpb25zXCI6IHtcclxuICAgICAgICAgICAgICBcInRocmVzaG9sZHNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJtYXhcIjogMjAwLFxyXG4gICAgICAgICAgICAgICAgXCJtaW5cIjogNTAsXHJcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI0ZGMDAwMFwiXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNhdGVnb3J5MVwiOiBcIlx1NzE2N1x1NUMwNFx1NzA4OTFcIixcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTJcIjogXCJVVlx1NUYzN1x1NUVBNlwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNoYXJ0X3V1aWRcIjogXCJjaGFydDAxM1wiLFxyXG4gICAgICAgICAgICBcImNoYXJ0X3R5cGVcIjogXCJMaW5lQ2hhcnRcIixcclxuICAgICAgICAgICAgXCJjaGFubmVsX3V1aWRzXCI6IFtcclxuICAgICAgICAgICAgICBcImNoYW5uZWxfbW9ja191dWlkNFwiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwiY2hhcnRfdGl0bGVcIjogXCJcdTcwODlcdTUxODVcdTZFMjlcdTVFQTZcIixcclxuICAgICAgICAgICAgXCJjaGFydF91bml0XCI6IFwiXHUyMTAzXCIsXHJcbiAgICAgICAgICAgIFwiZ3JpZF9sYXlvdXRcIjoge1xyXG4gICAgICAgICAgICAgIFwiaVwiOiBcImNoYXJ0MDEzXCIsXHJcbiAgICAgICAgICAgICAgXCJ4XCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJ5XCI6IDIyLFxyXG4gICAgICAgICAgICAgIFwid1wiOiAxMixcclxuICAgICAgICAgICAgICBcImhcIjogMTEsXHJcbiAgICAgICAgICAgICAgXCJzdGF0aWNcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgXCJtaW5XXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtaW5IXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhXXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgXCJtYXhIXCI6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjaGFydF9vcHRpb25zXCI6IHtcclxuICAgICAgICAgICAgICBcInRocmVzaG9sZHNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJtYXhcIjogODAsXHJcbiAgICAgICAgICAgICAgICBcIm1pblwiOiAwLFxyXG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNGRjAwMDBcIlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjYXRlZ29yeTFcIjogXCJcdTcxNjdcdTVDMDRcdTcwODkxXCIsXHJcbiAgICAgICAgICAgIFwiY2F0ZWdvcnkyXCI6IFwiXHU3MDg5XHU1MTg1XHU2RTI5XHU1RUE2XCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbl0gYXMgTW9ja01ldGhvZFtdOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1gsU0FBUyxrQkFBa0I7QUFDblosU0FBMkIsb0NBQW9DO0FBZ0gvRCxJQUFPLDJCQUFRO0FBQUEsRUFDYjtBQUFBLElBQ0UsS0FBSztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsVUFBVSxNQUFNO0FBQ2QsYUFBTztBQUFBLFFBQ0wsYUFBYTtBQUFBLFVBQ1g7QUFBQSxZQUNFLGNBQWM7QUFBQSxZQUNkLGNBQWM7QUFBQSxZQUNkLGlCQUFpQjtBQUFBLGNBQ2Y7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsWUFBWTtBQUFBLGNBQ1osWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxnQkFDQTtBQUFBLGNBQ0Y7QUFBQSxjQUNBLGNBQWM7QUFBQSxnQkFDWjtBQUFBLGdCQUNBO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxZQUNBLGFBQWE7QUFBQSxZQUNiLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQTtBQUFBLFlBQ0UsY0FBYztBQUFBLFlBQ2QsY0FBYztBQUFBLFlBQ2QsaUJBQWlCO0FBQUEsY0FDZjtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLFlBQ0Y7QUFBQSxZQUNBLGVBQWU7QUFBQSxZQUNmLGNBQWM7QUFBQSxZQUNkLGVBQWU7QUFBQSxjQUNiLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLFVBQVU7QUFBQSxjQUNWLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQSxpQkFBaUI7QUFBQSxjQUNmLFlBQVk7QUFBQSxjQUNaLFlBQVk7QUFBQSxjQUNaLFVBQVU7QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDQTtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsWUFDQSxhQUFhO0FBQUEsWUFDYixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0E7QUFBQSxZQUNFLGNBQWM7QUFBQSxZQUNkLGNBQWM7QUFBQSxZQUNkLGlCQUFpQjtBQUFBLGNBQ2Y7QUFBQSxZQUNGO0FBQUEsWUFDQSxlQUFlO0FBQUEsWUFDZixjQUFjO0FBQUEsWUFDZCxlQUFlO0FBQUEsY0FDYixLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxVQUFVO0FBQUEsY0FDVixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsaUJBQWlCO0FBQUEsY0FDZixZQUFZO0FBQUEsY0FDWixZQUFZO0FBQUEsY0FDWixVQUFVO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsY0FDRjtBQUFBLGNBQ0EsY0FBYztBQUFBLGdCQUNaO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxpQkFBaUI7QUFBQSxjQUNmO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsWUFBWTtBQUFBLGNBQ1osWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxpQkFBaUI7QUFBQSxjQUNmO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsWUFBWTtBQUFBLGNBQ1osWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxpQkFBaUI7QUFBQSxjQUNmO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsWUFBWTtBQUFBLGNBQ1osWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxpQkFBaUI7QUFBQSxjQUNmO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsWUFBWTtBQUFBLGNBQ1osWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxjQUNGO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsY0FBYztBQUFBLFlBQ2QsY0FBYztBQUFBLFlBQ2QsaUJBQWlCO0FBQUEsY0FDZjtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxZQUNGO0FBQUEsWUFDQSxlQUFlO0FBQUEsWUFDZixjQUFjO0FBQUEsWUFDZCxlQUFlO0FBQUEsY0FDYixLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTCxVQUFVO0FBQUEsY0FDVixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsaUJBQWlCO0FBQUEsY0FDZixjQUFjO0FBQUEsZ0JBQ1osT0FBTztBQUFBLGdCQUNQLE9BQU87QUFBQSxnQkFDUCxTQUFTO0FBQUEsY0FDWDtBQUFBLFlBQ0Y7QUFBQSxZQUNBLGFBQWE7QUFBQSxZQUNiLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQTtBQUFBLFlBQ0UsY0FBYztBQUFBLFlBQ2QsY0FBYztBQUFBLFlBQ2QsaUJBQWlCO0FBQUEsY0FDZjtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLFlBQ0Y7QUFBQSxZQUNBLGVBQWU7QUFBQSxZQUNmLGNBQWM7QUFBQSxZQUNkLGVBQWU7QUFBQSxjQUNiLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLEtBQUs7QUFBQSxjQUNMLFVBQVU7QUFBQSxjQUNWLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQSxpQkFBaUI7QUFBQSxjQUNmLGNBQWM7QUFBQSxnQkFDWixPQUFPO0FBQUEsZ0JBQ1AsT0FBTztBQUFBLGdCQUNQLFNBQVM7QUFBQSxjQUNYO0FBQUEsWUFDRjtBQUFBLFlBQ0EsYUFBYTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxpQkFBaUI7QUFBQSxjQUNmO0FBQUEsWUFDRjtBQUFBLFlBQ0EsZUFBZTtBQUFBLFlBQ2YsY0FBYztBQUFBLFlBQ2QsZUFBZTtBQUFBLGNBQ2IsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsS0FBSztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGlCQUFpQjtBQUFBLGNBQ2YsY0FBYztBQUFBLGdCQUNaLE9BQU87QUFBQSxnQkFDUCxPQUFPO0FBQUEsZ0JBQ1AsU0FBUztBQUFBLGNBQ1g7QUFBQSxZQUNGO0FBQUEsWUFDQSxhQUFhO0FBQUEsWUFDYixhQUFhO0FBQUEsVUFDZjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
