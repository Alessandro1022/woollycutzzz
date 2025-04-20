export const formatDateToTime = (_date) => {
    if (_date) {
        const date = new Date(_date);
        const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
        return time;
    }
}

