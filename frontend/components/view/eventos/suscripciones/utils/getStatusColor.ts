import { EstatusPagoEvento } from "@/global/enums";

const styleGeneral = "w-[100px] flex justify-center text-white font-medium rounded-full";

const colors: Record<EstatusPagoEvento, string> = {
  [EstatusPagoEvento.PENDIENTE]: `bg-yellow-500 ${styleGeneral}`,
  [EstatusPagoEvento.PAGADO]: `bg-green-500 ${styleGeneral}`,
  [EstatusPagoEvento.RECHAZADO]: `bg-red-500 ${styleGeneral}`,
  [EstatusPagoEvento.ASISTIO]: `bg-blue-500 ${styleGeneral}`,
  [EstatusPagoEvento.NO_ASISTIO]: `bg-gray-500 ${styleGeneral}`,
};

const getStatusColor = (status: EstatusPagoEvento) => {
  return colors[status] || `bg-gray-500 ${styleGeneral}`;
};

export default getStatusColor;
