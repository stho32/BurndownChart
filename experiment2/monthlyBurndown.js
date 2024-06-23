class MonthlyBurndownChart {
    constructor(canvasId, labels, tasksRemaining, trendlineData) {
        this.canvasId = canvasId;
        this.labels = labels;
        this.tasksRemaining = tasksRemaining;
        this.trendlineData = trendlineData;
    }

    render() {
        const data = {
            labels: this.labels,
            datasets: [{
                label: 'Tasks Remaining',
                data: this.tasksRemaining.map(value => Math.max(value, 0)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }, {
                label: 'Trendline',
                data: this.trendlineData, // Use pre-calculated trendline data
                borderColor: 'rgba(255, 165, 0, 1)', // Orange color for the trendline
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                borderDash: [5, 5]
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasks Remaining'
                        },
                        min: 0 // Ensure the Y axis starts at 0
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                }
            }
        };

        const ctx = document.getElementById(this.canvasId).getContext('2d');
        new Chart(ctx, config);
    }
}

module.exports = { MonthlyBurndownChart };
