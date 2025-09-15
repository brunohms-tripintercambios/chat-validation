"use client";

import { useState } from "react";

import styles from "./form.module.css";

type Field = "userId" | "message" | "ids";

type LogItem = {
  type: "result" | "error";
  message: string;
  elapsed?: number;
};

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
  const [logs, setLogs] = useState<LogItem[]>([]);

  function addResult(newResult: string, elapsed?: number) {
    setLogs(prev => [{ type: "result", message: newResult, elapsed }, ...prev]);
  }

  function addError(newError: string) {
    setLogs(prev => [{ type: "error", message: newError }, ...prev]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { method, userId, message, endpointPath, ids } }),
      });
      const { data, elapsed, error: errMsg } = await res.json();

      if (!res.ok) {
        addError(errMsg || "Request failed");
      } else {
        const dataWithMessage = { ...data, requestMessage: message };

        addResult(dataWithMessage, elapsed);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        addError(err?.message || "Network error");
      } else {
        addError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }

  function generateRandomId(length = 28) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function handleGenerate(e: React.MouseEvent<HTMLButtonElement>) {
    const newId = generateRandomId();
    setUserId(newId);
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        {fields.includes("userId") && (
          <label className={styles.label}>
            <div className={styles.userIdRow}>
              <p>ID do usuário</p>
              <button
                type="button"
                onClick={handleGenerate}
                className={styles.userIdButton}
              >
                Gerar ID
              </button>
            </div>
            <input
              type="text"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  onSubmit(e);
                }
              }}
            />
          </label>
        )}

        <button
          className={styles.button}
          type="submit"
          disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {logs.length > 0 && (
        <div className={styles.logsWrapper}>
          {logs.map((log, idx) => (
            <div key={idx} className={styles.resultBox}>
              <pre className={log.type === "error" ? styles.error : styles.pre}>
                {log.elapsed && (
                  <div className={styles.meta}>Tempo da request: {log.elapsed.toFixed(0)} ms</div>
                )}
                {log.type === "error"
                  ? `Erro: ${log.message}`
                  : JSON.stringify(log.message, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
