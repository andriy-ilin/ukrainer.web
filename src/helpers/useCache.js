import LRU from "lru-cache";
import md5 from "md5";

const cache = new LRU(50);
if (process.env.NODE_ENV === "development") {
  window.useWorkerCache = cache;
}

const useCache = async (func, args) => {
  const key = `${func.name}.${md5(JSON.stringify(args))}`;
  const value = cache.get(key) || { status: "new", data: null };
  if (value.status === "resolved") {
    return value.data;
  }

  const data = await func(...args);
  value.status = "resolved";
  value.data = data;

  cache.set(key, value);

  return value.data;
};

export default useCache;
