class AlertAsserts {
  static verifyMessage(text: string): void {
    cy.contains(text).should('be.visible');
  }
}

export default AlertAsserts;
