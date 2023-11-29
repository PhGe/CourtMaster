async function login(page) {
    const PAGE_URL_LOGIN = 'https://phge.github.io/CourtMaster/#/login';
    const username = "Phil"
    const password = "123"
    // Go to the page
    await page.goto(PAGE_URL_LOGIN);
    await page.getByPlaceholder('username').fill(username);
    await page.getByPlaceholder('password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for navigation to complete
    await page.waitForTimeout(1500);      
}

module.exports = { login };