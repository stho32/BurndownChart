function calculateTrendline(data, length) {
    const n = data.length;
    const sumX = n * (n - 1) / 2;
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = (n - 1) * n * (2 * n - 1) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return Array.from({ length }, (_, x) => Math.max(slope * x + intercept, 0));
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTrendline };
}
