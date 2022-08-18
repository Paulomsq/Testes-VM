//Definindo variáveis de dia e mês
const now = new Date();
let mes = now.getMonth() + 1;
let dia = now.getDate();
  if(mes <= 9){
    mes = '0' + mes;
  };

describe('Abertura do Dia', () => {
  context('Abertura Geral',() => {
    beforeEach(() => {

      //Configuração para screenshots
      Cypress.Screenshot.defaults({
        overwrite: true,
        capture:'viewport',
      });

      //Ignora erros uncaught:exception 
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      });

      //Regula tamanho de tela para teste - w/h
      cy.viewport(1280, 720);
      

      //Entra em Homebroker
      cy.visit('/', {timeout : 35000});
      cy.wait(1000);
      
      //Realiza login com informações presentes em acesso.json
      cy.readFile('cypress/fixtures/acesso.json').then((user) => {
        let p = 1;
        cy.login(user[p].login, user[p].senha, user[p].dia, user[p].mes, user[p].ano, user[p].cpf);
      });
    });
  
    //OK
    it('Verifica se está logando', () => {
      
      //Validando requisição de autenticação
      cy.request({
        method : 'GET',
        url: 'https://hb-services.guideinvestimentos.com.br:443/Products/auth/AuthenticationService.cfc',
        body : Cypress.env()
        }).then((res) => {
            expect(res.status).to.be.equal(200);
            expect(res).to.have.property('isOkStatusCode');
        });

      //Verifica a conta presente em custódia 
      cy.get('.cg-busy-default-sign').should('not.be.visible');
      cy.readFile('cypress/fixtures/acesso.json').then((user) => {
        cy.contains('button', `${user[1].conta}`)
          .should('be.visible')
          .invoke('text')
          .should('be.not.empty');
      });

      cy.screenshot(`Login ${dia}/${mes}`);
    });

    //OK
    it('Validando Pedra', ()=>{
      
      //Indo para TS
      cy.TS();
      
      //Verifica se o componente de pedra está em tela
      cy.get('#component_5')
        .should('be.visible')
        .and('not.be.empty');

      //Validando se título da pedra está atualizando conforme papel
      //**** NECESSÁRIO que os papéis testados estejam disponíveis em tela
      //**** NECESSÁRIO que o campo "Ativo" do grid da lista esteja na 3 coluna ao lado direito de "Papel"
      
      //Procura o papel na lista de papéis
      cy.contains('div', 'TF473 ').click();
      cy.wait(4000);

      //Compara o campo "Ativo" do papel selecionado com o nome presente na pedra
      cy.contains('div > [grid="grid"]', 'TF473 ')
        .should('be.visible')
        .children('.ui-grid-coluiGrid-0009')
        .invoke('prop', 'outerText')
        .then(op => {
          cy.get('.ts-pedra-title > h4')
            .invoke('prop', 'outerText')
            .should(tt => {
              expect(tt).to.contain(op);
            });
        });

      cy.get('.ranking-sell-header-cell > .text-center')
        .should('not.be.empty')
        .and('be.visible')
        .and('contain', 'venda')
        .parents('table')
        .children('tbody')
        .should('not.be.empty')
        .and('be.visible');

      cy.get('.ranking-buy-header-cell > .text-center')
        .should('not.be.empty')
        .and('be.visible')
        .and('contain', 'compra')
        .parents('table')
        .children('tbody')
        .should('not.be.empty')
        .and('be.visible');

      cy.screenshot(`Pedra ${dia}/${mes}`);
        
    });

    //OK
    it('Validando Lista de papéis', () => {
      
      //Indo para TS
      cy.TS();

      //Verifica se componente de Lista de Papeis está visível
      cy.get('#component_6').should('be.visible');

      //Verifica se o papel selecionado está presente na lista de papeis 
      cy.contains('div', 'TF473 ')
        .should('be.visible')
        .and('not.be.empty');

      //Verifica se o papel selecionado está presente na lista de papeis 
      cy.contains('div', 'PETR4 ')
        .should('be.visible')
        .and('not.be.empty');
      
      cy.screenshot(`ListaDePapeis ${dia}/${mes}`);
    });


    //OK
    it('Validando notícias', () => {
      
      //Indo para TS
      cy.TS();

      //Acessa aba notícias
      cy.get('li[uib-tooltip="Notícias"]').click();
      cy.contains('th', 'Publicação', {timeout:20000}).should('be.visible');

      //Valida se a primeira notícia corresponde ao dia/mes atual
      cy.get('.table > tbody > :nth-child(1) > :nth-child(1)').invoke('prop', 'innerText').should(dtNoticia => {
        expect(dtNoticia).to.contain(dia + '/' + mes);
      });
      cy.screenshot(`Notícias ${dia}/${mes}`);
    });

    //OK
    it('Validando gráfico', () => {

      //Indo para TS
      cy.TS();
      
      //Seleciona o papel
      cy.contains('div', 'TF473 ')
        .should('be.visible')
        .click();

      //Espera carregar gráfico
      cy.get('.cg-busy-default-sign').should('not.be.visible');
      //Verifica a mudança de papel
      cy.get('.pull-left.ng-isolate-scope > .input-stock-selector').invoke('prop', 'value').should('contain', 'TF473');
      //Verifica se acha linhas do gráfico
      cy.get('.highcharts-series-1.highcharts-tracker').find('path');
      cy.wait(1500);
      //Evidencia o gráfico de hoje
      cy.screenshot(`GráficoHoje ${dia}/${mes}`);

      //Indo para o gráfico de ontem
      cy.contains('button', 'Hoje')
        .should('be.visible')
        .click();
      cy.contains('a', 'Ontem')
        .should('be.visible')
        .click();

      //Espera carregar gráfico
      cy.wait(1500);
      cy.get('.cg-busy-default-sign').should('not.be.visible');
      //Verifica se acha linhas do gráfico
      cy.get('.highcharts-tracker').find('path');
      //Evidencia o gráfico de hoje
      cy.screenshot(`GráficoOntem ${dia}/${mes}`);

    });

    //OK
    it('Validando Ranking Corretoras', () => {
      
      //Indo para TS
      cy.TS();

      //Adiciona o nome do papel a uma variável
      cy.contains('div', 'TF473 ').click().invoke('prop', 'outerText').then(p => {
        
        //Vai para Ranking Corretoras
        cy.menuGrafico('addClass', 'open');
        cy.wait(1000);
        cy.contains('a', 'Ranking Corretoras').click();
        cy.menuGrafico('removeClass', 'open');
        
        //Verifica item de Ranking Corretoras
        cy.get('.ng-scope > .nav > li').invoke('prop', 'outerText').should('contain', 'Ranking de Corretoras');
        
        //Compara se o nome do papel é o mesmo encontrado no item de ranking corretoras
        cy.get('.pull-left.ng-isolate-scope > .input-stock-selector').invoke('prop', 'value').should(v => {
            expect(v).to.contain(p);
        });
      });
      //Verifica se a lista de compra e venda está visível
      cy.get('div.ranking-container > .ranking-brokerage').should('be.visible').and('not.be.empty');

      cy.screenshot(`RankingCorretoras ${dia}/${mes}`);
    });

    //OK
    it('Validando Aluguel', () => {
      
      //Indo para o TS
      cy.TS();

      //Testando com papel que não monta gráfico
      cy.contains('div', 'TF473 ').click();

      //Abrindo Aba de aluguel
      cy.contains('div', 'TF473 ').invoke('prop', 'outerText').then(p => {
        cy.menuGrafico('addClass', 'open');
        cy.wait(1000);
        cy.contains('a', 'Aluguel').click();
        cy.menuGrafico('removeClass', 'open');
        //Comparando se o papel selecionado é o mesmo demonstrado em aluguel
        cy.get('.pull-left.ng-isolate-scope > .input-stock-selector').invoke('prop', 'value').should(v => {
          expect(v).to.contain(p);
        });
      });
      
      //Aguarda gráfico carregar 
      cy.wait(1500);
      cy.get('.cg-busy-default-sign').should('not.be.visible');

      //Compara se o papel demonstrado na gráfico é mesmo que o selecionado
      cy.get('.highcharts-axis').last().children().should('contain', 'TF473');

      //Compara quantidade de linhas no gráfico
      cy.get('.highcharts-series.highcharts-series-3 > path').should('be.visible').invoke('prop', 'outerHTML').then(pro => {
        pro = pro.length;
        if(pro > 132){
          cy.log('Aluguel OK!');
          cy.screenshot(`Aluguel-OK ${dia}/${mes}`);
        }else{
          cy.log('Aluguel NOK!');
          cy.screenshot(`Aluguel-NOK ${dia}/${mes}`);
        }
      });

      //Testando com papel que monta gráfico
      cy.contains('div', 'ITSA4 ').click();

      //Aguarda gráfico carregar 
      cy.wait(1500);
      cy.get('.cg-busy-default-sign').should('not.be.visible');

      //Compara se o papel demonstrado na gráfico é mesmo que o selecionado
      cy.get('.highcharts-axis').last().children().should('contain', 'ITSA4');

      //Compara quantidade de linhas no gráfico
      cy.get('.highcharts-series.highcharts-series-3 > path').should('be.visible').invoke('prop', 'outerHTML').then(pro => {
        pro = pro.length;
        if(pro > 132){
          cy.log('Aluguel OK!');
          cy.screenshot(`Aluguel-OK ${dia}/${mes}`);
        }else{
          cy.log('Aluguel NOK!');
          cy.screenshot(`Aluguel-NOK ${dia}/${mes}`);
        }
      });
    });

    //OK
    it('Validando alerta de preço', () => {
      
      //Indo para TS
      cy.TS();

      //Seleciona ativo
      cy.wait(2000);
      cy.contains('div', 'TF473 ')
        .should('be.visible')
        .click();
      cy.get('.pull-left.ng-isolate-scope > .input-stock-selector').invoke('prop', 'value').should('contain', 'TF473');
      cy.wait(6000);

      //Dispara alerta 
      cy.get('#ts-pedra-alert > .fa-clock-o').click();
      cy.get(':nth-child(2) > .col-md-3 > .form-control').type('1');
      cy.get(':nth-child(3) > .col-md-3 > .form-control').type('1');
      cy.contains('button', 'Enviar')
        .should('be.visible')
        .click();
      
      //Verifica alerta
      cy.get(':nth-child(n) > .toast-message > .ng-binding')
        .should('be.visible')
        .and('contain', 'TF473');

      //Evidência
      cy.screenshot(`Cotação ${dia}/${mes}`);

    });
  });

  context.only('Envio de ordem',() => {
    before(() => {

      //Configuração para screenshots
      Cypress.Screenshot.defaults({
        overwrite: true,
        capture:'viewport',
      });

      //Ignora erros uncaught:exception 
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      });

      //Regula tamanho de tela para teste - w/h
      cy.viewport(1280, 720);
      

      //Entra em Homebroker
      cy.visit('/', {timeout : 150000});
      cy.wait(1000);
      
      //Realiza login
      //Digitar na ordem: login, senha, dia, mes, ano, CPF
      cy.readFile('cypress/fixtures/acesso.json').then((user) => {
        cy.login(user[0].login, user[0].senha, user[0].dia, user[0].mes, user[0].ano, user[0].cpf);
      })
      //cy.login('44539679856', 'Pa75667388', '11', '01', '2001', '445');
      
    });

    it('Validando Envio de ordem', () => {
      
      //Indo para TS
      cy.TS();
      
      //Seleciona ativo
      cy.contains('div', 'TF473 ').click();
      
      //Faz a compra do ativo
      cy.contains('button', 'Compra').click();
      cy.get('input[id="papel-trade"]')
        .should('be.visible');
      cy.get('input[id="qtde-trade"]')
        .should('be.visible')
        .type('1');
      cy.get('input[id="preco-trade"]')
        .should('be.visible')
        .type('5');

      //Confirmação da compra
      cy.contains('button', 'Enviar')
        .should('be.visible')
        .click();
      cy.get('#tour-confirm').click();

      //Valida mensagem de ordem enviada demonstrada na boleta
      cy.contains('div', ' Ordem enviada para o mercado com sucesso')
        .should('be.visible');

      cy.screenshot(`ConfirmaçãoDeOrdem ${dia}/${mes}`);
      
      cy.get('#ts-widget-header > #welcome-tour-11 > .ts-widget-toolbar-right > .pull-left > .btn').click();

      //Indo para LiveOrders
      cy.get('#welcome-tour-3')
      .should('be.visible').click();
    cy.wait(1000);

    //Validando se a ultima ordem enviada foi de TF473
    cy.get('.ui-grid-row-selected > div.ng-isolate-scope > :nth-child(2)')
      .should('contain', 'TF473')
      .parent('div.ng-isolate-scope')
      .children(':nth-child(3)')
      .invoke('prop', 'innerHTML')
      .should(msover => {
        expect(msover).to.contain(`${dia}/${mes}`);
      })

    cy.get('.ui-grid-row-selected > div.ng-isolate-scope > :nth-child(5)')
      .invoke('prop', 'textContent')
      .should('contain', 'Confirmada');

      cy.screenshot(`LiveOrders ${dia}/${mes}`);
    });
  });
});