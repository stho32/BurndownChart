function calculateTasksRemaining(initialTasks, accomplishments, labels) {
    let remainingTasks = initialTasks;
    const tasksRemaining = [];

    for (const label of labels) {
        const [month, year] = label.split(' ');
        const labelDate = new Date(`${year}-${month}-01`);
        const accomplishment = accomplishments.find(acc => {
            const accDate = new Date(acc.month);
            return accDate.getFullYear() === labelDate.getFullYear() && accDate.getMonth() === labelDate.getMonth();
        });

        if (accomplishment) {
            remainingTasks -= accomplishment.tasks;
            tasksRemaining.push(remainingTasks);
        } else {
            break; // Stop if there is no accomplishment for the current month
        }
    }

    tasksRemaining.unshift(initialTasks); // Add initial tasks to the beginning of the array
    return tasksRemaining;
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTasksRemaining };
}
