/// <reference types="cypress" />

const BASE_PATH = "/employees/createOrUpdate";

describe("Employee creation/edit page", () => {
  beforeEach(() => {
    cy.clock();
    cy.clearCookies();

    cy.clock();
  });

  it("opens the creation screen and registers the new employee", () => {
    cy.visit(`${BASE_PATH}/new`);
    cy.tick(450);

    cy.contains("Criar de Funcionário").should("be.visible");

    cy.get("input#name").type("Novo Func");
    cy.get("input#email").type("novo@example.com");
    cy.get("input#cpf").type("12345678901");
    cy.get("input#phone").type("11999999999");
    cy.get("input#dateOfBith").type("01011990");

    cy.contains("button", "Cadastrar").click();
    cy.url().should("include", "/employees/list");
  });
  it("opens editing screen, shows employee data and saves changes", () => {
    cy.setCookie("x-e2e-case", "employee-1");
    cy.visit(`${BASE_PATH}/36`);
    cy.tick(450);

    cy.contains("Editar de Funcionário").should("be.visible");

    cy.get("input#name").should("have.value", "Alice Teste");

    cy.get("input#name").clear().type("Alice Editada");
    cy.contains("button", "Editar").click();

    cy.url().should("include", "/employees/list");
  });
  it("on the edit screen, delete button removes and redirects", () => {
    cy.setCookie("x-e2e-case", "employee-1");
    cy.visit(`${BASE_PATH}/1`);
    cy.tick(450);

    cy.contains("button", "Excluir").click();
    cy.url().should("include", "/employees/list");
  });
});
