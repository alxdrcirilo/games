const storeColors = {
  GOG: "purple",
  Steam: "gray",
  Ubisoft: "blue",
  EA: "orange"
};

export default function getStoreColor(store) {
  return storeColors[store] || "white";
}
