import { useWallet } from "./contexts/session-provider.tsx";
import { AccountInfo, styles } from "./components/Account.tsx";

export function Test() {
  const wallet = useWallet();

  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        color: "white",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "2%",
      }}
    >
      {!wallet.data.address && (
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-8">
            <div style={styles.card}>
              <img
                alt="login_logo"
                src="https://cdn3d.iconscout.com/3d/premium/thumb/social-media-5806306-4863035.png?f=webp"
                width="200px"
              />
              <h6
                style={{
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                Login to Web3Auth
              </h6>
              <h6 style={{ color: "#000000", fontWeight: 300, fontSize: 16 }}>
                Login with your favourite social account to enable the world of
                crypto
              </h6>
              <button
                style={{
                  marginTop: 10,
                  backgroundColor: "#8347E5",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "0.5625rem",
                  width: "100%",
                  height: 44,
                  fontWeight: 600,
                  border: "none",
                }}
                onClick={wallet.login}
              >
                Login with social
              </button>
            </div>
          </div>
        </div>
      )}

      {wallet.data.address && (
        <>
          <AccountInfo />
        </>
      )}
    </div>
  );
}
