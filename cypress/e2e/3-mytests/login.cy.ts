describe("Login Test", () => {
  it("should log in with valid credentials", () => {
    // Navigate to your login page
    cy.visit("http://localhost:3000/login"); // replace with the path to your login page

    // Find the email input and type the email
    cy.get("input[type=email]").type("jake@gmail.com");

    // Find the password input and type the password
    cy.get("input[type=password]").type("jake1");

    // Find the login button and click it
    cy.get("button[type=submit]").click();

    // Add assertions to check whether the login was successful.
    // For example, you might expect to be redirected to a specific URL after login:
    cy.url().should("eq", "http://localhost:3000/"); // replace with your expected URL

    // Or you might expect certain elements to be visible only when logged in:
    // cy.get('.some-element-available-only-when-logged-in').should('be.visible');
  });
});
