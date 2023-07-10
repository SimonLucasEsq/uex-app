export function useTextUtil() {
  function booleanTranslate(boolean) {
    return boolean ? "Sí" : "No"
  }

  function formatRecordsByAttribute(records, key) {
    return records.reduce(
      (acumulator, currentItem) => {
        return !acumulator ? currentItem[key] : `${acumulator}, ${currentItem[key]}`
      }, '')
  }

  return { booleanTranslate, formatRecordsByAttribute }
}
