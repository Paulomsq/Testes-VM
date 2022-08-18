// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('TS', ()=>{
    //Indo para aba TS
    cy.contains('a', 'TS').click();
    cy.wait(1000);
    
    //Verificando se o componente da lista de papéis está carregando
    cy.get('#component_5');
    
    //Fechando Tour caso exista
    cy.get('body')
    .then($body => {
        if($body.find('div[uib-modal-window="modal-window"]').hasClass('modal')){
        cy.contains('button', 'Pular Tour').click();
        }
    });
})

Cypress.Commands.add('login', (login, senha, dia, mes, ano, CPF) => {
    //Preenchendo login 
    cy.get('#login')
      .should('be.visible')
      .type(login);//CPF ou Conta
    
    cy.get('#password')
      .should('be.visible')
      .type(senha);//Senha
    
    cy.contains('button', 'Acessar')
    .should('be.visible')
    .click();

    cy.wait(1500);

    //Respondendo pergunta secreta
    
    cy.get(`.login-question-input`).then(($lq) => {
      if ($lq.hasClass('one')) {
        cy.get('#inputSafetyQuestion').type(dia);//Dia
      }else if($lq.hasClass('two')){
        cy.get('#inputSafetyQuestion').type(mes);//Mês
      }else if($lq.hasClass('four')){
        cy.get('#inputSafetyQuestion').type(ano);//Ano
      }else if($lq.hasClass('three')){
        cy.get('#inputSafetyQuestion').type(CPF);//CPF     
      }
    })
    cy.contains('button','Enviar').click();
    cy.wait(1000);
})

Cypress.Commands.add('menuGrafico', (action, classe) => {
    cy.get('ts-widget-header[unique-id="icwCtrl.widget.uniqueId"] > #welcome-tour-11 > .ts-widget-toolbar-right > .dropdown').invoke(action, classe);
})