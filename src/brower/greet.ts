export async function sayHello(name: string) {
    return await Promise.resolve(`Hello from ${name}`);
}