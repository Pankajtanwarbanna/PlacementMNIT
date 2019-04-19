$(function () {
    "use strict";
    // ============================================================== 
    // Our Income
    // ==============================================================
    var chart = c3.generate({
        bindto: '#income',
        data: {
            columns: [
                ['Growth Income', 100, 200, 100, 300, 350, 450, 400],
                ['Net Income', 130, 100, 140, 200, 120, 200, 180]
            ],
            type: 'bar'
        },
         bar: {
            space: 0.2,
            // or
            width: 15 // this makes bar width 100px
        },
        axis: {
            y: {
            tick: {
                count : 5,
                
                outer: false
                }
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
            show: true
        }
    },
        size: {
            height: 410
        },
        color: {
              pattern: [ '#7460ee', '#009efb']
        }
    });
    // chart1
    var ctx = document.getElementById("salesChart");
    var salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2012", "2013", "2014", "2015", "2016", "2017" ],
            datasets: [{
                label: '# of Sales',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'transparent'
                ],
                borderColor: [
                    'rgba(255,99,132,1)'
                    
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: { point: { radius: 2 } },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false,
                        drawBorder: false,
                        },
                    ticks: {
                                display: false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false
                            }
                        }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
    // chart2
    var ctx = document.getElementById("orderChart");
    var orderChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2012", "2013", "2014", "2015", "2016", "2017" ],
            datasets: [{
                label: '# of Sales',
                data: [1, 10, 3, 5, 2, 3],
                backgroundColor: [
                    'transparent'
                ],
                borderColor: [
                    '#ffbc34'
                    
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: { point: { radius: 2 } },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false,
                        drawBorder: false,
                        },
                    ticks: {
                                display: false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false
                            }
                        }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
    // chart3
    var ctx = document.getElementById("transactionChart");
    var transactionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2012", "2013", "2014", "2015", "2016", "2017" ],
            datasets: [{
                label: '# of Sales',
                data: [5, 10, 3, 15, 2, 3],
                backgroundColor: [
                    'transparent'
                ],
                borderColor: [
                    '#36bea6    '
                    
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: { point: { radius: 2 } },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false,
                        drawBorder: false,
                        },
                    ticks: {
                                display: false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false
                            }
                        }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
    // chart4
    var ctx = document.getElementById("costChart");
    var costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2012", "2013", "2014", "2015", "2016", "2017" ],
            datasets: [{
                label: '# of Sales',
                data: [1, 19, 3, 9, 2, 3],
                backgroundColor: [
                    'transparent'
                ],
                borderColor: [
                    '#009efb'
                    
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: { point: { radius: 2 } },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false,
                        drawBorder: false,
                        },
                    ticks: {
                                display: false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false
                            }
                        }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
    
    var sparklineLogin = function () {
        $('#sparkline2dash').sparkline([20, 40, 30], {
            type: 'pie',
            height: '120',
            resize: true,
            sliceColors: ['#2b2b2b', '#36bea6', '#f6f6f6']
        });
        $('#sparkline1dash').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'bar',
            height: '150',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#25a6f7'
        });
        $('#sparkline3dash').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'bar',
            height: '150',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#f62d51'
        });
        $('#sparkline4dash').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'bar',
            height: '150',
            barWidth: '4',
            resize: true,
            barSpacing: '10',
            barColor: '#2b2b2b'
        });
    }
    var sparkResize;
    $(window).resize(function (e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});

// Sky Icons
var icons = new Skycons({
        "color": "#ff6849"
    })
    , list = [
        "clear-day", "clear-night", "partly-cloudy-day"
        , "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind"
        , "fog"
      ]
    , i;
for (i = list.length; i--;) {
    var weatherType = list[i]
        , elements = document.getElementsByClassName(weatherType);
    for (e = elements.length; e--;) {
        icons.set(elements[e], weatherType);
    }
}
icons.play();

