    // get data from server
colors = {}
function getRandomColor() {
    var letters = '789ABCD'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 6)];
    }
    return color;
}

function getColor(name) {
    if( !colors[name] )
        colors[name] = getRandomColor();
        
    return colors[name] || "gray";
}


async function drawChart() {
    const res = await fetch("/sankey_data");
    const data = await res.json();

    // Connect data from api
    // summarize of handgun for each month

    console.log(data);


    var ctx = document.getElementById("chart").getContext("2d");

    var colors = {
    Oil: "black",
    Coal: "gray",
    "Fossil Fuels": "slategray",
    Electricity: "blue",
    Energy: "orange"
    };

    // the y-order of nodes, smaller = higher
    // var priority = {
    // Oil: 1,
    // 'Narural Gas': 2,
    // Coal: 3,
    // 'Fossil Fuels': 1,
    // Electricity: 2,
    // Energy: 1
    // };

    var labels = {
    // Oil: 'black gold (label changed)'
    }


    var chart = new Chart(ctx, {
    type: "sankey",
    data: {
        datasets: [
        {
            data: data,
            // priority,
            // labels,
            colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
            colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
            borderWidth: 2,
            borderColor: 'black'
        }
        ]
    }
    });

}

drawChart();

// let me send new zoom link