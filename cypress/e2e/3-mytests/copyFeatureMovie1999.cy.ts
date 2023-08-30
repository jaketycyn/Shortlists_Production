describe("Copy Feature MovieList 1999 Movies", () => {
  it("should copy Feature MovieList 1999 Movies into the user's My Lists section on the homepage", () => {
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
    cy.url().should("eq", "http://localhost:3000/"); // replace with your expected UR

    //Click on Best Animated Films
    cy.get("[data-testid=featured-item-0]").click();

    //Click on the +Add to My List button
    cy.get("[data-testid=add-list-button]").click();

    cy.url().should("eq", "http://localhost:3000/");
  });
});
