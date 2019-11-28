module.exports = {
  generateHTML: (customer, quote) => {
    const header = `
    <div style="font-family:Arial,sans-serif">
    <h1>Dear ${customer.name},</h1>
    <p>Here to present the quote from MingDa Crafts:</p>
    `;

    let itemsList = `<ul>`
    quote.items.forEach(item => {
      itemsList += `<li>${item.name}<br>
                    ${item.sku}
                    </li>`;
    });
    itemsList += `</ul>`;

    const footer = `Yours truly, <br>Anny Wang</div>`

    const html = header + itemsList + footer;
    return html;
  },
  generateHTMLForSignUp: (user) => {
    const header = `
    <div style="font-family:Arial,sans-serf">
    <h2>You just signed up with Mingda Product Database Quote Engine:</h2>`;

    // TODO: add role and address properties to email
    const body = `
    <div>
    <img src="${user.businessCard}">
    <h3>A summary of your account:</h3>
    <p>Username: ${user.username}</p>
    <p>Password: ${user.password}</p>
    <p>Role: ${user.role}</p>
    </div>`;

    const footer = `
    Yours truly, <br>Anny Wang</div>`;

    const html = header + body + footer;
    return html;
  }
}