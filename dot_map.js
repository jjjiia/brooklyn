$(function() {
	queue()
		.defer(d3.csv, dots)
		.defer(d3.json,buildings)
		.await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,dots,buildings) {
//make 1 svg for everything
    var mapSvg = d3.select("#map").append("svg").attr("width",1200).attr("height",800)
    //draw each layer
    drawBuildings(buildings,mapSvg)
    //uses csv version
    //this version of the data uses shortened, not exact lat and lngs
    drawDots(dots,mapSvg)

}
function drawBuildings(geoData,svg){
    //need to generalize projection into global var later
	var projection = d3.geo.mercator().scale(4000000).center([-71.063,42.3562])
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    
    //push data, add path
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class","buildings")
		.attr("d",path)
		.style("fill","#aaa")
	    .style("opacity",.5)
}

function drawDots(data,svg){
	var projection = d3.geo.mercator().scale(4000000).center([-71.063,42.3562])
    
    svg.selectAll(".dots")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dots")
        .attr("r",2)
        .attr("cx",function(d){
            var lat = parseFloat(d.latitude)
            var lng = parseFloat(d.longitude)
            //to get projected dot position, use this basic formula
            var projectedLng = projection([lng,lat])[0]
            return projectedLng
        })
        .attr("cy",function(d){
            var lat = parseFloat(d.latitude)
            var lng = parseFloat(d.longitude)
            var projectedLat = projection([lng,lat])[1]
            return projectedLat
        })
        .attr("fill",function(d){
            //color code the dots by gender
            var gender = d.gender
            if(gender == "F"){
                return "red"
            }else if(gender == "M"){
                return "blue"
            }else{
                return "black"
            }            
        })
	    .style("opacity",.3)
        //on mouseover prints dot data
        .on("mouseover",function(d){
            console.log(d)
        })
        
}