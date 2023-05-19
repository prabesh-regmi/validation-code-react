export const getTokens = () => {
    let users = null;
    try {
        users = JSON.parse(localStorage.getItem('accessToken') ?? '');
    } catch (error) {
        users = null;
    }
    return users;
};
