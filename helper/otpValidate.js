export const expiryOtp = (otpTime) => {
    try {
        const currentDate = new Date();
        const valDiff = (currentDate.getTime() - otpTime) / 1000; // seconds elapsed
        const minutes = valDiff / 60;

        console.log("Minutes elapsed:", Math.abs(minutes));

        return minutes > 1; // true = expired
    } catch (error) {
        console.error("OTP expiry check failed:", error);
        return false;
    }
};