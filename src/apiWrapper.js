const BASE_URL = "https://script.google.com/macros/s/AKfycbxRMuHYRZEucasmnhlbqQXvGyepb5Y-7kvoykFoCCxUqWQX8qYxGG_mcsHtOr3AzaO4TA/exec";

export async function callLoginApi(token){
    const res = await fetch(`${BASE_URL}?type=login&token=${token}`, {
        method: "GET",
        redirect: "follow"
    });
    return await res.json();
}
export default async function callGetApi(type){
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}?type=${type}&token=${token}`);
    return await res.json();
}

export async function callPostApi(type, body){
    const token = localStorage.getItem("token");
    var options = {
        method: "POST", // Method should be uppercase "POST"
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    // console.log(JSON.stringify(body));
    const url = `/google-script-proxy`+ BASE_URL.replaceAll("https://script.google.com", "") + `?type=${type}&token=${token}`;

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorData = await res.text();
            console.error('API Error:', res.status, errorData);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        // console.log(res.body);
        return await res.json();
        
    } catch (error) {
        console.error("Fetch request failed:", error);
        throw error;
    }
}