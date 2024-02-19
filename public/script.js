// Load the data from the JSON file
d3.json('mbappe_shots.json').then(shotsData => {
  const shotMap = d3.select('#shotMap');
  const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  // Function to calculate the position and size of the shot points
  function calculatePositionAndSize(d) {
      const xPosition = d.X * shotMap.node().clientWidth;
      const yPosition = (1 - d.Y) * shotMap.node().clientHeight;
      const size = Math.sqrt(d.xG) * 17; // Adjust the size scaling factor as needed
      return { xPosition, yPosition, size };
  }

  // Define colors based on the result
  function colorBasedOnResult(d) {
      return d.result === 'Goal' ? 'green' :
             d.result === 'SavedShot' ? 'darkblue' :
             d.result === 'MissedShots' ? 'red' :
             d.result === 'ShotOnPost' ? 'yellow' :
             d.result === 'BlockedShot' ? 'purple' : 'grey';
  }

  // Create shot points
  shotMap.selectAll('.shot')
      .data(shotsData)
      .enter()
      .append('div')
      .attr('class', 'shot')
      .style('left', d => `${calculatePositionAndSize(d).xPosition}px`)
      .style('top', d => `${calculatePositionAndSize(d).yPosition}px`)
      .style('width', d => `${calculatePositionAndSize(d).size}px`)
      .style('height', d => `${calculatePositionAndSize(d).size}px`)
      .style('background-color', d => colorBasedOnResult(d))
      .on('mouseover', function (event, d) {
          tooltip.transition()
              .duration(200)
              .style('opacity', .9);
          tooltip.html(`Minute: ${d.minute}<br>
                        Result: ${d.result}<br>
                        xG: ${d.xG.toFixed(2)}<br>
                        Assisted by: ${d.player_assisted || 'N/A'}`)
              .style('left', (event.pageX) + 'px')
              .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function (d) {
          tooltip.transition()
              .duration(500)
              .style('opacity', 0);
      });

  // Add pitch outline and other pitch elements (e.g., center circle, penalty area)
  // Assume shotMap already contains an SVG element
  const pitch = shotMap.select('svg');
  
  // Draw the pitch outline
  pitch.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', shotMap.node().clientWidth)
      .attr('height', shotMap.node().clientHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');

  // Draw the center circle
  pitch.append('circle')
      .attr('cx', shotMap.node().clientWidth / 2)
      .attr('cy', shotMap.node().clientHeight / 2)
      .attr('r', shotMap.node().clientWidth / 10)
      .attr('fill', 'none')
      .attr('stroke', 'white');

  // ...add more pitch details as needed...
  pitch.append('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 10)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 200)
    .attr("y2", 200); 

    pitch.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 400)
    .attr('height', 400)
    .attr('fill', 'none')
    .attr('stroke', 'green');

});

