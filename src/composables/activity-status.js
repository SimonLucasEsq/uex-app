
export function useActivityStatus() {
  const statusMap = {
    draft: {
      label: "Borrador",
      action: "Borrador",
      color: "default",
      actionColor: "primary",
      icon: "",
      prevStatus: null,
      nextStatus: ["evaluated"],
    },
    evaluated: {
      label: "Evaluado",
      action: "Evaluar",
      actionColor: "primary",
      color: "info",
      icon: "tabler-clipboard-check",
      prevStatus: "draft",
      nextStatus: ["sent_to_deanery"],
    },
    declined: {
      label: "Declinado",
      action: "Declinar",
      actionColor: "primary",
      color: "error",
      icon: "tabler-file-off",
      prevStatus: "draft",
      nextStatus: [],
    },
    sent_to_deanery: {
      label: "Elevado",
      action: "Elevar",
      actionColor: "primary",
      color: "warning",
      icon: "tabler-square-arrow-up",
      prevStatus: "evaluated",
      nextStatus: ["approved", "rejected"],
    },
    approved: {
      label: "Aprobado",
      action: "Aprobar",
      actionColor: "primary",
      color: "success",
      icon: "tabler-circle-check",
      prevStatus: null,
      nextStatus: [],
    },
    rejected: {
      label: "Rechazado",
      action: "Rechazar",
      actionColor: "error",
      color: "error",
      icon: "tabler-circle-x",
      prevStatus: "draft",
      nextStatus: [],
    },
  }

  function statusLabel(status) {
    return statusMap[status]?.label
  }

  function statusActionLabel(status) {
    return statusMap[status]?.action
  }

  function statusColor(status) {
    return statusMap[status]?.color
  }

  function statusActionColor(status) {
    return statusMap[status]?.actionColor
  }

  function statusIcon(status) {
    return statusMap[status]?.icon
  }

  function getPrevStatus(status) {
    return statusMap[status]?.prevStatus
  }

  function getNextStatus(status) {
    return statusMap[status]?.nextStatus
  }

  function prevStatusLabel(status) {
    return `Volver a ${statusLabel(status)}`
  }

  return {
    statusLabel,
    statusActionLabel,
    statusColor,
    statusActionColor,
    statusIcon,
    getPrevStatus,
    getNextStatus,
    prevStatusLabel,
  }
}
