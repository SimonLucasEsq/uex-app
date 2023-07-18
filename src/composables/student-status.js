import i18n from "@/i18n"
import { useSelect } from "./select"

export function useStudentStatus() {
  const { includeBlankOptionObject } = useSelect()

  const statusMap = {
    insuficient: {
      color: "default",
    },
    to_be_submitted: {
      color: "warning",
    },
    submitted: {
      color: "success",
    },
  }

  function statusColor(status) {
    return statusMap[status]?.color
  }

  function statusLabel(status) {
    return i18n.global.t(`store.attributes.student.status.${status}`)
  }

  function statusOptions() {
    let options = []
    Object.keys(statusMap).forEach(status => {
      options.push({ name: statusLabel(status), value: status })
    })
    
    return includeBlankOptionObject(options, { titleKey: "name", valueKey: "value" })
  }

  return {
    statusColor,
    statusLabel,
    statusOptions,
  }
}
