$(function() {
	queue()
		.defer(d3.json,tracts)
		.await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,tracts) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var mapSvg = d3.select("#map").append("svg").attr("width",w).attr("height",h)
    drawBuildings(tracts,mapSvg)
}

function drawBuildings(geoData,svg){
    //need to generalize projection into global var later
	var projection = d3.geo.mercator().scale(300000).center([-73.977745,40.7025827])
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    
    //push data, add path
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class","buildings")
		.attr("d",path)
		.style("stroke","#000")
		.style("fill","none")
	    .style("opacity",1)
}