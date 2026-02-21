import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";

type User = {
  _id?: string;
  name: string;
  email: string;
};

function App() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");

  // Use Vite env variable (must start with VITE_) with a safe fallback.
  const base_url: string = (import.meta.env.VITE_BASE_URL as string) || "http://localhost:5000";

const fetchUsers = async (): Promise<void> => {
  try {
  const response = await fetch(`${base_url}/api/users`);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to fetch users");
    }

    const result = await response.json();

    // 👇 FIX HERE
    if (Array.isArray(result)) {
      setUsers(result);
    } else if (Array.isArray(result.data)) {
      setUsers(result.data);
    } else {
      setUsers([]);
    }

  } catch (err: unknown) {
    console.error("fetchUsers error:", err);
  }
};

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Please provide both name and email.");
      return;
    }

    try {
  const response = await fetch(`${base_url}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to save user");
      }

      // Option A: re-fetch list from server to ensure consistency
      await fetchUsers();

      setName("");
      setEmail("");
      setMessage("User saved ✅");
      // clear message after a short delay
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      console.error("handleSubmit error:", err);
      const msg = err instanceof Error ? err.message : String(err ?? "Could not save user");
      setMessage(msg);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>User Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Save</button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>All Users</h2>

      {(Array.isArray(users) && users.length === 0) ? (
        <p>No users yet.</p>
      ) : (
        (Array.isArray(users) ? users : []).map((user, i) => (
          <div key={user._id ?? `${user.email}-${i}`}>
            <strong>{user.name}</strong> — {user.email}
          </div>
        ))
      )}
    </div>
  );
}

export default App;