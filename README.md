# Synergy-Graph

Creates a force directed graph from JSON data.
The width (not the distance) of the links represents magnitude of the synergy between the two nodes.
The size of each node depends on the sum of its links' widths.

To change the data, modify the graph variable in web_visualization/scripts/webv2.js to a JSON object.
Examples are in web_visualization/data, you can copy and paste the whole contents of a data file into the graph variable.
