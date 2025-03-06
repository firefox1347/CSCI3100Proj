const genderCheck = (gender) => {
    if(gender === "male" || gender === "female" || gender === "other"){
        return true;
    }
    else return false;
}
export default genderCheck;