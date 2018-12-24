$(document).ready(function($) {

/*
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
*/

  var graph = {
    "nodes": [
      {"id": "Auralian.Cargo", "value": 1, "color": "#ff9900"},
      {"id": "Annihilate", "value": 1, "color": "#660066"},
      {"id": "Rindras.Choice", "value": 1, "color": "#ff9900"},
      {"id": "Strategize", "value": 1, "color": "#0066ff"},
      {"id": "Temple.Scribe", "value": 1, "color": "#e6e600"},
      {"id": "Amaran.Camel", "value": 1, "color": "#ff9900"},
      {"id": "Auralian.Merchant", "value": 1, "color": "#e6e600"},
      {"id": "Display.of.Knowledge", "value": 1, "color": "#ff9900"},
      {"id": "Hailstorm", "value": 1, "color": "#0066ff"},
      {"id": "Wisdom.of.the.Elders", "value": 1, "color": "#0066ff"},
      {"id": "Clutch.of.Talons", "value": 1, "color": "#0066ff"},
      {"id": "Crystalline.Chalice", "value": 1, "color": "#ff9900"},
      {"id": "Feeding.Time", "value": 1, "color": "#ff9900"},
      {"id": "Mask.of.Torment", "value": 1, "color": "#ff9900"},
      {"id": "Brilliant.Idea", "value": 1, "color": "#0066ff"},
      {"id": "Disjunction", "value": 1, "color": "#e6e600"},
      {"id": "Varas.Choice", "value": 1, "color": "#ff9900"},
      {"id": "Moondial", "value": 1, "color": "#e6e600"},
      {"id": "Azindel,Revealed", "value": 1, "color": "#ff9900"}
    ],
    "links": [
      {"source": "Mask.of.Torment", "target": "Temple.Scribe", "value": 1},
      {"source": "Mask.of.Torment", "target": "Amaran.Camel", "value": 4},
      {"source": "Mask.of.Torment", "target": "Clutch.of.Talons", "value": 3},
      {"source": "Mask.of.Torment", "target": "Brilliant.Idea", "value": 4},
      {"source": "Mask.of.Torment", "target": "Moondial", "value": 1},
      {"source": "Mask.of.Torment", "target": "Crystalline.Chalice", "value": 1},
      {"source": "Crystalline.Chalice", "target": "Temple.Scribe", "value": 1},
      {"source": "Crystalline.Chalice", "target": "Auralian.Merchant", "value": 1},
      {"source": "Crystalline.Chalice", "target": "Amaran.Camel", "value": 2},
      {"source": "Auralian.Cargo", "target": "Amaran.Camel", "value": 1},
      {"source": "Strategize", "target": "Amaran.Camel", "value": 1},
      {"source": "Temple.Scribe", "target": "Amaran.Camel", "value": 1},
      {"source": "Auralian.Merchant", "target": "Amaran.Camel", "value": 1},
      {"source": "Display.of.Knowledge", "target": "Amaran.Camel", "value": 1},
      {"source": "Wisdom.of.the.Elders", "target": "Amaran.Camel", "value": 1},
      {"source": "Brilliant.Idea", "target": "Amaran.Camel", "value": 2},
      {"source": "Moondial", "target": "Amaran.Camel", "value": 1}
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
    .attr('cx', Math.random()*width)
    .attr('cy', Math.random()*height)
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
