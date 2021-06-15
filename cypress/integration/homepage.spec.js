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

describe("Login Page", () => {
    it("sets auth cookie when logging in via form submission", () => {
        cy.server({ force404: true });

        cy.route({
            method: "GET",
            url: "/checkAuth",
            response: {
                isAuthenticated: false,
            },
        });

        cy.visit("/");

        const loggedInUserElement = "Logged in as: testuser2";

        const user = {
            username: "testuser2",
            password: "testpassword123",
        };

        cy.route({
            method: "POST",
            url: "/login",
            response: {
                isAuthenticated: true,
            },
        });

        cy.route({
            method: "GET",
            url: "/checkAuth",
            response: {
                data: {
                    user: "testuser2",
                    isAuth: true,
                },
            },
        });

        cy.route({
            method: "GET",
            url: "/question",
            response: {
                data: {
                    id: 5,
                    question: "test question",
                    answer: "test answer",
                },
            },
        });

        cy.get("input[name=username]").type(user.username);

        cy.get("input[name=password]").type(`${user.password}{enter}`);

        cy.getCookie("flashcards.sid").should("exist");

        cy.contains(loggedInUserElement);
    });
});
