describe("Book Sorting App", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/lists/current/hardcover-fiction.json", {
      fixture: "nyt-books.json",
    }).as("getBooks");

    cy.visit("/");
    cy.wait("@getBooks");
  });

  it("displays fetched books in table", () => {
    cy.get('[data-test="books-table"] tbody tr').should("have.length", 2);
  });

  it("sorts by Author descending", () => {
    cy.get('[data-test="sort-select"]').select("author");
    cy.get('[data-test="order-select"]').select("desc");
    cy.get('[data-test="books-table"] tbody tr').first().contains("Matt Haig");
  });
});
