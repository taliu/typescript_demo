import { sayHello } from "./say";
sayHello('I love typescript!').then(o=>console.log(o)).catch(err=>console.log(err));