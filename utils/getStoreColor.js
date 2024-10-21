const storeColors = {
  GOG: "purple",
  Steam: "indigo",
  Ubisoft: "blue",
  EA: "orange"
};

export default function getStoreColor(store) {
  return storeColors[store] || "white";
}
