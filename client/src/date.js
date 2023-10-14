
export default function simplifyDate(originalDate) {
    const dateObject = new Date(originalDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); 
    const day = dateObject.getDate().toString().padStart(2, '0'); 
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const simplifiedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return simplifiedDate;
}