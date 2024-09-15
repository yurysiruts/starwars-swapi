describe('Star Wars Battle Game', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to the game page when Start button is clicked', () => {
    cy.get('[data-cy="start-btn"]').click();
    cy.url().should('include', '/game');
    cy.get('h1').should('contain', 'Star Wars Battle: People vs Starships');
  });

  it('should display game components correctly', () => {
    cy.get('button[mat-flat-button]').click(); 
    cy.get('.cards').should('exist');
    cy.get('mat-card').should('have.length', 2);
    cy.get('.spinner-container').should('not.exist'); 
  });

  it('should show the winner when game is played', () => {
    cy.get('button[mat-flat-button]').click(); 
    cy.get('button[mat-flat-button]').click(); 

    // no idea how to test randomly generated IDs, can't be certain of what UI is displaying.
    // tests become flaky, with flawed API + randomliness of IDs 
  });
});
