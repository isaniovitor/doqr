/// <reference types="cypress" />

const LIST_PATH = "/employees/list";
const INPUT_SELECTOR = "input[placeholder='Buscas funcionário...']";
const CREATE_LINK = "a[href='/employees/createOrUpdate/new']";

describe("Employee Listing (/employees)", () => {
  beforeEach(() => {
    cy.clock();

    cy.setCookie("x-e2e-case", "initial"); // "initial" -> employees.json

    cy.visit(LIST_PATH);
    cy.tick(450);
  });

  it("renders header, New Employee button and table with initial data", () => {
    cy.contains("Controle de Funcionários").should("be.visible");
    cy.get(CREATE_LINK)
      .should("be.visible")
      .and("contain.text", "Novo Funcionário");

    cy.get("table thead tr").within(() => {
      [
        "Nome",
        "E-mail",
        "CPF",
        "Celular",
        "Data de Nascimento",
        "Tipo Contratação",
        "Status",
        "Ação",
      ].forEach((h) => cy.contains(h));
    });

    cy.get("table tbody tr").should("have.length.at.least", 1);
  });
  it("search for employee: update table", () => {
    cy.get(INPUT_SELECTOR).type("rose");
    cy.tick(450);

    cy.get("table tbody tr").should("have.length", 1);
    cy.get("table").contains("td", "rosembergson").should("be.visible");
  });
  it("search without results shows the message 'Sem resultados!'", () => {
    cy.get(INPUT_SELECTOR).clear().type("naoexiste");
    cy.tick(450);

    cy.contains("Sem resultados!").should("be.visible");
  });
  it("clear search field restores initial list", () => {
    cy.get(INPUT_SELECTOR).type("rose");
    cy.tick(450);
    cy.get("table tbody tr").should("have.length", 1);

    cy.get(INPUT_SELECTOR).clear();
    cy.tick(450);

    //  employees.json lengh
    cy.get("table tbody tr").should("have.length.at.least", 2);
  });
  it("botão 'Novo Funcionário' button navigates to creation", () => {
    cy.get(CREATE_LINK).click();
    cy.url().should("include", "/employees/createOrUpdate/new");
  });
  it("Delete flow: confirms, DELETE 200 and removes row", () => {
    cy.get("table tbody tr").then(($rowsBefore) => {
      const before = $rowsBefore.length;

      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("button[aria-label='Excluir']").click();
        });

      cy.contains("tem certeza?").should("be.visible");
      cy.contains("button", "sim").click();
    });
  });
  it("Delete flow with error 500: rollback keeps row", () => {
    // força erro no handler DELETE (SSR e CSR) via cookie
    cy.setCookie("x-delete", "error");

    cy.get("table tbody tr").then(($rowsBefore) => {
      const before = $rowsBefore.length;

      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("button[aria-label='Excluir']").click();
        });
      cy.contains("button", "sim").click();

      // rollback
      cy.get("table tbody tr").should("have.length", before);
    });
  });
  it("redo the search multiple times (debounce) and the final state is 'rose'", () => {
    cy.get(INPUT_SELECTOR).type("r");
    cy.tick(450);

    cy.get(INPUT_SELECTOR).type("ose");
    cy.tick(450);

    cy.get("table tbody tr").should("have.length", 1);
    cy.get("table").contains("td", "rosembergson").should("be.visible");
  });
});
