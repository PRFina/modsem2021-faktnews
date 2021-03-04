
function postProcessDate(date) {
    if (date !== null) {
        var [yyyy, mm, dd] = date.split("-");

        var months = {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Mar',
            '04': 'Apr',
            '05': 'May',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }

        return `${dd} ${months[mm]} ${yyyy}`;
    }
    
}

function truncateText(text, limit, endMessage){
    return text.substring(0,limit).concat(" [...] " + endMessage)
}

export { postProcessDate, truncateText };