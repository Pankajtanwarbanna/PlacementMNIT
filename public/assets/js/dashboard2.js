$(function () {
    "use strict";
    
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
        , lineWidth:2
        , hideHover: 'auto'
        , lineColors: ['#36bea6', '#7460ee', '#009efb']
        , resize: true
    });
    
    // This is for the map
    
    var mapData = {
                "US": 298,
                "SA": 200,
                "AU": 760,
                "IN": 200,
                "GB": 120,
            };


jQuery('#world-map-marker').vectorMap(
{
    map: 'world_mill_en',
    backgroundColor: 'transparent',
    borderColor: '#dadada',
    borderOpacity: 1,
    borderWidth: 1,
    color: '#e6e6e6',
    regionStyle : {
        initial : {
          fill : '#dadada'
        }
      },

    markerStyle: {
      initial: {
                    r: 7,
                    'fill': '#f6f6f6',
                    'fill-opacity':1,
                    'stroke': '#000',
                    'stroke-width' : 1,
                    'stroke-opacity': 1
                },
                },
   
    markers : [{
        latLng : [21.00, 78.00],
        name : 'INDIA : 350'
      
      },
      {
        latLng : [-33.00, 151.00],
        name : 'Australia : 250'
        
      },
      {
        latLng : [36.77, -119.41],
        name : 'USA : 250'
      
      },
      {
        latLng : [55.37, -3.41],
        name : 'UK   : 250'
      
      },
      {
        latLng : [25.20, 55.27],
        name : 'UAE : 250'
      
      }],
      series: {
                    regions: [{
                        values: mapData,
                        scale: ["#4F5467", "#4F5468"],
                        normalizeFunction: 'polynomial'
                    }]
                },
    hoverOpacity: null,
    normalizeFunction: 'linear',
    zoomOnScroll: false,
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#c9dfaf',
    selectedRegions: [],
    enableZoom: false,
    hoverColor: '#fff',
    
    
});

 window.addEventListener('resize', function() {
        
    });
});
//sparkline charts
var sparklineLogin = function () {
    $("#sparkline8").sparkline([2, 4, 4, 6, 8, 5, 8, 5], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: '#7460ee'
    });
    $("#sparkline9").sparkline([0,2, 4, 8, 6, 3, 5, 1], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: '#36bea6'
    });
    $("#sparkline10").sparkline([2, 4, 4, 6, 8, 5, 8, 5], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: '#f62d51'
    });
    $("#sparkline11").sparkline([0,2, 4, 8, 6, 3, 5, 1], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)' 
    });
    $("#sparkline12").sparkline([0,2, 4, 8, 6, 3, 5, 1], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
    });
    $("#sparkline13").sparkline([0,2, 4, 8, 6, 3, 5, 1], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
    });
    $("#sparkline14").sparkline([0,2, 4, 8, 6, 3, 5, 1], {
        type: 'bar'
        , width: '100%'
        , height: '30',
        barWidth: '4',
            width:'100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
    });
    $('#sparkline15').sparkline([1, 4, 5, 4, 5, 6, 6, 7, 5, 7, 5, 4, 3], {
        type: 'line',
        width: '100%',
        height: '100',
        lineColor: '#00bfbf',
        fillColor: '#ecfaf8',
        spotColor: undefined,
        minSpotColor: undefined,
        maxSpotColor: undefined,
        highlightSpotColor: undefined,
        highlightLineColor: '#494646',
        spotRadius: 0
        });
        
}
var sparkResize;
$(window).resize(function (e) {
    clearTimeout(sparkResize);
    sparkResize = setTimeout(sparklineLogin, 500);
});
sparklineLogin();
