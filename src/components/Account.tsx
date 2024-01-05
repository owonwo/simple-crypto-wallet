import { useWallet } from "../contexts/wallet-provider.tsx";

export let styles = {
  button: {
    width: "100%",
    maxWidth: 200,
    cursor: "pointer",
    background: "#0164FF",
    boxSizing: "border-box",
    borderRadius: "15px",
    fontSize: 16,
    color: "#f9f9f9",
    fontWeight: 700,
    padding: "12px 30px 12px 30px",
    marginTop: 4,
    display: "flex",
    justifyContent: "center",
    border: "none",
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: 400,
    height: "100%",
    minHeight: 200,
    border: "10px solid #f9f9f9",
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.03)",
    borderRadius: "1rem",
    "&:hover": {
      boxShadow: "0px 24px 33px -9px #0000005C",
    },
  },
};

export function AccountInfo() {
  const wallet = useWallet();

  return (
    <div className="row">
      <div className="col-md-8">
        <div style={styles.card}>
          <img
            alt="web3auth_logo"
            src="https://res.cloudinary.com/beincrypto/image/upload/v1661461003/logos/ukflgfdxacovx9yzyrr4.png"
            width="120px"
          />
          <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 20 }}>
            Successfully Logged In
          </h6>
          <div style={{ marginTop: 20, textAlign: "left", color: "black" }}>
            <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
              User Info:
            </h6>
            <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
              <span style={{ fontSize: 12 }}>
                <strong>
                  {wallet.data.userData && wallet.data.userData.name}
                </strong>{" "}
                - {wallet.data.userData && wallet.data.userData.email}
              </span>
            </p>{" "}
            <br />
            <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
              User wallet address:
            </h6>
            <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
              {wallet.data.address}
            </p>
            <br />
            <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
              ChainId:
            </h6>
            <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
              {wallet.data.chainId}
            </p>
            <br />
            <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
              Balance:
            </h6>
            <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
              {wallet.data.balance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
