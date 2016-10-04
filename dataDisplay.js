        var height = 600;
        var width = 600;

        headerSelection = ["Device", "Job Type", "Color Pages", "Grayscale Pages",
            "Duplex Pages", "Simplex Pages", "Total Printed Pages", "Cost"
        ];

        var dat_one;
        var dat_two;
        var remainder = 2;
        var retData = [];
        
        function fileMapInit(x) {
            var selection = [];
            var fileOne;
            var fileTwo;
            selection = x;
            if (selection.indexOf("Printing") > -1) {
                fileOne = "../print_summary_by_printer.csv";
            }
            if ((selection.indexOf("Copying") > -1) || (selection.indexOf("Scanning") > -1) || (selection.indexOf("Faxing") > -1)) {
                fileTwo = "../job_type_summary_by_device.csv";
            }

            if (fileOne != null && fileTwo != null) {
               pullFiles(fileOne, fileTwo);
            }

        }


        function pullFiles(x, y) {
            var fFile = x;
            var sFile = y;


            d3.xhr(fFile).get(function (err, response) {
                var dirtyCsv = response.responseText;
                var cleanCsv = dirtyCsv.split('\n').slice(2).join('\n');
                var parseCsv = d3.csv.parse(cleanCsv);
                //console.log("first csv");
               // console.log(parseCsv);
                dat_one = parseCsv;
                if(!--remainder) {
                  buildArray();
                }
            });
            
            d3.xhr(sFile).get(function (err, response) {
                var dirtyCsv = response.responseText;
                var cleanCsv = dirtyCsv.split('\n').slice(2).join('\n');
                var parseCsv = d3.csv.parse(cleanCsv);
                //console.log("second csv");
                //console.log(parseCsv);
                dat_two = parseCsv;
                if(!--remainder){
                    buildArray();
                }
            });
             
            /*
            // if(jobTypeSelection.hasOwnProperty("Printing") && jobTypeSelection.hasOwnProperty("Scanning")){
            d3.csv(fFile, function(csv) {
                dat_one = csv;
                if (!--remainder) {
                    buildArray();

                }
            });

            d3.csv(sFile, function(csv) {
                dat_two = csv;
                if (!--remainder) {
                    buildArray();

                }
            });
            
            */
            
        }


        function buildArray() {
            for(var x =  0; x < dat_two.length; x++){
                console.log(dat_two[x]);
            }
            var tempArray = [];
            var newDataSet = [];
            builderArray = [];
            // console.log(tempArray);
            for (var j = 0; j < dat_two.length; j++) {
                tempArray = dat_two[j];

                for (var i = 0; i < headerSelection.length; i++) {

                    if (tempArray.hasOwnProperty(headerSelection[i])) {
                        builderArray[headerSelection[i]] = tempArray[headerSelection[i]];
                    }
                    if (builderArray[headerSelection[i]] == "") {
                        builderArray[headerSelection[i]] = 0;
                    }

                }

                //console.log(builderArray);
                newDataSet.push(builderArray);
                builderArray = [];
            }

            //console.log(newDataSet);


            for (var j = 0; j < dat_one.length; j++) {
                tempArray = dat_one[j];
                for (var i = 0; i < headerSelection.length; i++) {

                    if (tempArray.hasOwnProperty(headerSelection[i])) {
                        builderArray[headerSelection[i]] = tempArray[headerSelection[i]];
                    }
                    else if (headerSelection[i] == "Device") {
                        builderArray[headerSelection[i]] = tempArray["Printer Name"];
                    }
                    else if (headerSelection[i] == "Job Type") {
                        builderArray[headerSelection[i]] = "Printing";
                    }
                    else {
                        builderArray[headerSelection[i]] = 0;
                    }

                }
                //console.log(builderArray);
                newDataSet.push(builderArray);
                builderArray = [];
            }
            //console.log(newDataSet);
            /*
            newDataSet.sort(function(a, b) {
                if (a["Device"] < b["Device"]) return 1;
                if (a["Device"] > b["Device"]) return -1;
                return 0;
            });
            */
            // buildTable(newDataSet);
            //costByJob(newDataSet);
            //console.log("find me!");
            //console.log(newDataSet);
            buildTable(newDataSet);
            retData = newDataSet;
            
        }



        function costByJob(data) {
            var cDataSet = [];
            var tempArray = [];
            var tDataSet = [];
            //console.log(tDataSet);
            //cDataSet = [{"Printing": 0, "Scanning": 0, "Faxing": 0, "Copying": 0} ];

            console.log("Here it is!!!!");
            for (var i = 0; i < data.length; i++) {
                tempArray = data[i];
                if (!cDataSet.hasOwnProperty(tempArray["Job Type"])) {
                    cDataSet[tempArray["Job Type"]] = +0;
                }
                cDataSet[tempArray["Job Type"]] += +tempArray["Cost"];
                tempArray = [];
            }

            for (var i = 0; i < cDataSet.length; i++) {
                tDataSet.push(cDataSet[i]);
            }
            console.log(tDataSet);
        }


        function buildTable(x) {
            
            var theadRow = d3.select("thead").append("tr")
                
                
            var theadSelect = d3.select("thead").selectAll("tr");
            
            var thead = theadSelect.selectAll("th")
                .data(d3.keys(x[0]))
                .enter()
                .append("th")
                .text(function(d) {
                    return d
                });

            var tr = d3.select("tbody").selectAll("tr")
                .data(x)
                .enter().append("tr");

            // cells
            var td = tr.selectAll("td")
                .data(function(d) {
                    return d3.values(d)
                })
                .enter()
                .append("td")
                .text(function(d) {
                    return d
                });
         $(function(){
             $('#dTable').tablesorter();
         })  
        
        retData = x;
        }
        
        function getData(){
            return retData;
        }
        

        