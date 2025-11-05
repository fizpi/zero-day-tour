const BASE_URL = "https://script.google.com/macros/s/AKfycbzT0d6vLhXgIHwYadeFjIh1qllSBaqdg6h2zq3mtIqzBqTbMuBppJhy6QNqE28kK1Px8g/exec";

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
    console.log(JSON.stringify(body));
    const res = await fetch(`${BASE_URL}?type=${type}&token=${token}`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body)
    });
    console.log(res.body);
    return await res.json();
}