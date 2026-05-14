document.getElementById('generar').addEventListener('click', () => {
  let documento = "";

  // Párrafo condicional por fallecimiento
  if (document.getElementById('pensionada').checked) {
    documento += "En primer lugar, corresponde señalar que se ha denunciado el fallecimiento del causante y se ha presentado la pensionada.\n\n";
  } else if (document.getElementById('herederos').checked) {
    documento += "En primer lugar, corresponde señalar que se ha denunciado el fallecimiento del causante y se han presentado los herederos.\n\n";
  } else {
    documento += "Que en las presentes actuaciones se aprobó liquidación y se mandó llevar adelante la ejecución, se trabó embargo por las sumas resultantes de dicho cálculo y se ordenó su transferencia a la cuenta de la actora.\n\n";
  }

  // Párrafo común en todas las sentencias
  const fechaInicio = document.getElementById('fecha_inicio').value;
  const fechaFinal = document.getElementById('fecha_final').value;
  documento += `Persistiendo el incumplimiento por parte de la demandada, la parte actora acompaña una nueva liquidación por las diferencias pendientes de pago devengadas entre el ${fechaInicio} y el ${fechaFinal}.\n\n`;

  // Párrafo sobre intereses
  if (document.getElementById('interes_5').checked) {
    documento += "Asimismo, calcula los intereses desde la fecha de corte del último cómputo aprobado, hasta la efectivización del embargo decretado en autos.\n\n";
  } else if (document.getElementById('interes_6').checked) {
    documento += "Asimismo, calcula los intereses desde la fecha de corte del último cómputo aprobado, hasta la efectivización de la transferencia de las sumas embargadas.\n\n";
  } else if (document.getElementById('interes_7').checked) {
    documento += "Asimismo, calcula los intereses desde la fecha de vencimiento de la intimación al pago del último cómputo aprobado, hasta la efectivización del embargo decretado en autos.\n\n";
  } else if (document.getElementById('interes_8').checked) {
    documento += "Asimismo, calcula los intereses desde la fecha de vencimiento de la intimación al pago del último cómputo aprobado, hasta la efectivización de la transferencia de las sumas embargadas.\n\n";
  }

  // Silente de Anses
  if (document.getElementById('silente').checked) {
    documento += "Corrido el pertinente traslado, la Anses, se mantiene silente.\n\n";
  }

  // Impugnaciones de Anses
  const impugnaciones = [
    { id: "impugnacion_badaro", texto: "La movilidad del fallo Badaro no ha sido correctamente aplicada." },
    { id: "impugnacion_fechas", texto: "Las fechas de inicio y de corte para el cálculo de los intereses son incorrectas." },
    { id: "impugnacion_pbu", texto: "El reajuste de la PBU es incorrecto." },
    { id: "impugnacion_topes", texto: "Se liberan los topes legales." },
    { id: "impugnacion_descuento", texto: "La forma de descontar los pagos es incorrecta." },
    { id: "impugnacion_intereses", texto: "La tasa de interés utilizada es incorrecta." },
    { id: "impugnacion_villanustre", texto: "No se aplica el precedente Villanustre." },
    { id: "impugnacion_impuesto", texto: "No se informa el cálculo correspondiente a la retención del Impuesto a las Ganancias conforme a la Ley Nº 20.628." }
  ];

  let impugnacionesTexto = impugnaciones
    .filter(impugnacion => document.getElementById(impugnacion.id).checked)
    .map((impugnacion, index) => `${index + 1}. ${impugnacion.texto}`)
    .join("\n");

  if (impugnacionesTexto) {
    documento += "Las siguientes impugnaciones fueron planteadas por la parte demandada:\n" + impugnacionesTexto + "\n\n";
  }

  // Resto del texto que se incluye siempre
  const fechaLiqui = document.getElementById('fecha_liqui').value;
  const montoHaber = document.getElementById('monto_haber').value;
  const retroLetras = document.getElementById('retro_letras').value;
  const retroApro = document.getElementById('retro_apro').value;
  const montoCapital = document.getElementById('monto_capital').value;
  const montoIntereses = document.getElementById('monto_intereses').value;

  documento += `Así, luego de analizar la liquidación en cuestión y teniendo en cuenta que la misma se ajusta a los parámetros de la sentencia en ejecución, estimo acertado aprobarla.\n\nRESUELVO:\n\n`;
  documento += `1.- Aprobar en cuanto ha lugar por derecho la liquidación presentada por la actora con fecha ${fechaLiqui}, quedando determinado el haber al ${fechaFinal} en la suma de $${montoHaber} y las retroactividades en PESOS ${retroLetras} ($${retroApro}) ($${montoCapital} + $${montoIntereses}).\n\n`;
  documento += `2.- Intimar a la demandada para que en el plazo de diez (10) días, proceda a reajustar el haber previsional conforme a la liquidación aprobada, y abone a la parte actora las retroactividades aprobadas con más sus intereses a la fecha del efectivo pago, bajo apercibimiento de proceder a la traba de embargo ejecutivo sin más trámite. Notifíquese por Secretaría a las partes de forma electrónica.`;

  // Mostrar el documento generado
  document.getElementById('output').value = documento;
});
