function makeChart(deviceList, sortV) {
    var chartData = [];
    var sort = "Job Type";
    //var sort = "Device";

    function customChart(sort, sortBy) {
        var chartVals = [];
        var temp = [];

        for (var i = 0; i < deviceList.length; i++) {
            temp = deviceList[i];
            if (!chartVals.hasOwnProperty(temp[sort])) {
                chartVals[temp[sort]] = parseInt(temp[sortBy]);
                // chartVals.push(temp["Job Type"]);
            }

            else if (chartVals.hasOwnProperty(temp[sort])) {
                chartVals[temp[sort]] += parseInt(temp[sortBy]);
            }

            temp = [];
        }
    
        return chartVals;
    }
    chartData = customChart(sort, sortV);

    chartStopOne(chartData);

    function chartStopOne(data) {
        var temp = data;
        var width = 960;
        var height = 450;
        var radius = Math.min(width, height) / 2;


        var svg = d3.select('#sepDiv')
            .append("svg")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var key = function(d) {
            return d.data.label;
        };

        function fillDomain(k){
            var holder = [];
            for(var key in k){
                holder.push(key);
            }
            return holder;
        }

        var color = d3.scale.ordinal()
            .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


        var colorz = d3.scale.ordinal()
            .domain(["Printing", "Copying", "Scanning", "Faxing"])
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"])

        var colors = d3.scale.ordinal()
            .domain(fillDomain(chartData))
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);
            
        
            
        function randomData(t) {
            var labels = colors.domain();
            return labels.map(function(label) {
                return {
                    label: label,
                    value: t[label]
                }
                console.log("this shit" + label);
            });
        }

        change(randomData(temp));

        d3.select(".by_cost")
            .on("click", function() {
                change(randomData(temp));
            });

        d3.select(".by_pages")
            .on("click", function() {
                storage = [];
                pages = "Total Printed Pages";
                storage = customChart(sort, pages);
                change(randomData(storage));
            });

        d3.select(".by_color_p")
            .on("click", function() {
                storage = [];
                pages = "Color Pages";
                storage = customChart(sort, pages);
                change(randomData(storage));
            });



        function change(data) {
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
                
            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) {
                    return color(d.data.label);
                })
                .attr("class", "slice")
                .on("mouseover", function(d) {
                    tooltip
                        .style("opacity", .9)
                        .html("test vals")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d){
                    tooltip
                        .style("opacity", 0);
                });

            slice
                .transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                })

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .text(function(d) {
                    return d.data.label;
                });

            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), key);

            polyline.enter()
                .append("polyline");

            polyline.transition().duration(1000)
                .attrTween("points", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

            polyline.exit()
                .remove();
        };

    }
}
