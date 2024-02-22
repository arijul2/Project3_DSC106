//Load the data from the JSON file
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
      let tooltipY = mouseY - 28; // Offset to show above the cursor
    const shotMap = d3.select('#shotMap');
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // Get the dimensions of the tooltip
      const tooltipWidth = tooltip.node().getBoundingClientRect().width;
      const tooltipHeight = tooltip.node().getBoundingClientRect().height;
    // Function to calculate the position and size of the shot points
    function calculatePositionAndSize(d) {
        const xPosition = d.X * shotMap.node().clientWidth;
        const yPosition = (1 - d.Y) * shotMap.node().clientHeight;
        const size = Math.sqrt(d.xG) * 20 // Adjust the size scaling factor as needed
        return { xPosition, yPosition, size };
    }

      // Get the window width and height
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
    // Define colors based on the result
    function colorBasedOnResult(d) {
        return d.result === 'Goal' ? 'green' :
               d.result === 'SavedShot' ? 'darkblue' :
               d.result === 'MissedShots' ? 'red' :
               d.result === 'ShotOnPost' ? 'yellow' :
               d.result === 'BlockedShot' ? 'purple' : 'grey';
    }


      // Check if the tooltip would go off the right side of the screen
      if (mouseX + tooltipWidth > windowWidth) {
          tooltipX = windowWidth - tooltipWidth;
      }

      // Check if the tooltip would go off the bottom of the screen
      if (mouseY + tooltipHeight > windowHeight) {
          tooltipY = mouseY - tooltipHeight;
      }

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

  // Add pitch outline and other pitch elements (e.g., center circle, penalty area)
  // Assume shotMap already contains an SVG element
  const pitch = shotMap.select('svg');

  // Draw the pitch outline
  pitch.append('rect')
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
    const centerCircleRadius = width * 0.07; // Example: 7% of the width for the circle radius

    // Draw the pitch outline
    pitch.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', shotMap.node().clientWidth)
      .attr('height', shotMap.node().clientHeight)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', 'white');

// Draw the center circle
pitch.append('circle')
    .attr('cx', shotMap.node().clientWidth / 2)
    .attr('cy', shotMap.node().clientHeight / 2)
    .attr('r', shotMap.node().clientHeight / 8) // Adjust the radius as needed
    .attr('fill', 'none')
    .attr('stroke', 'white');
    // Draw the halfway line
    pitch.append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'white');

// Draw the penalty area
pitch.append('rect')
    .attr('x', shotMap.node().clientWidth / 2 - shotMap.node().clientWidth / 8) // Adjust for penalty box width
    .attr('y', shotMap.node().clientHeight - (shotMap.node().clientHeight / 4)) // Adjust for penalty box height from the bottom
    .attr('width', shotMap.node().clientWidth / 4) // Penalty box width
    .attr('height', shotMap.node().clientHeight / 4) // Penalty box height
    .attr('fill', 'none')
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

// Draw the half-way line
pitch.append('line')
    .attr('x1', 0)
    .attr('y1', shotMap.node().clientHeight / 2)
    .attr('x2', shotMap.node().clientWidth)
    .attr('y2', shotMap.node().clientHeight / 2)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);
    // Draw the goal areas (smaller rectangles inside the penalty areas)
    const goalYPosition = (height - goalAreaHeight) / 2;

// Draw the penalty spot
pitch.append('circle')
    .attr('cx', shotMap.node().clientWidth / 2)
    .attr('cy', shotMap.node().clientHeight - (shotMap.node().clientHeight / 8)) // Adjust distance from the bottom
    .attr('r', 2) // Adjust the radius as needed
    .attr('fill', 'white');
    // Left goal area
    pitch.append('rect')
      .attr('x', 0)
      .attr('y', goalYPosition)
      .attr('width', goalAreaWidth)
      .attr('height', goalAreaHeight)
      .attr('fill', 'none')
      .attr('stroke', 'white');

// Draw the goal area (smaller box inside penalty area)
pitch.append('rect')
    .attr('x', shotMap.node().clientWidth / 2 - shotMap.node().clientWidth / 16) // Adjust for goal box width
    .attr('y', shotMap.node().clientHeight - (shotMap.node().clientHeight / 8)) // Adjust for goal box height from the bottom
    .attr('width', shotMap.node().clientWidth / 8) // Goal box width
    .attr('height', shotMap.node().clientHeight / 8) // Goal box height
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