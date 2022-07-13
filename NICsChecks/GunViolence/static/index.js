{/* <script> */}
    let hanggunChart = undefined;
    let longgunChart = undefined;
    let otherChart = undefined;

    const months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
    }
    
    // draw chart
    function getRandomColor() {
        var letters = '789ABCD'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 6)];
        }
        return color;
    }

    async function drawChart() {
        const state = document.getElementById("state").value;
        // get data from server
        const res = await fetch("/graphdata/" + state );
        const data = await res.json();

        // Connect data from api
        // summarize of handgun for each month
        
        console.log(data);

        

        const labels = data.map(item => months[item.month]);
        const handgun = data.map(item => item.handgun);
        const long_gun = data.map(item => item.long_gun);
        const other = data.map(item => item.other);
        const colors = data.map(item => getRandomColor());

        const dataHanggun = {
            labels: labels,
            datasets: [{
                label: 'Hand Gun for Each Month',
                data: handgun,
                backgroundColor: colors
            }]
        };

        const ctxHanggun = document.getElementById('handgunChart');
        if( hanggunChart ) 
            hanggunChart.destroy();
          
        hanggunChart = new Chart(ctxHanggun, {
                type: 'polarArea',
                data: dataHanggun,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Hand Gun'
                        }
                    }

                }
            });

            

        const dataLonggun = {
            labels: labels,
            datasets: [{
                label: 'Long Gun for Each Month',
                data: long_gun,
                backgroundColor: colors
            }]
        };

        const ctxLonggun = document.getElementById('longgunChart');
        if( longgunChart ) 
        longgunChart.destroy();
          
        longgunChart = new Chart(ctxLonggun, {
                type: 'polarArea',
                data: dataLonggun,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Long Gun'
                        }
                    }
                }
            });


        const dataOther = {
            labels: labels,
            datasets: [{
                label: 'Other Gun for Each Month',
                data: other,
                backgroundColor: colors
            }]
        };

        const ctxOther = document.getElementById('otherChart');
        if( otherChart ) 
            otherChart.destroy();
          
        otherChart = new Chart(ctxOther, {
                type: 'polarArea',
                data: dataOther,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Other Gun'
                        }
                    }
                }
            });
    }

    drawChart();
 {/* </script> */}
