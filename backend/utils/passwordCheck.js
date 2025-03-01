const passwordCheck = (pw) => {
    // criteria 1: password must be at least 8 characters
    // criteria 2: there must be at least one uppercase letter
    // criteria 3: there must be at least one lowercase letter
    // criteria 4: there must be at least one number
    const c1 = pw.length >= 8;
    const c2 = /[A-Z]/.test(pw);
    const c3 = /[a-z]/.test(pw);
    const c4 = /[0-9]/.test(pw);

    return c1&&c2&&c3&&c4;
}

export default passwordCheck;