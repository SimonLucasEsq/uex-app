export function useSelect() {
  const defaultTitle = "Todos"
  const defaultValue = null

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

  return { includeBlankOption, includeBlankOptionObject }
}
