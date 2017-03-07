import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    sayHello(name).then(text=>{
       elt.innerText = text;
    }).catch(err=>console.log("error:",err));
    console.log('hello world');
}

showHello("greeting", "TypeScript");