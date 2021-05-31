describe("Home Page", () => {
    it("loads home page", () => {
        const title = "Flashcards Login";

        cy.server({ force404: true });

        cy.route({
            method: "GET",
            url: "/checkAuth",
            response: {
                isAuthenticated: false,
            },
        });

        cy.visit("/");
        cy.contains(title);
    });
});
