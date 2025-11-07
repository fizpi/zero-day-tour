function formatDateCustom(date) {
    const parts = new Intl.DateTimeFormat('en-US', optionsSpecificOrder).formatToParts(date);
    const day = parts.find(p => p.type === 'day').value;
    const month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;
    
    return `${day} ${month}, ${year}`;
}
const optionsISTMonthName = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short', // 'Nov'
    year: 'numeric'
};

const optionsIST = {
    timeZone: 'Asia/Kolkata', // The IANA code for IST
    day: '2-digit',
    month: '2-digit', // Numeric month
    year: 'numeric'
};

export function fomatDDMMYYYY(date) {
    const formattedDDMMYYYY_IST = new Intl.DateTimeFormat('en-GB', optionsIST).format(date);
    return formattedDDMMYYYY_IST;
}
export default function formatDDMONYYYY(date) {
    const parts = new Intl.DateTimeFormat('en-US', optionsISTMonthName).formatToParts(date);
    const day = parts.find(p => p.type === 'day').value;
    const month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;
    return `${day} ${month}, ${year}`;
}
export function formatDDMON(date) {
    const parts = new Intl.DateTimeFormat('en-US', optionsISTMonthName).formatToParts(date);
    const day = parts.find(p => p.type === 'day').value;
    const month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;
    return `${day} ${month}`;
}