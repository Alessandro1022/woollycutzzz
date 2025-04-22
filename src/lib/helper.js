export const formatDateToTime = (_date) => {
    if (_date) {
        const date = new Date(_date);
        const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
        return time;
    }
}

export const getNextDate = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}

