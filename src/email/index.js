const SecurityToken = '6f52ceaf-795e-40d7-9369-caa4dfff259d';

function sendEmail(to, entradas, fechaVisita) {
  Email.send({
    // Host : host,
    // Username : username,
    // Password : password,
    SecureToken: SecurityToken,
    To : to,
    From : username,
    Subject : "Confirmación de compra | MuseoGRX",
    Body : `<h1>Buenas ${to}.</h1>
    <br>
    <br>
    <h3>Su compra se ha realizado con éxito. A continuación se le muestra un resumen de la misma:</h3>`
    + entradas.map(entrada => `<br><br><h3>Entrada ${entrada.tipo}</h3><br><p>Precio: ${entrada.precio}€ cada una</p><br><p>Cantidad: ${entrada.acc}</p>`).join("")
    + `<br><br><p>Fecha de validez: ${fechaVisita}</p>`
    + `<br><br><p>Total: ${entradas.reduce((total, entrada) => total + entrada.acc * entrada.precio, 0)}€</p>`
    + `<br><br><p>Gracias por su compra.</p>`
    + `<br><br><p>Un saludo, MuseoGRX</p>`
    + `<br><br><p>Este correo es automático, por favor no responda.</p>`    
}
  ).then(
    message => console.log(message)
  );
}


export default sendEmail;