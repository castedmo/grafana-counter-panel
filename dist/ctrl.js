'use strict';

System.register(['app/plugins/sdk', 'lodash', 'jquery', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2', './css/counter.css!', './external/flipclock.css!', './external/flipclock.min.js'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, $, kbn, config, TimeSeries, _createClass, panelDefaults, CounterPanelCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function getColorForValue(data, value) {
    for (var i = data.thresholds.length; i > 0; i--) {
      if (value >= data.thresholds[i - 1]) {
        return data.colorMap[i];
      }
    }
    return _.first(data.colorMap);
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_cssCounterCss) {}, function (_externalFlipclockCss) {}, function (_externalFlipclockMinJs) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        fontSizes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70],
        fontTypes: ['Arial', 'Avant Garde', 'Bookman', 'Consolas', 'Courier', 'Courier New', 'Garamond', 'Helvetica', 'Open Sans', 'Palatino', 'Times', 'Times New Roman', 'Verdana'],
        unitFormats: kbn.getUnitFormats(),
        operatorNameOptions: ['min', 'max', 'avg', 'current', 'total', 'name'],
        valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
        mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
        rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
        mappingType: 1,
        thresholds: '',
        colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
        decimals: 2, // decimal precision
        format: 'none', // unit format
        operatorName: 'total', // operator applied to time series
        refreshMinSec: 60
        //digitColor: "#ccc",
        //backColor: "rgb(147, 238, 132)",
      };

      _export('MetricsPanelCtrl', _export('CounterPanelCtrl', CounterPanelCtrl = function (_MetricsPanelCtrl) {
        _inherits(CounterPanelCtrl, _MetricsPanelCtrl);

        function CounterPanelCtrl($scope, $injector, alertSrv) {
          _classCallCheck(this, CounterPanelCtrl);

          var _this = _possibleConstructorReturn(this, (CounterPanelCtrl.__proto__ || Object.getPrototypeOf(CounterPanelCtrl)).call(this, $scope, $injector));

          // merge existing settings with our defaults
          _.defaults(_this.panel, panelDefaults);
          _this.scoperef = $scope;
          _this.alertSrvRef = alertSrv;
          _this.initialized = false;
          _this.panelContainer = null;
          _this.panelWidth = null;
          _this.panelHeight = null;
          _this.data = {
            value: 0,
            valueFormatted: 0,
            valueRounded: 0
          };
          _this.series = [];
          _this.statCounter = new FlipClock(_this.elem, 0, {
            clockFace: 'Counter',
            countdown: true
          });
          _this.statChangeInterval = null;
          _this.lastRefreshTime = new Date(2016, 1, 1, 1, 1, 1);
          _this.newData = false;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          return _this;
        }

        _createClass(CounterPanelCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            var panels = grafanaBootData.settings.panels;
            var thisPanel = panels[this.pluginId];
            var thisPanelPath = thisPanel.baseUrl + '/';
            var optionsPath = thisPanelPath + 'partials/editor.options.html';
            this.addEditorTab('Options', optionsPath, 2);
          }
        }, {
          key: 'setContainer',
          value: function setContainer(container) {
            this.panelContainer = container;
          }
        }, {
          key: 'getPanelWidth',
          value: function getPanelWidth() {
            // with a full sized panel, this comes back as zero, so calculate from the div panel instead
            //debugger;
            var tmpPanelWidth = this.panelContainer[0].clientWidth;
            if (tmpPanelWidth === 0) {
              // just use the height...
              tmpPanelWidth = this.getPanelHeight();
              tmpPanelWidth -= 24;
              if (tmpPanelWidth < 250) {
                tmpPanelWidth = 250;
              }
              return tmpPanelWidth;
              //var tmpPanelWidthCSS = $("div.panel").css("width");
              //var tmpPanelWidthPx = tmpPanelWidthCSS.replace("px","");
              //tmpPanelWidth = parseInt(tmpPanelWidthPx);
            }
            var actualWidth = tmpPanelWidth;
            return actualWidth;
          }
        }, {
          key: 'getPanelHeight',
          value: function getPanelHeight() {
            // panel can have a fixed height via options
            var tmpPanelHeight = this.$scope.ctrl.panel.height;
            // if that is blank, try to get it from our row
            if (typeof tmpPanelHeight === 'undefined') {
              // get from the row instead
              tmpPanelHeight = this.row.height;
              // default to 250px if that was undefined also
              if (typeof tmpPanelHeight === 'undefined') {
                tmpPanelHeight = 250;
              }
            } else {
              // convert to numeric value
              tmpPanelHeight = tmpPanelHeight.replace("px", "");
            }
            var actualHeight = parseInt(tmpPanelHeight);
            // grafana minimum height for a panel is 250px
            if (actualHeight < 250) {
              actualHeight = 250;
            }
            return actualHeight;
          }
        }, {
          key: 'changeRefresh',
          value: function changeRefresh() {}
        }, {
          key: 'onRender',
          value: function onRender() {
            ///this.setValues(this.data);
            if (typeof this.data.value !== 'undefined') {
              this.parentElem.find('.grafana-stat-counter-value-container').css('height', this.height + 'px');
              if ($('.grafana-stat-counter-value').children().length === 0) {
                this.statCounter = angular.element('.grafana-stat-counter-value').FlipClock(this.data.value, {
                  clockFace: 'Counter',
                  countdown: true
                });
              }
              //      else
              //        this.statCounter.setTime(this.data.value);

              if (this.newData && typeof this.series[0] !== 'undefined' && _.size(this.series[0].datapoints) > 1) {
                this.newData = false;
                var dataPoints = this.series[0].datapoints;
                var whole = this.data.value;
                //for (var i=0; i<dataPoints.length; i++)
                //whole += dataPoints[i][0];

                var lastPoint = dataPoints[dataPoints.length - 1];
                var prevPoint = dataPoints[dataPoints.length - 2];
                var timeDiff = lastPoint[1] - prevPoint[1];
                var rate = Math.floor(timeDiff / lastPoint[0]);
                this.statCounter.setTime(whole - lastPoint[0]);
                if (rate > 0) {
                  if (this.statChangeInterval) clearInterval(this.statChangeInterval);
                  var sc = this.statCounter;
                  if (isFinite(rate)) {
                    this.statChangeInterval = setInterval(function () {
                      //for (var i=0; i<7; i++)
                      sc.increment();
                    }, rate);
                  }
                }
              }
            }
            //setElementHeight();
          }
        }, {
          key: 'removeValueMap',
          value: function removeValueMap(map) {
            var index = _.indexOf(this.panel.valueMaps, map);
            this.panel.valueMaps.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addValueMap',
          value: function addValueMap() {
            this.panel.valueMaps.push({ value: '', op: '=', text: '' });
          }
        }, {
          key: 'removeRangeMap',
          value: function removeRangeMap(rangeMap) {
            var index = _.indexOf(this.panel.rangeMaps, rangeMap);
            this.panel.rangeMaps.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addRangeMap',
          value: function addRangeMap() {
            this.panel.rangeMaps.push({ from: '', to: '', text: '' });
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var $panelContainer = elem.find('.panel-container');
            this.parentElem = elem.find('.grafana-stat-counter');
            ctrl.setContainer(this.parentElem);
            this.elem = this.parentElem.find('.grafana-stat-counter-value');
            //ctrl.setContainer(elem.find('.panel-container'));

            this.render();
          }
        }, {
          key: 'getDecimalsForValue',
          value: function getDecimalsForValue(value) {
            if (_.isNumber(this.panel.decimals)) {
              return { decimals: this.panel.decimals, scaledDecimals: null };
            }

            var delta = value / 2;
            var dec = -Math.floor(Math.log(delta) / Math.LN10);

            var magn = Math.pow(10, -dec),
                norm = delta / magn,
                // norm is between 1.0 and 10.0
            size;

            if (norm < 1.5) {
              size = 1;
            } else if (norm < 3) {
              size = 2;
              // special case for 2.5, requires an extra decimal
              if (norm > 2.25) {
                size = 2.5;
                ++dec;
              }
            } else if (norm < 7.5) {
              size = 5;
            } else {
              size = 10;
            }

            size *= magn;

            // reduce starting decimals if not needed
            if (Math.floor(value) === value) {
              dec = 0;
            }

            var result = {};
            result.decimals = Math.max(0, dec);
            result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
            return result;
          }
        }, {
          key: 'setValues',
          value: function setValues(data) {
            data.flotpairs = [];
            if (this.series.length > 1) {
              var error = new Error();
              error.message = 'Multiple Series Error';
              error.data = 'Metric query returns ' + this.series.length + ' series. Single Stat Panel expects a single series.\n\nResponse:\n' + JSON.stringify(this.series);
              throw error;
            }

            if (this.series && this.series.length > 0) {
              var lastPoint = _.last(this.series[0].datapoints);
              var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;

              if (this.panel.operatorName === 'name') {
                data.value = 0;
                data.valueRounded = 0;
                data.valueFormatted = this.series[0].alias;
              } else if (_.isString(lastValue)) {
                data.value = 0;
                data.valueFormatted = _.escape(lastValue);
                data.valueRounded = 0;
              } else {
                data.value = this.series[0].stats[this.panel.operatorName];
                data.flotpairs = this.series[0].flotpairs;
                var decimalInfo = this.getDecimalsForValue(data.value);
                var formatFunc = kbn.valueFormats[this.panel.format];
                data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
              }

              // Add $__name variable for using in prefix or postfix
              data.scopedVars = {
                __name: {
                  value: this.series[0].label
                }
              };
            }

            // check value to text mappings if its enabled
            if (this.panel.mappingType === 1) {
              for (var i = 0; i < this.panel.valueMaps.length; i++) {
                var map = this.panel.valueMaps[i];
                // special null case
                if (map.value === 'null') {
                  if (data.value === null || data.value === void 0) {
                    data.valueFormatted = map.text;
                    return;
                  }
                  continue;
                }

                // value/number to text mapping
                var value = parseFloat(map.value);
                if (value === data.valueRounded) {
                  data.valueFormatted = map.text;
                  return;
                }
              }
            } else if (this.panel.mappingType === 2) {
              for (var j = 0; j < this.panel.rangeMaps.length; j++) {
                var rangeMap = this.panel.rangeMaps[j];
                // special null case
                if (rangeMap.from === 'null' && rangeMap.to === 'null') {
                  if (data.value === null || data.value === void 0) {
                    data.valueFormatted = rangeMap.text;
                    return;
                  }
                  continue;
                }

                // value/number to range mapping
                var from = parseFloat(rangeMap.from);
                var to = parseFloat(rangeMap.to);
                if (to >= data.valueRounded && from <= data.valueRounded) {
                  data.valueFormatted = rangeMap.text;
                  return;
                }
              }
            }

            if (data.value === null || data.value === void 0) {
              data.valueFormatted = "no value";
            }
          }
        }, {
          key: 'getValueText',
          value: function getValueText() {
            return this.data.valueFormatted;
          }
        }, {
          key: 'getValueRounded',
          value: function getValueRounded() {
            return this.data.valueRounded;
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem) {
            this.panel.format = subItem.value;
            this.render();
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.onDataReceived([]);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {

            this.series = dataList.map(this.seriesHandler.bind(this));
            var data = {};
            this.setValues(data);
            this.data = data;

            var now = Date.now();
            if (Math.floor(now - this.lastRefreshTime) >= this.panel.refreshMinSec * 1000) {
              this.newData = true;
              this.lastRefreshTime = now;
              this.render();
            }
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });
            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            return series;
          }
        }, {
          key: 'invertColorOrder',
          value: function invertColorOrder() {
            var tmp = this.panel.colors[0];
            this.panel.colors[0] = this.panel.colors[2];
            this.panel.colors[2] = tmp;
            this.render();
          }
        }]);

        return CounterPanelCtrl;
      }(MetricsPanelCtrl)));

      CounterPanelCtrl.templateUrl = 'partials/template.html';

      _export('CounterPanelCtrl', CounterPanelCtrl);

      _export('MetricsPanelCtrl', CounterPanelCtrl);
    }
  };
});
//# sourceMappingURL=ctrl.js.map
