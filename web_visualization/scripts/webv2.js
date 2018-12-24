$(document).ready(function($) {

  $("#go").click(function() {
    var url = $('#jsonPath').val();
    $.ajax({
      url: url,
      method: "GET",
      success: function(json) {
        makeGraph(json);
      }
    });
  })

  var graph = {
    "nodes": [
      {"id": "Bore", "value": 1, "color": "#cc0000"},
      {"id": "Grenadin.Drone", "value": 1, "color": "#cc0000"},
      {"id": "Permafrost", "value": 1, "color": "#0066ff"},
      {"id": "Seek.Power", "value": 1, "color": "#000000"},
      {"id": "Torch", "value": 1, "color": "#cc0000"},
      {"id": "Combustion.Cell", "value": 1, "color": "#cc0000"},
      {"id": "Spark.Hatcher", "value": 1, "color": "#cc0000"},
      {"id": "Strategize", "value": 1, "color": "#0066ff"},
      {"id": "Assembly.Line", "value": 1, "color": "#cc0000"},
      {"id": "Ixtun.Merchant", "value": 1, "color": "#cc0000"},
      {"id": "Wisdom.of.the.Elders", "value": 1, "color": "#0066ff"},
      {"id": "End.of.Hostilities", "value": 1, "color": "#0066ff"},
      {"id": "Howling.Peak", "value": 1, "color": "#ff9900"},
      {"id": "Kenna,Shaman.of.the.Scale", "value": 1, "color": "#0066ff"},
      {"id": "Xo.of.the.Endless.Hoard", "value": 1, "color": "#cc0000"},
      {"id": "Granite.Waystone", "value": 1, "color": "#cc0000"},
      {"id": "Kalebs.Choice", "value": 1, "color": "#ff9900"},
      {"id": "Molot&Nakova", "value": 1, "color": "#ff9900"}
    ],
    "links": [
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Bore", "value": 1},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Seek.Power", "value": 1},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Torch", "value": 1},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Combustion.Cell", "value": 4},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Strategize", "value": 1},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Wisdom.of.the.Elders", "value": 1},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "End.of.Hostilities", "value": 5},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Howling.Peak", "value": 4},
      {"source": "Kenna,Shaman.of.the.Scale", "target": "Kalebs.Choice", "value": 1},
      {"source": "Combustion.Cell", "target": "Granite.Waystone", "value": 2},
      {"source": "Combustion.Cell", "target": "Grenadin.Drone", "value": 2},
      {"source": "Combustion.Cell", "target": "Spark.Hatcher", "value": 2},
      {"source": "Combustion.Cell", "target": "Assembly.Line", "value": 2},
      {"source": "Combustion.Cell", "target": "End.of.Hostilities", "value": 4},
      {"source": "Ixtun.Merchant", "target": "Xo.of.the.Endless.Hoard", "value": 2},
      {"source": "Strategize", "target": "Xo.of.the.Endless.Hoard", "value": 2},
      {"source": "Ixtun.Merchant", "target": "Bore", "value": 2},
      {"source": "Strategize", "target": "Bore", "value": 2},
      {"source": "Ixtun.Merchant", "target": "Granite.Waystone", "value": 2},
      {"source": "Strategize", "target": "Granite.Waystone", "value": 2},
      {"source": "Howling.Peak", "target": "Molot&Nakova", "value": 2}
    ]
  }
  makeGraph(graph);

});

function makeGraph(graph) {
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll('*').remove();

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-200).distanceMax(100))
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) {
      return (d.value);
    });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g");

  for (j = 0; j < graph.links.length; j++) {
    var source = graph.links[j]["source"];
    var target = graph.links[j]["target"];
    for (i = 0; i < graph.nodes.length; i++) {
      id = graph.nodes[i]["id"];
      if (id == source || id == target) {
        graph.nodes[i]["value"] += graph.links[j]["value"];
      }
    }
  }

  var circles = node.append("circle")
    .attr("r", function(node) {
      return Math.sqrt(node.value) + 2;
    })
    .style("fill", function(d) {
      return d["color"];
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  var lables = node.append("text")
    .text(function(d) {
      return d.id;
    })
    .attr('x', 6)
    .attr('y', 3);

  node.append("title")
    .text(function(d) {
      return d.id;
    });

  simulation.nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links)
    .strength(function(link) {
      return .1 * link.value;
    })
    .distance(function(link) {
      return width / (10);
    });

    function ticked() {
      link.attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
}
