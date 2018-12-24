var graph = {
  "nodes": [
    {"id": "Oni.Ronin", "value": 1, "color": "#cc0000"},
    {"id": "Torch", "value": 1, "color": "#cc0000"},
    {"id": "Warhelm", "value": 1, "color": "#cc0000"},
    {"id": "Champion.of.Glory", "value": 1, "color": "#ff9900"},
    {"id": "Crownwatch.Paladin", "value": 1, "color": "#33cc33"},
    {"id": "Highland.Sharpshooter", "value": 1, "color": "#ff9900"},
    {"id": "Hojan,Crownbreaker", "value": 1, "color": "#33cc33"},
    {"id": "Vanquish", "value": 1, "color": "#33cc33"},
    {"id": "Kosul.Battlemage", "value": 1, "color": "#33cc33"},
    {"id": "Red.Canyon.Smuggler", "value": 1, "color": "#ff9900"},
    {"id": "Whirling.Duo", "value": 1, "color": "#ff9900"},
    {"id": "Auric.Runehammer", "value": 1, "color": "#33cc33"},
    {"id": "Inquisitors.Blade", "value": 1, "color": "#33cc33"},
    {"id": "Granite.Waystone", "value": 1, "color": "#cc0000"},
    {"id": "Shugo.Tactic", "value": 1, "color": "#cc0000"},
    {"id": "Bore", "value": 1, "color": "#cc0000"},
    {"id": "Elders.Feather", "value": 1, "color": "#33cc33"},
    {"id": "Rebuke", "value": 1, "color": "#33cc33"},
    {"id": "Jawbone.Greatsword", "value": 1, "color": "#cc0000"},
    {"id": "Obliterate", "value": 1, "color": "#cc0000"}
  ],
  "links": [
    {"source": "Highland.Sharpshooter", "target": "Warhelm", "value": 5},
    {"source": "Hojan.Crownbreaker", "target": "Warhelm", "value": 4},
    {"source": "Highland.Sharpshooter", "target": "Inquisitors.Blade", "value": 2},
    {"source": "Hojan.Crownbreaker", "target": "Inquisitors.Blade", "value": 3},
    {"source": "Highland.Sharpshooter", "target": "Elders.Feather", "value": 2},
    {"source": "Hojan.Crownbreaker", "target": "Elders.Feather", "value": 2},
    {"source": "Red.Canyon.Smuggler", "target": "Inquisitors.Blade", "value": 3},
    {"source": "Red.Canyon.Smuggler", "target": "Elders.Feather", "value": 1},
    {"source": "Red.Canyon.Smuggler", "target": "Warhelm", "value": 1},
    {"source": "Whirling.Duo", "target": "Inquisitors.Blade", "value": 2},
    {"source": "Whirling.Duo", "target": "Elders.Feather", "value": 1},
    {"source": "Highland.Sharpshooter", "target": "Shugo.Tactic", "value": 1},
    {"source": "Hojan.Crownbreaker", "target": "Shugo.Tactic", "value": 1},
    {"source": "Red.Canyon.Smuggler", "target": "Shugo.Tactic", "value": 3},
    {"source": "Whirling.Duo", "target": "Shugo.Tactic", "value": 1},
    {"source": "Auric.Runehammer", "target": "Oni.Ronin", "value": 1},
    {"source": "Auric.Runehammer", "target": "Warhelm", "value": 1},
    {"source": "Auric.Runehammer", "target": "Crownwatch.Paladin", "value": 1}
  ]
}



var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-200).distanceMax(100))
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return (d.value); });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g");

  for(j=0; j<graph.links.length; j++) {
    var source = graph.links[j]["source"];
    var target = graph.links[j]["target"];
    for(i=0; i<graph.nodes.length; i++) {
      id = graph.nodes[i]["id"];
      if(id == source || id == target) {
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
      .text(function(d) { return d.id; });

  simulation.nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links)
      .strength(function(link) {
        return .1*link.value;
      })
      .distance(function(link) {
        return width/(10);
      });

  function ticked() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

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
