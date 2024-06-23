function generateMonthLabels(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const labels = [];

    while (start <= end) {
        const month = start.toLocaleString('default', { month: 'short' });
        const year = start.getFullYear();
        labels.push(`${month} ${year}`);
        start.setMonth(start.getMonth() + 1);
    }

    return labels;
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateMonthLabels };
}
