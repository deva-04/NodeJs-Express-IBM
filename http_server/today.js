// today.js
module.exports.getDate = function getDate() {
    // Get the current date and time in the timezone "Asia/Kolkata" (IST)
    let istTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});

    // Convert the formatted string back to a Date object
    return new Date(istTime);
};
