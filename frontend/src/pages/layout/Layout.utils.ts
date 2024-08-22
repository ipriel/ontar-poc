export async function fetchJson<T>(url: string) {
    const data = await fetch(url);
    const json: T = await data.json();
    return json;
}


//Needs to be async as react-use-websocket expects an async function
export async function getWSUrl() {
    const protocol = "ws" + window.location.protocol.slice(4);
    return `${protocol}//${window.location.host}/notifier`;
}