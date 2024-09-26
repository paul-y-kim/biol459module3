document.getElementById('calculate').addEventListener('click', function() {
    const initialConcentrationA = parseFloat(document.getElementById('concentration').value);
    const deltaG = parseFloat(document.getElementById('deltaG').value); // Get ΔG from input

    let equilibriumConcentrationA, equilibriumConcentrationB;

    if (deltaG === 0) {
        // Special case for ΔG = 0
        equilibriumConcentrationA = equilibriumConcentrationB = initialConcentrationA / 2;
    } else {
        // Calculate the factor based on the provided ΔG
        const factor = Math.pow(10, -deltaG / 1.42);
        equilibriumConcentrationB = (factor * initialConcentrationA) / (1 + factor);
        equilibriumConcentrationA = initialConcentrationA - equilibriumConcentrationB;

        // Ensure concentrations do not go negative
        if (equilibriumConcentrationA < 0) {
            equilibriumConcentrationA = 0;
            equilibriumConcentrationB = initialConcentrationA; // All A converts to B
        }
        if (equilibriumConcentrationB < 0) {
            equilibriumConcentrationB = 0;
        }
    }

    // Display results
    document.getElementById('result').innerText = `
        Equilibrium Concentrations:
        A: ${equilibriumConcentrationA.toFixed(2)} mol/L
        B: ${equilibriumConcentrationB.toFixed(2)} mol/L
    `;

    // Update the graph
    updateGraph(initialConcentrationA, equilibriumConcentrationA, equilibriumConcentrationB, deltaG);
});

function updateGraph(initialA, eqA, eqB, deltaG) {
    const ctx = document.getElementById('equilibriumGraph').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous graph

    // Data for the graph
    const data = {
        labels: ['Initial A', 'Equilibrium A', 'Equilibrium B'],
        datasets: [{
            label: 'Concentration (mol/L)',
            data: [initialA, eqA, eqB],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
        }]
    };

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Concentration (mol/L)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: `ΔG = ${deltaG} kJ/mol`
                }
            }
        }
    });
}


