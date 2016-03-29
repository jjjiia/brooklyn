$(function() {
	queue()
		.defer(d3.json,tracts)
        .defer(d3.json,dataFiles)
        .defer(d3.json,b00001)
		.await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,tracts,directory,b00001) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    
   // drawBuildings(tracts,b00001)
    dataCategories(directory)
    loadAndDrawStart(tracts,directory)
    //console.log(directory.B00001)
}

function dataCategories(data){    
    var catList = d3.select("#subjectSelect")
//    var subheader = d3.select("#map").append("div")
  //  subheader.attr("class","subheader").html("test")
    for(var c in data){
       catList.append("option").attr("value",c).html(data[c][0]["topicName"])
//        subheader.attr("class","subheader").html(data[c][0]["topicName"])
       // catList= catList+c+":"+data[c][0]["topicName"]+"<br/>"
    }
}
function loadAndDrawStart(geoData,data,directory){
    var sorted = Object.keys(data).sort()
//    var subheader = d3.select("#map").append("div")
//    subheader.attr("class","subheader").html("test")
    var sorted = ["09","10","11","12","13","14"]
    for(var y in sorted){
        drawBuildings(geoData,sorted[y])
    }
}
function timeComparison(data){
    
}
function getMaxMin(data){
    for(var i in data){
        console.log(i)
    }
}
function updateMaps(fileName){
  //  console.log(fileName)    
    d3.json("data_census/byId_shortIds/"+fileName+".json", function(error, json) {
     // if (error) return console.warn(error);
    
    var colorScale = d3.scale.linear().domain([0,10000]).range(["white","blue"])
     
      data = json;
      console.log(data)
    var sorted = Object.keys(data).sort()
      
      for(var y in sorted){
          console.log(data[sorted[y]])
          var currentSvg = d3.selectAll(".year_"+sorted[y])
          currentSvg.selectAll("path").transition().style("fill",function(d,i){
              if(data[sorted[y]][String(d.properties.GEOID)]!= undefined){
  		          var value = data[sorted[y]][String(d.properties.GEOID)]["Estimate; Total"]
                  //console.log(value)
                  if(value == 0){
                      return "none"
                  }else if (value == "-"){
                      return "none"
                  }else{
                      return colorScale(value)
                  }
              }
              return "none"
          })
      }
    });
}
function drawBuildings(geoData,year){
    var w = 250
    var h = 250
    var svg = d3.select("#map").append("svg").attr("width",w).attr("height",h).attr("class","year_"+year)
    svg.append("text").text("year: "+year).attr("x",30).attr("y",30)
    //need to generalize projection into global var later
	var projection = d3.geo.mercator().scale(60000).center([-73.958052,40.648285]).translate([w/2, h/2])
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    //push data, add path
    var colorScale = d3.scale.linear().domain([0,1000]).range(["white","red"])
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class","buildings")
		.attr("d",path)
        .attr("class",function(d){return d.properties.GEOID})
		.style("stroke","#000")
		.style("fill",function(d){
            return "#aaa"
            if(data[String(d.properties.GEOID)]!= undefined){
		    var value = data[String(d.properties.GEOID)]["Estimate; Total"]
                if(value == 0){
                    return "none"
                }else if (value == "-"){
                    return "none"
                }else{
                    return colorScale(value)
                }
            }
            return "none"
		})
	    .style("stroke","none")
        .style("opacity",1)
        //.on("click",function(d){
        //    console.log(data[String(d.properties.GEOID)]["Estimate; Total"])
        //})
}
function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
    
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {    
  if (!event.target.matches('.subjectSelect')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
    var e = document.getElementById("subjectSelect")
    var selection = e.options[e.selectedIndex]
    console.log(selection.value)
    updateMaps(selection.value)
  
}