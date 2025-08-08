"use client";

import { useState } from "react";

import styles from "./form.module.css";

type Field = "userId" | "message" | "ids";

type Props = {
  title: string;
  endpointPath: string;
  method: string;
  fields?: Field[];
};

export default function RequestForm({ title, endpointPath, method, fields = ["userId", "message"] }: Props) {
  const [userId, setUserId] = useState("");
  const [ids, setIds] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setElapsed(null);

    try {
      const res = await fetch("/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { method, userId, message, endpointPath, ids } }),
      });
      const { data, elapsed, error: errMsg } = await res.json();

      if (!res.ok) {
        setError(errMsg || "Request failed");
      } else {
        setResult(data);
        setElapsed(elapsed);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message || "Network error");
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        {fields.includes("userId") && (
          <label className={styles.label}>
            ID do usuário
            <input
              className={styles.input}
              placeholder="ex: 123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </label>
        )}

        {fields.includes("ids") && (
          <label className={styles.label}>
            ID do usuário
            <input
              className={styles.input}
              placeholder="ex: 123"
              value={ids}
              onChange={(e) => setIds(e.target.value)}
              required
            />
          </label>
        )}

        {fields.includes("message") && (
          <label className={styles.label}>
            Mensagem
            <textarea
              className={styles.textarea}
              placeholder="Digite a mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
          </label>
        )}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {(result || error) && (
        <div className={styles.resultBox}>
          {elapsed !== null && (
            <div className={styles.meta}>Tempo da request: {elapsed.toFixed(0)} ms</div>
          )}
          {error && <pre className={styles.error}>Erro: {error}</pre>}
          {result && !error && (
            <pre className={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
