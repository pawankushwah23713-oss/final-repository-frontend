import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        🔍
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    background: "#fff",
    borderRadius: "20px",
    padding: "5px 10px",
  },
  input: {
    border: "none",
    outline: "none",
    padding: "8px",
    width: "200px",
  },
  button: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};