export function useTextUtil() {
  function booleanTranslate(boolean) {
    return boolean ? "Sí" : "No"
  }

  return { booleanTranslate }
}
