"use server"

export async function getAllEmployee() {
    const res = await fetch("http://localhost:7169/api/Employee");
    const data = res.json();
    console.log(data, "data");
    return data;
}