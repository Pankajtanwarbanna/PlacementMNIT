$(function() {
    "use strict";
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //This is for the perfect scroll
    Morris.Area({
        element: 'morris-area-chart2',
        data: [{
            period: '2015-01',
            bitcoin: 0,
            ethereum: 0,
            dash: 0
        }, {
            period: '2015-02',
            bitcoin: 130,
            ethereum: 100,
            dash: 80
        }, {
            period: '2015-03',
            bitcoin: 80,
            ethereum: 60,
            dash: 70
        }, {
            period: '2015-04',
            bitcoin: 70,
            ethereum: 200,
            dash: 140
        }, {
            period: '2015-05',
            bitcoin: 180,
            ethereum: 150,
            dash: 140
        }, {
            period: '2015-06',
            bitcoin: 105,
            ethereum: 100,
            dash: 80
        }, {
            period: '2015-07',
            bitcoin: 250,
            ethereum: 150,
            dash: 200
        }],
        xkey: 'period',
        ykeys: ['bitcoin', 'ethereum', 'dash'],
        labels: ['2016', '2017', '2018'],
        xLabelFormat: function(x) { // <--- x.getMonth() returns valid index
            var month = months[x.getMonth()];
            return month;
        },
        dateFormat: function(x) {
            var month = months[new Date(x).getMonth()];
            return month;
        },
        pointSize: 0,
        fillOpacity: 0,
        pointStrokeColors: ['#7460ee', '#36bea6', '#f62d51'],
        behaveLikeLine: true,
        gridLineColor: '#f6f6f6',
        lineWidth: 2,
        hideHover: 'auto',
        lineColors: ['#7460ee', '#36bea6', '#f62d51'],
        resize: true
    });
    // ============================================================== 
    // sparkline charts
    // ==============================================================
    var sparklineLogin = function() {
        $("#spark1").sparkline([2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#36bea6',
            fillColor: '#ecfaf8',
            maxSpotColor: '#36bea6',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#36bea6'
        });
        $("#spark2").sparkline([0, 2, 8, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#009efb',
            fillColor: '#E5F0FC',
            minSpotColor: '#009efb',
            maxSpotColor: '#009efb',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#009efb'
        });
        $("#spark3").sparkline([2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#f62d51',
            fillColor: '#FEEAED',
            maxSpotColor: '#f62d51',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#f62d51'
        });
        $("#spark4").sparkline([2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#ffbc34',
            fillColor: '#FFF8EA',
            maxSpotColor: '#ffbc34',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#ffbc34'
        });
        $("#spark5").sparkline([0, 2, 8, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#343a40',
            fillColor: '#EAEBEB',
            minSpotColor: '#343a40',
            maxSpotColor: '#343a40',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#343a40'
        });
        $("#spark6").sparkline([2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#7460ee',
            fillColor: '#F1EFFD',
            maxSpotColor: '#7460ee',
            highlightLineColor: 'rgba(0, 0, 0, 0.2)',
            highlightSpotColor: '#7460ee'
        });
        $("#sparkline8").sparkline([2, 4, 4, 6, 8, 5, 8, 5], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: '#7460ee'
        });
        $("#sparkline9").sparkline([0, 2, 4, 8, 6, 3, 5, 1], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: '#36bea6'
        });
        $("#sparkline10").sparkline([2, 4, 4, 6, 8, 5, 8, 5], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: '#f62d51'
        });
        $("#sparkline11").sparkline([0, 2, 4, 8, 6, 3, 5, 1], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
        });
        $("#sparkline12").sparkline([0, 2, 4, 8, 6, 3, 5, 1], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
        });
        $("#sparkline13").sparkline([0, 2, 4, 8, 6, 3, 5, 1], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
        });
        $("#sparkline14").sparkline([0, 2, 4, 8, 6, 3, 5, 1], {
            type: 'bar',
            width: '100%',
            height: '30',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '6',
            barColor: 'rgba(255, 255, 255, 0.5)'
        });
    }
    var sparkResize;
    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});