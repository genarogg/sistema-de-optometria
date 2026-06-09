import { EstatusSuscripcion } from "@/global/enums";

const styleGeneral = "w-[100px] flex justify-center text-white font-medium rounded-full";

const colors: Record<EstatusSuscripcion, string> = {
  [EstatusSuscripcion.PENDIENTE]: `bg-yellow-500 ${styleGeneral}`,
  [EstatusSuscripcion.VALIDADO]: `bg-green-500 ${styleGeneral}`,
  [EstatusSuscripcion.RECHAZADA]: `bg-red-500 ${styleGeneral}`,
  [EstatusSuscripcion.VENCIDO]: `bg-gray-500 ${styleGeneral}`,
};

const getStatusColor = (status: EstatusSuscripcion) => {
  return colors[status] || `bg-gray-500 ${styleGeneral}`;
};

export default getStatusColor;
