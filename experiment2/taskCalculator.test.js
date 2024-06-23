const { calculateTasksRemaining } = require('./taskCalculator');

describe('calculateTasksRemaining', () => {
    test('calculates tasks remaining correctly', () => {
        const initialTasks = 35;
        const accomplishments = [
            { month: '2024-03-01', tasks: 2 },
            { month: '2024-04-01', tasks: 2 },
            { month: '2024-05-01', tasks: 1 }
        ];
        const labels = [
            'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
            'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
        ];

        const expectedTasksRemaining = [
            35, 33, 31, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30
        ];

        const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
        expect(result).toEqual(expectedTasksRemaining);
    });

    test('handles no accomplishments correctly', () => {
        const initialTasks = 35;
        const accomplishments = [];
        const labels = [
            'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
            'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
        ];

        const expectedTasksRemaining = [
            35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35
        ];

        const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
        expect(result).toEqual(expectedTasksRemaining);
    });

    test('handles all tasks completed correctly', () => {
        const initialTasks = 35;
        const accomplishments = [
            { month: '2024-03-01', tasks: 10 },
            { month: '2024-04-01', tasks: 10 },
            { month: '2024-05-01', tasks: 15 }
        ];
        const labels = [
            'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
            'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
        ];

        const expectedTasksRemaining = [
            35, 25, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
        expect(result).toEqual(expectedTasksRemaining);
    });
});
