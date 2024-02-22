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
.style('position', 'absolute')
.style('left', d => `${calculatePositionAndSize(d).xPosition}px`)
.style('top', d => `${calculatePositionAndSize(d).yPosition}px`)
.style('width', d => `${Math.max(calculatePositionAndSize(d).size, 5)}px`) // Ensure a minimum size
.style('height', d => `${Math.max(calculatePositionAndSize(d).size, 5)}px`) // Ensure a minimum size
.style('border-radius', '50%') // Make them circular
.style('background-color', d => colorBasedOnResult(d))
.style('z-index', '10') // Ensure the z-index is high enough to be above other elements
.on('mouseover', function (event, d) {
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    // Calculate the tooltip position
    let tooltipX = mouseX + 10; // Slight offset from the cursor
    let tooltipY = mouseY - 10; // Slight offset from the cursor

    // Ensure tooltip doesn't go off the right side of the screen
    if (tooltipX + tooltip.node().getBoundingClientRect().width > width) {
        tooltipX = width - tooltip.node().getBoundingClientRect().width - 20; // Adjust based on your tooltip width
    }

    // Ensure tooltip doesn't go off the top of the screen
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
        .style('opacity', 1); // Make the tooltip visible
})
.on('mouseout', function () {
    tooltip.transition()
        .duration(500)
        .style('opacity', 0); // Hide the tooltip
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

// Draw the penalty areas
const penaltyAreaWidth = shotMapWidth * 0.14;
const penaltyAreaHeight = shotMapHeight * 0.18;
const penaltyAreaY = (shotMapHeight - penaltyAreaHeight) / 2;

// Left penalty area
pitch.append('rect')
    .attr('x', 0)
    .attr('y', penaltyAreaY)
    .attr('width', penaltyAreaWidth)
    .attr('height', penaltyAreaHeight)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Right penalty area
pitch.append('rect')
    .attr('x', shotMapWidth - penaltyAreaWidth)
    .attr('y', penaltyAreaY)
    .attr('width', penaltyAreaWidth)
    .attr('height', penaltyAreaHeight)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Draw the goal areas
const goalAreaWidth = shotMapWidth * 0.04;
const goalAreaHeight = shotMapHeight * 0.08;
const goalAreaY = (shotMapHeight - goalAreaHeight) / 2;

// Left goal area
pitch.append('rect')
    .attr('x', 0)
    .attr('y', goalAreaY)
    .attr('width', goalAreaWidth)
    .attr('height', goalAreaHeight)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');

// Right goal area
pitch.append('rect')
    .attr('x', shotMapWidth - goalAreaWidth)
    .attr('y', goalAreaY)
    .attr('width', goalAreaWidth)
    .attr('height', goalAreaHeight)
    .attr('fill', 'none')
    .attr('stroke', '#FFF');
});