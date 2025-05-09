// Componente principal
const SentenciaGenerator = () => {
    // Estados
    const [fallecimiento, setFallecimiento] = React.useState({
        pensionada: false,
        herederos: false
    });

    const [fechas, setFechas] = React.useState({
        inicio: '',
        final: '',
        liquidacion: ''
    });

    const [montos, setMontos] = React.useState({
        haber: '',
        retroactivo: '',
        capital: '',
        intereses: ''
    });

    const [tipoInteres, setTipoInteres] = React.useState('');
    const [ansesImpugno, setAnsesImpugno] = React.useState(false);
    const [ansesPresentoLiquidacion, setAnsesPresentoLiquidacion] = React.useState(true);
    const [impugnaciones, setImpugnaciones] = React.useState({
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        h: false,
        i: false
    });
    const [generado, setGenerado] = React.useState('');

    // Funciones auxiliares
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatearMonto = (valor) => {
        if (!valor) return '0,00';
        const numero = parseFloat(valor.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        return numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const numeroALetras = (monto) => {
        if (!monto) return 'PESOS CERO';
        const numero = parseFloat(monto.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        return `PESOS ${numero.toFixed(2)}`;
    };

    const handleMontoChange = (e, campo) => {
        const valor = e.target.value.replace(/[^\d.,]/g, '');
        setMontos(prev => ({...prev, [campo]: valor}));
    };

    const handleFechaChange = (e, campo) => {
        setFechas(prev => ({...prev, [campo]: e.target.value}));
    };

    const generarListaImpugnaciones = () => {
        const mapImpugnaciones = {
            a: "que las fechas de inicio y de corte para el cálculo de los intereses son incorrectas",
            b: "que la movilidad del fallo Badaro no ha sido correctamente aplicada",
            c: "que el reajuste de la PBU es incorrecto",
            d: "que la tasa de interés aplicada es incorrecta",
            e: "que los haberes percibidos son incorrectos",
            f: "que la forma de descontar los pagos es incorrecta",
            g: "que se liberan los topes legales",
            h: "que no se aplica el precedente Villanustre",
            i: "que no se informa el cálculo correspondiente a la retención del Impuesto a las Ganancias conforme a la Ley Nº 20.628"
        };

        const impugnacionesActivas = Object.entries(impugnaciones)
            .filter(([_, v]) => v)
            .map(([k]) => mapImpugnaciones[k]);

        if (impugnacionesActivas.length === 0) return "";
        if (impugnacionesActivas.length === 1) return impugnacionesActivas[0];
        return impugnacionesActivas.slice(0, -1).join(", ") + ", y " + impugnacionesActivas[impugnacionesActivas.length - 1];
    };

    const generarTexto = () => {
      const parrafos = [];
  
      if (fallecimiento.pensionada) {
          parrafos.push("En primer lugar, corresponde señalar que se ha denunciado el fallecimiento del causante y se ha presentado la pensionada.");
          parrafos.push("Que en las presentes actuaciones se aprobó liquidación y se mandó llevar adelante la ejecución, se trabó embargo por las sumas resultantes de dicho cálculo y se ordenó su transferencia a la cuenta de la actora.");
      } else if (fallecimiento.herederos) {
          parrafos.push("En primer lugar, corresponde señalar que se ha denunciado el fallecimiento del causante y se han presentado los herederos.");
          parrafos.push("Que en las presentes actuaciones se aprobó liquidación y se mandó llevar adelante la ejecución, se trabó embargo por las sumas resultantes de dicho cálculo y se ordenó su transferencia a la cuenta de la actora.");
      } else {
          parrafos.push("Que en las presentes actuaciones se aprobó liquidación y se mandó llevar adelante la ejecución, se trabó embargo por las sumas resultantes de dicho cálculo y se ordenó su transferencia a la cuenta de la actora.");
      }
  
      parrafos.push(`Persistiendo el incumplimiento por parte de la demandada, la parte actora acompaña una nueva liquidación por las diferencias pendientes de pago devengadas entre el ${formatearFecha(fechas.inicio)} y ${formatearFecha(fechas.final)}.`);
  
      parrafos.push(`Persistiendo el incumplimiento por parte de la demandada, la parte actora acompaña una nueva liquidación por las diferencias pendientes de pago devengadas entre el ${formatearFecha(fechas.inicio)} y ${formatearFecha(fechas.final)}.`);

        const tiposInteresParrafos = {
            corteEmbargo: "Asimismo, calcula los intereses desde la fecha de corte del último cómputo aprobado, hasta la efectivización del embargo decretado en autos.",
            corteTransferencia: "Asimismo, calcula los intereses desde la fecha de corte del último cómputo aprobado, hasta la efectivización de la transferencia de las sumas embargadas.",
            intimacionEmbargo: "Asimismo, calcula los intereses desde la fecha de vencimiento de la intimación al pago del último cómputo aprobado, hasta la efectivización del embargo decretado en autos.",
            intimacionTransferencia: "Asimismo, calcula los intereses desde la fecha de vencimiento de la intimación al pago del último cómputo aprobado, hasta la efectivización de la transferencia de las sumas embargadas."
        };

        if (tipoInteres && tiposInteresParrafos[tipoInteres]) {
            parrafos.push(tiposInteresParrafos[tipoInteres]);
        }

        if (ansesImpugno) {
            parrafos.push(`Corrido el pertinente traslado, la Anses impugna dicha liquidación, aduciendo ${generarListaImpugnaciones()}.`);
            parrafos.push("La parte actora contesta el traslado conferido y solicita que se rechacen las impugnaciones y el planteo de la ejecutada, por los fundamentos allí expuestos a los que me remito en honor a la brevedad, y que se apruebe la liquidación por ella practicada.");

            if (impugnaciones.a) {
                if (tipoInteres === 'corteEmbargo' || tipoInteres === 'corteTransferencia') {
                    parrafos.push('En torno al cálculo de intereses efectuado por la actora desde la fecha de corte del último cómputo aprobado, cabe puntualizar que la Suscripta comparte el criterio sustentado por la Sala I de la CFSS en la causa "FREUND JORGE CARLOS c/anses s/ otros - ejecución previsional" de fecha 25/11/2019 exp. 15156/12, donde sostuvo que "...la Tasa Pasiva para Uso de la Justicia (Com. A 14.290 BCRA) tiene implícita la capitalización en su fórmula de cálculo, aplicarla a un importe compuesto de capital e intereses no produce anatocismo...". En consecuencia, corresponde rechazar el planteo de la Anses en tal sentido.');
                } else if (tipoInteres === 'intimacionEmbargo') {
                    parrafos.push('En cuanto al cálculo de intereses, observo que ha sido practicado de conformidad a lo dispuesto por el art. 770 inc. c del CCCN, por lo que corresponde desestimar los cuestionamientos.');
                } else if (tipoInteres === 'intimacionTransferencia') {
                    parrafos.push('En cuanto al cálculo de intereses, observo que ha sido practicado de conformidad a lo dispuesto por el art. 770 inc.c del CCCN y hasta la fecha de efectivización de la transferencia del importe embargado, a la cuenta de titularidad del actor. (Conf. "Dietl Enrique Arturo c/Anses s/ Amparos y Sumarisimos, CFSS, Sala II del 24.10.18), por lo que corresponde desestimar los cuestionamientos.');
                }
            }

            if (impugnaciones.d) {
                parrafos.push("Asimismo, observo que la actora aplica la tasa de interés ordenada en la Sentencia que se ejecuta, por lo que corresponde desestimar la impugnación en tal sentido.");
            }
            if (impugnaciones.e) {
                parrafos.push("Ahora bien, en cuanto a los haberes percibidos, toda vez que los mismos coinciden en su totalidad con los que surgen de la página web de Anses, corresponde sin más desestimar la impugnación.");
            }
            if (impugnaciones.f) {
                parrafos.push("Ahora bien, en cuanto a la forma de descontar los pagos efectuados, toda vez que la parte actora los deduce correctamente, corresponde sin más desestimar la impugnación.");
            }
            if (impugnaciones.i) {
                parrafos.push("Ahora bien, toda vez que la cuestión relativa a la aplicación del impuesto a las ganancias ya ha sido resuelta oportunamente en autos, corresponde sin más desestimar la impugnación.");
            }

            if (impugnaciones.b || impugnaciones.c || impugnaciones.g || impugnaciones.h) {
                parrafos.push("Con respecto a las restantes impugnaciones, toda vez que la presente se trata de una liquidación ampliatoria, y que al haber aprobado oportunamente se le aplican únicamente los índices de movilidad dispuestos por ley, a las impugnaciones no ha lugar.");
            }
        } else {
            parrafos.push("Corrido el pertinente traslado, la Anses, se mantiene silente.");
            parrafos.push("La parte actora solicita se apruebe la liquidación por ella practicada.");
        }

        if (!ansesPresentoLiquidacion) {
            parrafos.push('Cabe recordar además, que la impugnación de la liquidación en forma genérica, sin especificación de lo que se considera desacertado: ni en el aspecto aritmético, ni en lo atinente a las demás cuestiones fácticas o jurídicas, es desestimable porque en tales condiciones, carece de fundamento susceptible de ponderación. La impugnación, para ser examinable, requiere el suministro de los cálculos correctos y de cuya comparación surgiría el error. (En el mismo sentido Cámara Comercial Sala C "Acrílicos Salerno S.A. s/ concurso s/ incid. de verificación, 31/8/89; Cámara Comercial Sala B "Curtarsa curtiembre Argentina S.A. c/ Lekeitto S.A., 18/10/88).');
        }

        parrafos.push("Así, luego de analizar la liquidación en cuestión y teniendo en cuenta que la misma se ajusta a los parámetros de la sentencia en ejecución, estimo acertado aprobarla.");
        parrafos.push("En consecuencia, **RESUELVO**:");

        const intimacionTexto = fallecimiento.herederos ? 
            "proceda a abonar a la parte actora las retroactividades aprobadas con más sus intereses a la fecha del efectivo pago" :
            "proceda a reajustar el haber previsional conforme a la liquidación aprobada, y abone a la parte actora las retroactividades aprobadas con más sus intereses a la fecha del efectivo pago";

        parrafos.push(`1.- Aprobar en cuanto ha lugar por derecho la liquidación presentada por la actora con fecha ${formatearFecha(fechas.liquidacion)}, quedando determinado el haber al ${formatearFecha(fechas.final)} en la suma de $ ${formatearMonto(montos.haber)} y las retroactividades en ${numeroALetras(montos.retroactivo)}.`);
        parrafos.push(`2.- **Intimar a la demandada para que en el plazo de diez (10) días**, ${intimacionTexto}, **bajo apercibimiento de proceder a la traba de embargo ejecutivo sin más trámite.**`);
        parrafos.push("**[Notifíquese por Secretaría a las partes de forma electrónica.]**");

        setGenerado(parrafos.join('\n\n'));
    };

    const copiarTexto = async () => {
        try {
            await navigator.clipboard.writeText(generado);
            alert('Texto copiado al portapapeles');
        } catch (err) {
            alert('Error al copiar');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h1 className="text-xl font-bold">Generador de Sentencia ACT + INT</h1>
                
                <section>
                    <h2 className="font-bold mb-2">Estado del Actor</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center">
                            <input 
                                type="checkbox"
                                className="mr-2"
                                checked={fallecimiento.pensionada}
                                onChange={e => setFallecimiento({pensionada: e.target.checked, herederos: false})}
                            />
                            <span>Fallecido con pensionada</span>
                        </label>
                        <label className="flex items-center">
                            <input 
                                type="checkbox"
                                className="mr-2"
                                checked={fallecimiento.herederos}
                                onChange={e => setFallecimiento({pensionada: false, herederos: e.target.checked})}
                            />
                            <span>Fallecido con herederos</span>
                        </label>
                    </div>
                </section>

                <section>
                    <h2 className="font-bold mb-2">Fechas</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1">Fecha de inicio</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={fechas.inicio}
                                onChange={e => handleFechaChange(e, 'inicio')}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Fecha final</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={fechas.final}
                                onChange={e => handleFechaChange(e, 'final')}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Fecha de liquidación</label>
                            <input
                               type="date"
                               className="w-full p-2 border rounded"
                               value={fechas.liquidacion}
                                onChange={e => handleFechaChange(e, 'liquidacion')}
                            />
                        </div>
                        </div>
                   </section>

        <section>
          <h2 className="font-bold mb-2">Montos</h2>
          <div className="grid grid-cols-2 gap-4">
            {[

              ['haber', 'Haber'],
              ['retroactivo', 'Retroactivo'],
              ['capital', 'Capital'],
              ['intereses', 'Intereses']
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={montos[key]}
                  onChange={e => handleMontoChange(e, key)}
                  placeholder="0,00"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">Tipo de Interés</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['corteEmbargo', 'Desde corte hasta embargo'],
              ['corteTransferencia', 'Desde corte hasta transferencia'],
              ['intimacionEmbargo', 'Desde intimación hasta embargo'],
              ['intimacionTransferencia', 'Desde intimación hasta transferencia']
            ].map(([id, label]) => (
              <label key={id} className="flex items-center">
                <input 
                  type="checkbox"
                  className="mr-2"
                  checked={tipoInteres === id}
                  onChange={e => e.target.checked ? setTipoInteres(id) : setTipoInteres('')}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">Impugnaciones ANSES</h2>
          <div className="flex items-center mb-4">
            <input 
              type="checkbox"
              className="mr-2"
              checked={ansesImpugno}
              onChange={e => setAnsesImpugno(e.target.checked)}
            />
            <span>ANSES impugnó la liquidación</span>
          </div>

          {ansesImpugno && (
            <div className="pl-6 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['a', 'Fechas incorrectas'],
                  ['b', 'Movilidad Badaro'],
                  ['c', 'Reajuste PBU'],
                  ['d', 'Tasa de interés'],
                  ['e', 'Haberes percibidos'],
                  ['f', 'Forma de descontar pagos'],
                  ['g', 'Topes legales'],
                  ['h', 'Precedente Villanustre'],
                  ['i', 'Impuesto a las Ganancias']
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center">
                    <input 
                      type="checkbox"
                      className="mr-2"
                      checked={impugnaciones[key]}
                      onChange={e => setImpugnaciones(prev => ({...prev, [key]: e.target.checked}))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="flex items-center">
              <input 
                type="checkbox"
                className="mr-2"
                checked={ansesPresentoLiquidacion}
                onChange={e => setAnsesPresentoLiquidacion(e.target.checked)}
              />
              <span>ANSES presentó liquidación</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            onClick={generarTexto}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generar Texto
          </button>
          <button
            onClick={copiarTexto}
            disabled={!generado}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Copiar Texto
          </button>
        </div>

        {generado && (
          <section className="mt-6">
            <h2 className="font-bold mb-2">Vista Previa</h2>
            <div
              className="p-4 border rounded whitespace-pre-wrap font-[Arial] text-[11px] leading-[1.5] text-justify"
              style={{textIndent: '1.27cm'}}
            >
              {generado}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SentenciaGenerator />
);

export default SentenciaGenerator;
