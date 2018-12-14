import { useState, useEffect, useCallback, useReducer } from "react";
import ls from "localforage";

const getStoredValue = async (key, initialValue) => {
  const value = await ls.getItem(key);
  return value != null ? value : initialValue;
};

export const useStoredState = ({
  initialValue,
  key,
  mapResult = val => val
}) => {
  const [v, setState] = useState({ value: initialValue, loading: true });
  useEffect(
    () => {
      getStoredValue(key, initialValue).then(value => {
        setState({ value, loading: false });
      });
    },
    [key]
  );

  const setStoredState = useCallback(
    async value => {
      try {
        const update = { value: { ...v.value, ...value }, loading: false };
        setState(update);
        await ls.setItem(key, update.value);
      } catch (e) {
        setState({ value: v, loading: false });
      }
    },
    [key, v]
  );

  const { value, loading } = v;
  return [mapResult(value), loading, setStoredState];
};
