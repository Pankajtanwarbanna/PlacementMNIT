$(function () {
    "use strict";
    // ============================================================== 
    // Our Income
    // ==============================================================
    var chart = c3.generate({
        bindto: '#income',
        data: {
            columns: [
                ['Growth Income', 100, 200, 100, 300, 350, 100, 300, 350, 200],
                ['Net Income', 130, 100, 140, 200, 120, 140, 200, 120, 150]
            ],
            type: 'bar'
        },
         bar: {
            space: 0.2,
            // or
            width: 15 // this makes bar width 100px
        },
        padding: {
        top: 40,
        right: 0,
        bottom: -18,
        left: 0,
    },
        axis: {
            y: {
                show: false,
            tick: {
                count : 5,
                
                outer: false
                }
            },
            x: {
                show: false
            
            }
        },
        legend: {
          hide: true
          //or hide: 'data1'
          //or hide: ['data1', 'data2']
        },
        grid: {
        x: {
            show: false
        },
        y: {
            show: false
        }
    },
        size: {
            height: 290
        },
        color: {
              pattern: [ '#ffffff', 'rgba(255, 255, 255, 0.3)']
        }
    });
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //This is for the perfect scroll
    Morris.Area({
        element: 'morris-area-chart2'
        , data: [{
                period: '2015-01'
                , iphone: 0
                , ipad: 0
                , itouch: 0
        }, {
                period: '2015-02'
                , iphone: 130
                , ipad: 100
                , itouch: 80
        }, {
                period: '2015-03'
                , iphone: 80
                , ipad: 60
                , itouch: 70
        }, {
                period: '2015-04'
                , iphone: 70
                , ipad: 200
                , itouch: 140
        }, {
                period: '2015-05'
                , iphone: 180 
                , ipad: 150
                , itouch: 140
        }, {
                period: '2015-06'
                , iphone: 105
                , ipad: 100
                , itouch: 80
        }
            , {
                period: '2015-07'
                , iphone: 250
                , ipad: 150
                , itouch: 200
        }]
        , xkey: 'period'
        , ykeys: ['iphone', 'ipad']
        , labels: ['2017', '2018'],
        xLabelFormat: function(x) { // <--- x.getMonth() returns valid index
            var month = months[x.getMonth()];
            return month;
          },
          dateFormat: function(x) {
            var month = months[new Date(x).getMonth()];
            return month;
          }
        , pointSize: 0
        , fillOpacity: 0  
        , pointStrokeColors: ['#f62d51', '#7460ee', '#009efb']
        , behaveLikeLine: true
        , gridLineColor: '#f6f6f6'
        , lineWidth:1
        , hideHover: 'auto'
        , lineColors: ['#36bea6', '#009efb', '#009efb']
        , resize: true
    });
    // ============================================================== 
    // Our Income
    // ==============================================================
    var chart = c3.generate({
        bindto: '#sitestat',
        data: {
            columns: [
                ['Growth Income', 350, 200, 350, 300, 350, 450, 300, 350, 150],
                ['Net Income', 130, 80, 140, 200, 120, 140, 200, 120, 150]
            ],
            type: 'area'
        },
         
        padding: {
        top: 0, 
        right: -15,
        bottom: 0,
        left: -15,
    },
        axis: {
            y: {
                show: false,
            tick: {
                count : 5,
                outer: false
                }
            },
            x: {
                show: false
            
            }
        },
        legend: {
          hide: true
          //or hide: 'data1'
          //or hide: ['data1', 'data2']
        },
        grid: {
        x: {
            show: false
        },
        y: {
            show: false
        }
    },
        size: {
            height: 350
        },
        color: {
              pattern: [ '#7460ee', '#00c5dc']
        }
    });
});
var sparklineLogin = function() { 
        $('#sparklinedash').sparkline([ 0, 5, 6, 10, 9, 12, 4, 9, 12, 10, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#4caf50'
        });
         $('#sparklinedash2').sparkline([ 0, 5, 6, 10, 9, 12, 4, 9, 12, 10, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#9675ce'
        });
          $('#sparklinedash3').sparkline([ 0, 5, 6, 10, 9, 12, 4, 9, 12, 10, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#03a9f3'
        });
           $('#sparklinedash4').sparkline([ 0, 5, 6, 10, 9, 12, 4, 9, 12, 10, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#f96262'
        });
        $('#sales1').sparkline([20, 40, 30], {
            type: 'pie',
            height: '100',
            resize: true,
            sliceColors: ['#808f8f', '#fecd36', '#f1f2f7']
        });
        $('#sales2').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'bar',
            height: '154',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#25a6f7'
        });
        
   }
    var sparkResize;
 
        $(window).resize(function(e) {
            clearTimeout(sparkResize);
            sparkResize = setTimeout(sparklineLogin, 500);
        });
        sparklineLogin();
