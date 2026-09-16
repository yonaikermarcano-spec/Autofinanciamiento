import { InttProcedure, LoanContract } from '../../types';

export class InttLegalModule {
  /**
   * Genera el texto del documento legal de Descargo de Responsabilidad por Retrasos del INTT
   */
  public static generateInttDisclaimerDocument(params: {
    clientName: string;
    clientDocId: string;
    vehicleBrand: string;
    vehicleModel: string;
    vinChassis: string;
    engineSerial: string;
    companyLegalName: string;
    companyRif: string;
  }): string {
    return (
      `================================================================================\n` +
      `ANEXO CONTRACTUAL: DECLARACIÓN DE DESCARGO Y CONOCIMIENTO DE TRÁMITES ANTE EL INTT\n` +
      `================================================================================\n\n` +
      `Yo, ${params.clientName}, titular de la Cédula de Identidad/RIF N° ${params.clientDocId}, ` +
      `declaro de forma voluntaria, expresa e irrevocable que:\n\n` +
      `PRIMERO: He adquirido mediante financiamiento con reserva de dominio de la empresa ` +
      `${params.companyLegalName} (RIF: ${params.companyRif}) el vehículo marca ${params.vehicleBrand}, ` +
      `modelo ${params.vehicleModel}, Serial de Carrocería (VIN): ${params.vinChassis}, Serial de Motor: ${params.engineSerial}.\n\n` +
      `SEGUNDO: Reconozco y acepto que la gestión de Registro Original, Asignación de Placas y ` +
      `Certificado de Registro de Vehículo (Título de Propiedad) se tramita ante el Instituto Nacional de ` +
      `Transporte Terrestre (INTT) y los organismos de Tránsito competentes.\n\n` +
      `TERCERO: Entiendo y asumo que los tiempos de emisión, posibles retrasos operativos, caídas de ` +
      `plataforma digital o reprogramación de citas técnicas del INTT constituyen situaciones de fuerza mayor ` +
      `absolutamente ajenas a la voluntad y responsabilidad de ${params.companyLegalName}.\n\n` +
      `CUARTO: Eximo a ${params.companyLegalName} de cualquier responsabilidad civil, mercantil o administrativa ` +
      `por demoras imputables exclusivamente a los entes gubernamentales antes señalados.\n\n` +
      `En señal de conformidad y aceptación, firmo a los ${new Date().toLocaleDateString('es-VE')}.\n\n` +
      `_____________________________\n` +
      `FIRMA DEL CLIENTE / ADQUIRIENTE\n` +
      `C.I. / RIF: ${params.clientDocId}\n`
    );
  }

  /**
   * Genera el Finiquito y Carta de Liberación de Reserva de Dominio al liquidar el 100% de la deuda
   */
  public static generateSettlementAndReleaseDocument(params: {
    contract: LoanContract;
    companyLegalName: string;
    companyRif: string;
    notaryCity: string;
  }): string {
    return (
      `================================================================================\n` +
      `DOCUMENTO DE FINIQUITO TOTAL Y LIBERACIÓN DE RESERVA DE DOMINIO\n` +
      `================================================================================\n\n` +
      `Ciudad de ${params.notaryCity}, a los ${new Date().toLocaleDateString('es-VE')}.\n\n` +
      `Por medio del presente documento, la sociedad mercantil ${params.companyLegalName}, ` +
      `inscrita bajo el RIF ${params.companyRif}, debidamente representada en este acto, hace constar que:\n\n` +
      `1. El(La) ciudadano(a) ${params.contract.clientName}, titular de la C.I./RIF ${params.contract.clientDocId}, ` +
      `ha CANCELADO EN SU TOTALIDAD (100%) el capital financiado, intereses devengados, gastos administrativos ` +
      `y el Impuesto al Valor Agregado (IVA) correspondiente al Contrato N° ${params.contract.contractNumber}.\n\n` +
      `2. Sobre el vehículo:\n` +
      `   - Tipo: ${params.contract.vehicle.type}\n` +
      `   - Marca: ${params.contract.vehicle.brand}\n` +
      `   - Modelo: ${params.contract.vehicle.model} (Año: ${params.contract.vehicle.year})\n` +
      `   - Serial de Carrocería (VIN): ${params.contract.vehicle.vinChassis}\n` +
      `   - Serial de Motor: ${params.contract.vehicle.engineSerial}\n` +
      `   - Placa: ${params.contract.vehicle.plate || 'EN TRÁMITE'}\n\n` +
      `3. En consecuencia, ${params.companyLegalName} OTORGA FINIQUITO DEFINITIVO y SOLVENCIA TOTAL, ` +
      `y DECLARA EXTINGUIDA Y LIBERADA LA RESERVA DE DOMINIO que pesaba sobre el mencionado vehículo, ` +
      `autorizando al ciudadano adquirente para que tramite de forma directa ante el Instituto Nacional de ` +
      `Transporte Terrestre (INTT) y Notarías Públicas el correspondiente traspaso de propiedad a su exclusivo nombre.\n\n` +
      `_________________________________________\n` +
      `POR: ${params.companyLegalName}\n` +
      `REPRESENTANTE LEGAL / APODERADO\n`
    );
  }
}