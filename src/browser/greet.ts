export async function sayHello(name: string) {
    return await Promise.resolve(` my name is ${name}`);
}