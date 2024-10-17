const platformColors = {
    "Android": "purple",
    "Google Stadia": "red",
    "Linux": "teal",
    "Mac": "amber",
    "Nintendo DS": "yellow",
    "Nintendo Switch": "orange",
    "PC": "gray",
    "PlayStation": "blue",
    "Wii U": "pink",
    "Xbox": "green",
    "iOS": "indigo",
};

export default function getPlatformColor(platform) {
    return platformColors[platform] || "white";
}
