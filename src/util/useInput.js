import { useState, useCallback } from "react";

export const useInput = v => {
  const [value, setValue] = useState(v);
  const onValueChange = useCallback(e => setValue(e.target.value), []);

  return [value, onValueChange];
};
