import React from "react";

// LICENSE and Source Code message component
function LicenseAndSource() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                background: "transparent",
                overflow: "hidden",
                position: "relative",
                fontFamily: "system-ui,Roboto,sans-serif",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    background: "rgba(0,0,0,0.42)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 16,
                    padding: "24px 32px",
                    fontWeight: 500,
                    boxShadow: "0 1px 6px #0002",
                    backdropFilter: "blur(2px)",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                <div>
                    <strong>LICENSE</strong>: MIT<br />
                    <span>
                        Source code available on{" "}
                        <a
                            href="https://github.com/TheusHen"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#ff3131", textDecoration: "underline" }}
                        >
                            GitHub
                        </a>
                        .
                    </span>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "18px",
                    marginTop: 24,
                }}
            >
                <button
                    style={{
                        background: "rgba(0,0,0,0.42)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 15,
                        padding: "10px 28px",
                        fontWeight: 500,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0002",
                        outline: "none",
                        transition: "background 0.18s",
                    }}
                >
                    Action 1
                </button>
                <button
                    style={{
                        background: "rgba(0,0,0,0.42)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 15,
                        padding: "10px 28px",
                        fontWeight: 500,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0002",
                        outline: "none",
                        transition: "background 0.18s",
                    }}
                >
                    Action 2
                </button>
            </div>
        </div>
    );
}

export default LicenseAndSource;
