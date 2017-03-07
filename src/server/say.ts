export async function sayHello(name: string) {
    if(name){
        throw Error('i am error!');
    }
    return await Promise.resolve(`Hello from ${name}`);
}