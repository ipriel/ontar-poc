import { Stack } from "@fluentui/react";
import { ErrorCircleRegular } from "@fluentui/react-icons";
import { CSSProperties } from "react";

const pageStyle: CSSProperties = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none"
};

const titleStyle: CSSProperties = {
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "36px",
    color: "white",
    display: "flex",
    alignItems: "flex-end",
    textAlign: "center",
    lineHeight: "24px",
    marginBlock: "18px"
};

const subtitleStyle: CSSProperties = {
    marginTop: "12px",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "38px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    width: "700px",
};

const NoPage = () => {
    return (
        <Stack style={pageStyle}>
            <ErrorCircleRegular style={{ color: '#C792FF', height: "150px", width: "150px" }} />
            <h1 style={titleStyle}>404</h1>
            <br/>
            <h2 style={subtitleStyle}><strong>Page Not Found</strong></h2>
        </Stack>
    );
};

export default NoPage;
