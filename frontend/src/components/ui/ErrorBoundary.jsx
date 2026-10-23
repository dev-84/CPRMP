import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CPRMP Root Error Caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF9F6",
            color: "#172B24",
            fontFamily: "Inter, sans-serif",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              background: "#FFFFFF",
              border: "1px solid #E5E7E1",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#FCEAEA",
                color: "#B93838",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              !
            </div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#172B24",
              }}
            >
              Portal Encountered an Issue
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#68766D",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              An unexpected display error occurred while rendering the page.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  background: "#F3F4EF",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  textAlign: "left",
                  overflowX: "auto",
                  marginBottom: "24px",
                  color: "#B93838",
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3F754B",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#FFFFFF",
                  color: "#172B24",
                  border: "1px solid #E5E7E1",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
