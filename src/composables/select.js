import { useArrayUtils } from "./array-utils"

export function useSelect() {
  const defaultTitle = "Todos"
  const defaultValue = ""

  const sexOptions = [
    { name: "Masculino", value: "male" },
    { name: "Femenino", value: "female" },
  ]

  const semesterOptions = [
    { name: "Ambos", value: "" },
    { name: "Primer Semestre", value: "first_semester" },
    { name: "Segundo Semestre", value: "second_semester" },
  ]

  function includeBlankOptionObject(records, options = {}) {
    let blankOption = {}

    if (options["titleKey"]){
      blankOption[options["titleKey"]] = options["title"] || defaultTitle
    }

    if (options["valueKey"]){
      blankOption[options["valueKey"]] = options["value"] || defaultValue
    }

    return [blankOption].concat(records)
  }

  function includeBlankOption(records, value="") {
    return [value].concat(records)
  }

  function yearOptions() {
    let initialYear = 1996
    const currentDate = new Date()
    let currentYear= currentDate.getFullYear()

    return useArrayUtils().range(initialYear, currentYear).reverse()
  }

  return { sexOptions, semesterOptions, includeBlankOption, includeBlankOptionObject, yearOptions }
}
