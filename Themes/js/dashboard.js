var myApp = angular.module('myApp', []);
myApp.controller('myController', function ($scope,$interval) {

    $scope.alarmtypeDetails = [];
    $scope.alarmtypeDetails = [{ name: 'Floor alarm', sno: '1', total: '604', alarmtypeCount: '290', pwidth:'80%' },
        { name: 'High Temperature Abnormal Alarm', sno: '2', total: '604', alarmtypeCount: '99', pwidth: '70%' },
        { name: 'Siren Detection', sno: '3', total: '604', alarmtypeCount: '60', pwidth: '60%' },
        { name: 'Floor count alarm', sno: '4', total: '604', alarmtypeCount: '40', pwidth: '40%' },
       // { name: 'Floor count alarm', sno: '5', total: '604', alarmtypeCount: '40', pwidth: '40%' },
    ]
$scope.currentDate = new Date();

    // Update the time every second
    $interval(function () {
        $scope.currentDate = new Date();
    }, 1000);
    var chart1 = document.getElementById('nvrchart');
    var chart2 = document.getElementById('camerachart');
    var chart3 = document.getElementById('imagechart');
    var chart4 = document.getElementById('videochart');
    var alarmchart = document.getElementById('alarmChart');

    var myChart1 = echarts.init(chart1, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var myChart2 = echarts.init(chart2, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var myChart3 = echarts.init(chart3, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var myChart4 = echarts.init(chart4, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    

    const data = [{ value: 604, },{ value: 63, },{ value: 24, }];
    $scope.sum = data.reduce((sum, cur) => {
        return sum + cur.value;
    }, 0);
    const defaultPalette = [
        '#3d7efe',
        '#ff0000',
        '#ffffff',
    ];
    const radius = ['50%', '65%'];
    const pieOption = {
        series: [
            {
                type: 'pie',
                id: 'distribution',
                radius: ['60%', '75%'],
                label: {
                    show: false
                },

                universalTransition: true,
                animationDurationUpdate: 1000,
                data: data
            },
        ],
        color: defaultPalette,
        tooltip: {
            trigger: 'item',

        },
    };
    const parliamentOption = (function () {
        let sum = data.reduce(function (sum, cur) {
            return sum + cur.value;
        }, 0);
        let angles = [];
        let startAngle = -Math.PI / 2;
        let curAngle = startAngle;
        data.forEach(function (item) {
            angles.push(curAngle);
            curAngle += (item.value / sum) * Math.PI * 2;
        });
        angles.push(startAngle + Math.PI * 2);
        function parliamentLayout(startAngle, endAngle, totalAngle, r0, r1, size) {
            let rowsCount = Math.ceil((r1 - r0) / size);
            let points = [];
            let r = r0;
            for (let i = 0; i < rowsCount; i++) {
                // Recalculate size
                let totalRingSeatsNumber = Math.round((totalAngle * r) / size);
                let newSize = (totalAngle * r) / totalRingSeatsNumber;
                for (
                    let k = Math.floor((startAngle * r) / newSize) * newSize;
                    k < Math.floor((endAngle * r) / newSize) * newSize - 1e-6;
                    k += newSize
                ) {
                    let angle = k / r;
                    let x = Math.cos(angle) * r;
                    let y = Math.sin(angle) * r;
                    points.push([x, y]);
                }
                r += size;
            }
            return points;
        }
        return {
            series: {
                type: 'custom',
                id: 'distribution',
                data: data,
                coordinateSystem: undefined,
                universalTransition: true,
                animationDurationUpdate: 1000,
                renderItem: function (params, api) {
                    var idx = params.dataIndex;
                    var viewSize = Math.min(api.getWidth(), api.getHeight());
                    var r0 = ((parseFloat(radius[0]) / 100) * viewSize) / 1.6;
                    var r1 = ((parseFloat(radius[1]) / 100) * viewSize) / 1.6;
                    var cx = api.getWidth() * 0.5;
                    var cy = api.getHeight() * 0.5;
                    var size = viewSize / 28;
                    var points = parliamentLayout(
                        angles[idx],
                        angles[idx + 1],
                        Math.PI *2,
                        r0,
                        r1,
                        size + 3
                    );
                    return {
                        type: 'group',
                        children: points.map(function (pt) {
                            return {
                                type: 'circle',
                                autoBatch: true,
                                shape: {
                                    cx: cx + pt[0],
                                    cy: cy + pt[1],
                                    r: size / 1.5
                                },
                                style: {
                                    fill: defaultPalette[idx % defaultPalette.length]
                                }
                            };
                        })
                    };
                }
            }
        };
    })();

    let currentOption = (option = pieOption);
    setInterval(function () {
        currentOption = currentOption === pieOption ? parliamentOption : pieOption;
        //myChart3.setOption(currentOption);
        myChart1.setOption(currentOption);
        myChart2.setOption(currentOption);

        myChart3.setOption(currentOption);
        myChart4.setOption(currentOption);
    }, 2000);

    
   
    var myChart5 = echarts.init(alarmchart, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var alchartoption = {
        color: [
            '#ffffff',
            '#3d7efe',
            '#ff0000',
            
        ],
        legend: {
            show:true
        },
        grid: {
            top: 20,
            bottom:20,
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show:false
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            showSymbol:false,
            data: [5, 10, 15, 30, 200, 850, 900]
        },
            {
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: [5, 10, 15, 30, 360, 30, 15]
            },
            {
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: [5, 10, 200, 10, 5, 3, 3]
            }
        ]
    };
    myChart5.setOption(alchartoption);
   
});
