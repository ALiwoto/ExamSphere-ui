
export const calculateTimeDifference = (time: number) => {
    const units = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (let { label, seconds } of units) {
        const interval = Math.floor(time / seconds);
        if (interval >= 1) {
            return { interval, unit: label };
        }
    }

    return { interval: 0, unit: '' };
};

export const timeAgo = (date: string | number | Date): string => {
    const now = new Date().valueOf();
    const targetDate = new Date(date).valueOf();
    const time = Math.floor(Math.abs(now - targetDate) / 1000);
    const isFuture = targetDate > now;
    const { interval, unit } = calculateTimeDifference(time);
    const suffix = interval === 1 ? '' : 's';

    return isFuture
        ? `${interval} ${unit}${suffix} in the future`
        : `${interval} ${unit}${suffix} ago`;
};

export const getUTCUnixTimestamp = (date: Date): number => {
    if (date === undefined || date === null) {
        return 0;
    }
    
    // Create a new Date object set to the UTC time
    const utcDate = new Date(date.toUTCString());

    // Get the UNIX timestamp (in milliseconds)
    const unixTimestamp = utcDate.getTime();

    // Return the UNIX timestamp in seconds
    return Math.floor(unixTimestamp / 1000);
}

export const getDateFromServerTimestamp = (serverData: any): Date | null => {
    if (typeof serverData == 'number') {
        return new Date(serverData * 1000);
    } else if (typeof serverData == 'string') {
        return new Date(serverData);
    } else if (serverData instanceof Date) {
        return serverData;
    } else if (serverData === undefined || serverData === null) {
        return null;
    }

    console.log(`Invalid server data: ${serverData}`);
    throw new Error('Invalid server data');
}

