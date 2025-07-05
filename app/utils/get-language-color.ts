export const getLanguageColor = (language: string) => {
  const colors: { [key: string]: string } = {
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    HTML: "bg-red-500",
    CSS: "bg-blue-400",
  }
  return colors[language] || "bg-gray-500"
}
