// Load the data from the JSON file
d3.json('mbappe_shots.json').then(shotsData => {
    // Ensure the #shotMap div is styled correctly
    const shotMap = d3.select('body').append('div')
        .attr('id', 'shotMap')
        .style('position', 'relative') // This should be 'relative'
        .style('width', '100vw') // Viewport width
        .style('height', '100vh'); // Viewport height

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('pointer-events', 'none');
  
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
        .style('position', 'absolute')
        .style('left', d => `${calculatePositionAndSize(d).xPosition}px`)
        .style('top', d => `${calculatePositionAndSize(d).yPosition}px`)
        .style('width', d => `${calculatePositionAndSize(d).size}px`)
        .style('height', d => `${calculatePositionAndSize(d).size}px`)
        .style('border-radius', '50%') // Make the shots circular
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
        const width = window.innerWidth;
        const height = window.innerHeight;
    
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

    const pitch = shotMap.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');
  
// Get the dimensions of the shotMap
const shotMapWidth = shotMap.node().getBoundingClientRect().width;
const shotMapHeight = shotMap.node().getBoundingClientRect().height;

// Define the pitch's proportions based on the shotMap size
const pitchOutline = {
    x: 0,
    y: 0,
    width: shotMapWidth,
    height: shotMapHeight
};

// Draw the pitch outline
pitch.append('rect')
    .attr('x', pitchOutline.x)
    .attr('y', pitchOutline.y)
    .attr('width', pitchOutline.width)
    .attr('height', pitchOutline.height)
    .attr('fill', '#060')
    .attr('stroke', '#FFF');

// Draw the halfway line
pitch.append('line')
    .attr('x1', shotMapWidth / 2)
    .attr('y1', 0)
    .attr('x2', shotMapWidth / 2)
    .attr('y2', shotMapHeight)
    .attr('stroke', '#FFF');

// Draw the center circle
pitch.append('circle')
    .attr('cx', shotMapWidth / 2)
    .attr('cy', shotMapHeight / 2)
    .attr('r', shotMapWidth * 0.07) // Radius is 7% of the width
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Corrected dimensions for the penalty areas
const penaltyAreaWidth = shotMapHeight * 0.18;
const penaltyAreaHeight = shotMapWidth * 0.14;
const penaltyAreaY = (shotMapWidth - penaltyAreaWidth) / 2;

// Left penalty area
pitch.append('rect')
    .attr('x', 0)
    .attr('y', penaltyAreaY)
    .attr('width', penaltyAreaHeight)
    .attr('height', penaltyAreaWidth)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Right penalty area
pitch.append('rect')
    .attr('x', shotMapHeight - penaltyAreaHeight)
    .attr('y', penaltyAreaY)
    .attr('width', penaltyAreaHeight)
    .attr('height', penaltyAreaWidth)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Corrected dimensions for the goal areas
const goalAreaWidth = shotMapHeight * 0.08;
const goalAreaHeight = shotMapWidth * 0.04;
const goalAreaY = (shotMapWidth - goalAreaWidth) / 2;

// Left goal area
pitch.append('rect')
    .attr('x', 0)
    .attr('y', goalAreaY)
    .attr('width', goalAreaHeight)
    .attr('height', goalAreaWidth)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Right goal area
pitch.append('rect')
    .attr('x', shotMapHeight - goalAreaHeight)
    .attr('y', goalAreaY)
    .attr('width', goalAreaHeight)
    .attr('height', goalAreaWidth)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');
});