module.exports = {
    stringDate(dt) {
        return `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
    },
    monthDiff(dateFrom, dateTo) {
        return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    },
    calculateDiffDateInDays(a, b) {

        const diffTime = Math.abs(a - b);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }
}