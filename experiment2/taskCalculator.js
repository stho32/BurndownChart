function calculateTasksRemaining(initialTasks, accomplishments, labels) {
    let remainingTasks = initialTasks;
    const tasksRemaining = labels.map(label => {
        const [month, year] = label.split(' ');
        const labelDate = new Date(`${year}-${month}-01`);
        const accomplishment = accomplishments.find(acc => {
            const accDate = new Date(acc.month);
            return accDate.getFullYear() === labelDate.getFullYear() && accDate.getMonth() === labelDate.getMonth();
        });
        if (accomplishment) {
            remainingTasks -= accomplishment.tasks;
        }
        return remainingTasks;
    });
    tasksRemaining.unshift(initialTasks); // Add initial tasks to the beginning of the array
    return tasksRemaining;
}

module.exports = { calculateTasksRemaining };
