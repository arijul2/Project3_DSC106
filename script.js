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
        const size = Math.sqrt(d.xG) * 20 // Adjust the size scaling factor as needed
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
    
  
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const event = new Date(dateString);
      return event.toLocaleDateString('en-GB', options); // 'en-GB' uses day-month-year order
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
        // Get the mouse position relative to the page
        const mouseX = event.pageX;
        const mouseY = event.pageY;
    
        // Calculate the tooltip position
        let tooltipX = mouseX;
        // Offset to show above the cursor; consider the size of the tooltip itself
        let tooltipY = mouseY - tooltip.node().getBoundingClientRect().height - 10; 
    
        // Get the dimensions of the tooltip
        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;
    
        // Get the window width and height
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
    
        // Check if the tooltip would go off the right side of the screen
        if (mouseX + tooltipWidth > windowWidth) {
            tooltipX = windowWidth - tooltipWidth;
        }
    
        // Check if the tooltip would go off the top of the screen
        if (tooltipY < 0) {
            tooltipY = mouseY + 20; // Offset to show below the cursor if going off the top
        }
    
        // Set the tooltip HTML and position
        tooltip.html(`${d.h_team} ${d.h_goals}-${d.a_goals} ${d.a_team}<br>
                      ${formatDate(d.date)}<br><hr>
                      Minute: ${d.minute}<br>
                      Shot Outcome: ${d.result}<br>
                      xG: ${d.xG.toFixed(2)}<br>
                      Assisted by: ${d.player_assisted || 'N/A'}<br>
                      Shot Type: ${d.shotType}<br>
                      Situation: ${d.situation}`)
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .transition()
            .duration(200)
            .style('opacity', 0.8);
    })
    
    .on('mouseout', function (d) {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    // Select the shotMap div and append an SVG element to it
    const pitch = shotMap.append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // Define the pitch's proportions and positions based on the SVG size
    const width = shotMap.node().clientWidth;
    const height = shotMap.node().clientHeight;
    const penaltyAreaWidth = width * 0.14; // Example: 14% of the total width
    const penaltyAreaHeight = height * 0.35; // Example: 35% of the total height
    const goalAreaWidth = width * 0.05; // Example: 5% of the total width
    const goalAreaHeight = height * 0.12; // Example: 12% of the total height
    const centerCircleRadius = width * 0.01; // Example: 7% of the width for the circle radius

    // Draw the pitch outline
    pitch.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Draw the halfway line
    pitch.append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'white');

    // Draw the center circle
    pitch.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', centerCircleRadius)
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Draw the penalty areas
    const penaltyYPosition = (height - penaltyAreaHeight) / 2;
    
    // Left penalty area
    pitch.append('rect')
      .attr('x', 0)
      .attr('y', penaltyYPosition)
      .attr('width', penaltyAreaWidth)
      .attr('height', penaltyAreaHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Right penalty area
    pitch.append('rect')
      .attr('x', width - penaltyAreaWidth)
      .attr('y', penaltyYPosition)
      .attr('width', penaltyAreaWidth)
      .attr('height', penaltyAreaHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Draw the goal areas (smaller rectangles inside the penalty areas)
    const goalYPosition = (height - goalAreaHeight) / 2;

    // Left goal area
    pitch.append('rect')
      .attr('x', 0)
      .attr('y', goalYPosition)
      .attr('width', goalAreaWidth)
      .attr('height', goalAreaHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Right goal area
    pitch.append('rect')
      .attr('x', width - goalAreaWidth)
      .attr('y', goalYPosition)
      .attr('width', goalAreaWidth)
      .attr('height', goalAreaHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');
});