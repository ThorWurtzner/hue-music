import axios from "axios";
import { useContext, useEffect } from "react";
import TokenContext from "../tokenContext";
import { navigate } from "@reach/router";

// acquires and uses the response object gotten from spotify
export default function Callback(props) {

    var [token, setToken] = useContext(TokenContext);
    var code = new URLSearchParams(props.location.search).get("code");

    useEffect(function() {
        axios.post("/.netlify/functions/token", JSON.stringify({
            code
        }))
        .then(response => {
            setToken(response.data);
            navigate("/player");
        });
    }, [token, setToken, code]);
    
    return null;
}