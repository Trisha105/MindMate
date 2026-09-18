import Journal from '../models/Journal.js';
import Mood from '../models/Mood.js';
import AppError from '../utils/AppError.js';

// @desc    Get user stats including streak
// @route   GET /api/stats
// @access  Private
export const getStats = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const journalDates = await Journal.find({ userId }, 'date').lean();
        const moodDates = await Mood.find({ userId }, 'date').lean();
        const allDates = [...journalDates.map(entry => entry.date), ...moodDates.map(entry => entry.date)];
        const uniqueDaysSet = new Set(allDates.map(date => new Date(date).toISOString().split('T')[0]));
        const sortedUniqueDays = Array.from(uniqueDaysSet).sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const isYesterday = (currentStr, prevStr) => {
            const current = new Date(currentStr);
            const prev = new Date(prevStr);
            const diffTime = current - prev;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return Math.round(diffDays) === 1;
        };
        if (sortedUniqueDays.length > 0) {
            let currentIndex = 0;
            const latest = sortedUniqueDays[0];
            if (latest === today) { streak = 1; currentIndex = 1; }
            else if (isYesterday(today, latest)) { streak = 1; currentIndex = 1; }
            else { streak = 0; }
            if (streak > 0) {
                for (let i = currentIndex; i < sortedUniqueDays.length; i++) {
                    const prevDate = sortedUniqueDays[i];
                    const currentDate = sortedUniqueDays[i - 1];
                    if (isYesterday(currentDate, prevDate)) streak++;
                    else break;
                }
            }
        }
        res.status(200).json({ status: 'success', data: { streak, totalEntries: sortedUniqueDays.length } });
    } catch (error) { next(error); }
};
