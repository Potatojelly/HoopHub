
export function simplifyDate(originalDate) {
    const dateObject = new Date(originalDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); 
    const day = dateObject.getDate().toString().padStart(2, '0'); 
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const simplifiedDate = `${year}-${month}-${day} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return simplifiedDate;
}

export function simplifyDateForMsg(originalDate) {
    const dateObject = new Date(originalDate);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

export function simplifyDateForChatRoom(originalDate) {
    const dateObject = new Date(originalDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth()+1;
    const date = dateObject.getDate();
    let day = dateObject.getDay();
    switch (day) {
        case 0:
            day="Sunday"
            break;
        case 1:
            day="Monday"
            break;
        case 2:
            day="Tuesday"
            break;
        case 3:
            day="Wendsday"
            break;
        case 4:
            day="Thursday"
            break;
        case 5:
            day="Friday"
            break;
        case 6:
            day="Saturday"
            break;
    }

    return `${year}-${month}-${date}, ${day}`;
}